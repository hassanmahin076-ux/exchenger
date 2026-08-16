import { NextResponse } from 'next/server';
import pool, { query } from '@/lib/db';
import { initializeDatabase } from '@/lib/initDb';

export async function POST(request) {
  try {
    await initializeDatabase();
    const body = await request.json().catch(() => ({}));
    const { userEmail, userUid, isNewVisit } = body;

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // 1. Increment total site visitors if this is a new session / visit
      if (isNewVisit !== false) {
        await client.query(`
          UPDATE site_analytics
          SET total_visitors = total_visitors + 1,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = 1;
        `);

        // Record into daily_visitor_stats table
        await client.query(`
          INSERT INTO daily_visitor_stats (visit_date, unique_visitors, active_users, page_views)
          VALUES (CURRENT_DATE, 1, 1, 1)
          ON CONFLICT (visit_date)
          DO UPDATE SET
            unique_visitors = daily_visitor_stats.unique_visitors + 1,
            active_users = daily_visitor_stats.active_users + 1,
            page_views = daily_visitor_stats.page_views + 1,
            updated_at = CURRENT_TIMESTAMP;
        `);
      }

      // 2. Update user's last_active_at timestamp if user details are provided
      if (userUid || userEmail) {
        await client.query(
          `UPDATE users
           SET last_active_at = CURRENT_TIMESTAMP
           WHERE uid = $1 OR (email IS NOT NULL AND LOWER(email) = LOWER($2));`,
          [userUid || null, userEmail || null]
        );
      }

      // 3. Count online users active within last 15 minutes
      const activeUsersRes = await client.query(`
        SELECT COUNT(*) AS active_count
        FROM users
        WHERE last_active_at >= NOW() - INTERVAL '15 minutes';
      `);

      const activeCount = parseInt(activeUsersRes.rows[0].active_count, 10);
      const onlineUsersCount = Math.max(activeCount, 1);

      // 4. Sync online_users counter in site_analytics
      await client.query(
        `UPDATE site_analytics
         SET online_users = $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = 1;`,
        [onlineUsersCount]
      );

      // 5. Get current updated analytics values
      const analyticsRes = await client.query(
        `SELECT total_visitors, online_users FROM site_analytics WHERE id = 1;`
      );

      await client.query('COMMIT');
      client.release();

      const stats = analyticsRes.rows[0] || { total_visitors: 12840, online_users: onlineUsersCount };

      return NextResponse.json({
        success: true,
        totalVisitors: parseInt(stats.total_visitors, 10),
        onlineUsers: parseInt(stats.online_users, 10)
      });
    } catch (dbErr) {
      await client.query('ROLLBACK');
      client.release();
      throw dbErr;
    }
  } catch (error) {
    console.error('Visitor Analytics API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record visitor analytics' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await initializeDatabase();

    const activeUsersRes = await query(`
      SELECT COUNT(*) AS active_count
      FROM users
      WHERE last_active_at >= NOW() - INTERVAL '15 minutes';
    `);

    const activeCount = parseInt(activeUsersRes.rows[0].active_count, 10);
    const onlineUsersCount = Math.max(activeCount, 1);

    const analyticsRes = await query(`SELECT total_visitors, online_users FROM site_analytics WHERE id = 1;`);
    const totalVisitors = analyticsRes.rows.length > 0 ? parseInt(analyticsRes.rows[0].total_visitors, 10) : 12840;

    return NextResponse.json({
      success: true,
      totalVisitors,
      onlineUsers: onlineUsersCount
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

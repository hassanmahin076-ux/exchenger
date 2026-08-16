import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { initializeDatabase } from '@/lib/initDb';

export async function GET(request) {
  try {
    await initializeDatabase();
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid') || '';
    const email = searchParams.get('email') || '';

    if (!uid && !email) {
      return NextResponse.json({ success: false, notifications: [] });
    }

    // Lookup user ID
    const userRes = await query(
      `SELECT id FROM users WHERE (uid IS NOT NULL AND uid = $1) OR (email IS NOT NULL AND LOWER(email) = LOWER($2));`,
      [uid || 'NO_UID', email.toLowerCase() || 'NO_EMAIL']
    );

    if (userRes.rows.length === 0) {
      return NextResponse.json({ success: true, notifications: [] });
    }

    const userId = userRes.rows[0].id;

    // Fetch unread notifications
    const notifRes = await query(
      `SELECT id, title, message, type, amount, created_at 
       FROM user_notifications 
       WHERE user_id = $1 AND is_read = false 
       ORDER BY created_at DESC;`,
      [userId]
    );

    return NextResponse.json({
      success: true,
      notifications: notifRes.rows.map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        amount: Number(n.amount),
        createdAt: n.created_at
      }))
    });
  } catch (error) {
    console.error('Fetch User Notifications API Error:', error);
    return NextResponse.json({ success: false, notifications: [] }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await initializeDatabase();
    const body = await request.json();
    const { notificationId, markAllRead, uid } = body;

    if (markAllRead && uid) {
      await query(
        `UPDATE user_notifications 
         SET is_read = true 
         WHERE user_id = (SELECT id FROM users WHERE uid = $1);`,
        [uid]
      );
    } else if (notificationId) {
      await query(
        `UPDATE user_notifications SET is_read = true WHERE id = $1;`,
        [notificationId]
      );
    }

    return NextResponse.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark Notification Read API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

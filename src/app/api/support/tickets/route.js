import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { initializeDatabase } from '@/lib/initDb';

export async function GET(request) {
  try {
    await initializeDatabase();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email')?.trim();
    const isAdmin = searchParams.get('admin') === 'true';

    let sql = `SELECT id, ticket_code, user_email, subject, message, reply, status, created_at, updated_at FROM support_tickets `;
    let values = [];

    if (email && !isAdmin) {
      sql += `WHERE LOWER(user_email) = LOWER($1) ORDER BY id DESC;`;
      values.push(email);
    } else {
      sql += `ORDER BY id DESC;`;
    }

    const result = await query(sql, values);

    return NextResponse.json({
      success: true,
      tickets: result.rows || []
    });

  } catch (error) {
    console.error('Fetch Support Tickets Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch support tickets.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await initializeDatabase();
    const body = await request.json();
    const { email, subject = 'General Query', message } = body;

    const userEmail = (email || '').trim().toLowerCase();
    const msgText = (message || '').trim();

    if (!userEmail || !userEmail.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email address is required.' },
        { status: 400 }
      );
    }

    if (!msgText) {
      return NextResponse.json(
        { success: false, error: 'Message description cannot be empty.' },
        { status: 400 }
      );
    }

    // Find optional user_id from users table if registered
    let userId = null;
    try {
      const userRes = await query('SELECT id FROM users WHERE LOWER(email) = LOWER($1);', [userEmail]);
      if (userRes.rows.length > 0) {
        userId = userRes.rows[0].id;
      }
    } catch (e) {}

    // Generate unique 6-digit ticket code
    const ticketCode = `TICK-${Math.floor(100000 + Math.random() * 900000)}`;

    const insertRes = await query(
      `INSERT INTO support_tickets (ticket_code, user_email, user_id, subject, message, status)
       VALUES ($1, $2, $3, $4, $5, 'open')
       RETURNING id, ticket_code, user_email, subject, message, reply, status, created_at;`,
      [ticketCode, userEmail, userId, subject, msgText]
    );

    const newTicket = insertRes.rows[0];

    return NextResponse.json({
      success: true,
      message: 'Support ticket submitted successfully!',
      ticket: newTicket
    });

  } catch (error) {
    console.error('Create Support Ticket Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit support ticket.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await initializeDatabase();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email')?.trim();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email parameter is required.' },
        { status: 400 }
      );
    }

    const deleteResult = await query(
      `DELETE FROM support_tickets WHERE LOWER(user_email) = LOWER($1);`,
      [email]
    );

    return NextResponse.json({
      success: true,
      message: `Deleted ${deleteResult.rowCount} tickets for ${email}`
    });

  } catch (error) {
    console.error('Delete Support Tickets Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete support tickets.' },
      { status: 500 }
    );
  }
}

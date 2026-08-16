import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { initializeDatabase } from '@/lib/initDb';

export async function POST(request) {
  try {
    await initializeDatabase();
    const body = await request.json();
    const { ticketId, replyMessage } = body;

    if (!ticketId) {
      return NextResponse.json(
        { success: false, error: 'Ticket ID is required.' },
        { status: 400 }
      );
    }

    const replyText = (replyMessage || '').trim();
    if (!replyText) {
      return NextResponse.json(
        { success: false, error: 'Reply message cannot be empty.' },
        { status: 400 }
      );
    }

    // Update ticket with reply & status
    const updateRes = await query(
      `UPDATE support_tickets 
       SET reply = $1, status = 'resolved', updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING id, ticket_code, user_email, user_id, subject, message, reply, status, updated_at;`,
      [replyText, ticketId]
    );

    if (updateRes.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Support ticket not found.' },
        { status: 404 }
      );
    }

    const updatedTicket = updateRes.rows[0];

    // Optionally notify user if registered
    if (updatedTicket.user_id) {
      try {
        await query(
          `INSERT INTO user_notifications (user_id, title, message, type)
           VALUES ($1, $2, $3, 'system');`,
          [
            updatedTicket.user_id,
            `Support Ticket Resolved (${updatedTicket.ticket_code})`,
            `Agent Reply: ${replyText}`
          ]
        );
      } catch (e) {
        console.warn('Failed to insert user_notification for support reply:', e);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Reply sent successfully!',
      ticket: updatedTicket
    });

  } catch (error) {
    console.error('Admin Support Reply Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send support reply.' },
      { status: 500 }
    );
  }
}

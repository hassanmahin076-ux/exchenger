import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { query } from '@/lib/db';
import { initializeDatabase } from '@/lib/initDb';

const STORAGE_DIR = path.join(process.cwd(), 'storage', 'kyc');

async function ensureStorageDir() {
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
  } catch (err) {
    console.error('Error creating storage directory:', err);
  }
}

async function saveBase64Image(base64Data, filename) {
  if (!base64Data) return null;
  await ensureStorageDir();

  // Strip base64 metadata prefix if present (e.g., "data:image/png;base64,")
  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  const buffer = matches ? Buffer.from(matches[2], 'base64') : Buffer.from(base64Data, 'base64');
  
  const filePath = path.join(STORAGE_DIR, filename);
  await fs.writeFile(filePath, buffer);
  return filename;
}

export async function POST(request) {
  try {
    await initializeDatabase();
    const body = await request.json();
    const { userUid, userEmail, firstName, lastName, fullName, country, documentType, idNumber, dob, frontImage, rearImage } = body;

    const identifierUid = (userUid || '').trim();
    const identifierEmail = (userEmail || '').trim().toLowerCase();

    if (!identifierUid && !identifierEmail) {
      return NextResponse.json(
        { success: false, error: 'User identifier (UID or Email) is required.' },
        { status: 400 }
      );
    }

    // Lookup user in PostgreSQL database using parameterized SQL query
    const userResult = await query(
      `SELECT id, uid, username, email FROM users 
       WHERE (uid IS NOT NULL AND uid = $1) 
          OR (email IS NOT NULL AND LOWER(email) = LOWER($2));`,
      [identifierUid || 'NO_UID', identifierEmail || 'NO_EMAIL']
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found. Please log in first.' },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];
    const derivedFullName = (fullName || `${firstName || ''} ${lastName || ''}`).trim() || user.username;

    // Generate secure filenames for uploaded images
    const timestamp = Date.now();
    const frontFilename = frontImage ? await saveBase64Image(frontImage, `user_${user.id}_front_${timestamp}.png`) : null;
    const backFilename = rearImage ? await saveBase64Image(rearImage, `user_${user.id}_back_${timestamp}.png`) : null;

    // Check if user already has an existing pending or verified record
    const existingKyc = await query(
      `SELECT id FROM kyc_verifications WHERE user_id = $1 ORDER BY submitted_at DESC LIMIT 1;`,
      [user.id]
    );

    let kycRecord;

    if (existingKyc.rows.length > 0) {
      // Update existing record
      const updateResult = await query(
        `UPDATE kyc_verifications 
         SET full_name = $1, id_number = $2, country = $3, document_type = $4, 
             id_front_path = COALESCE($5, id_front_path), id_back_path = COALESCE($6, id_back_path),
             status = 'pending', submitted_at = CURRENT_TIMESTAMP, reviewed_at = NULL
         WHERE id = $7
         RETURNING id, status, submitted_at;`,
        [derivedFullName, idNumber || '', country || '', documentType || 'ID card', frontFilename, backFilename, existingKyc.rows[0].id]
      );
      kycRecord = updateResult.rows[0];
    } else {
      // Insert new KYC record
      const insertResult = await query(
        `INSERT INTO kyc_verifications (user_id, full_name, id_number, country, document_type, id_front_path, id_back_path, status, submitted_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', CURRENT_TIMESTAMP)
         RETURNING id, status, submitted_at;`,
        [user.id, derivedFullName, idNumber || '', country || '', documentType || 'ID card', frontFilename, backFilename]
      );
      kycRecord = insertResult.rows[0];
    }

    // Update user's kyc_status in users table
    await query(
      `UPDATE users SET kyc_status = 'pending', updated_at = CURRENT_TIMESTAMP WHERE id = $1;`,
      [user.id]
    );

    return NextResponse.json({
      success: true,
      message: 'KYC application submitted successfully',
      kycStatus: 'pending',
      submissionId: kycRecord.id
    });

  } catch (error) {
    console.error('KYC Submission API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during KYC submission. Please try again.' },
      { status: 500 }
    );
  }
}

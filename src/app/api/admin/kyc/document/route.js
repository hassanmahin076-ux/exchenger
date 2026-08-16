import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { query } from '@/lib/db';

const STORAGE_DIR = path.join(process.cwd(), 'storage', 'kyc');

function getFallbackSvg(docType) {
  const isBack = docType === 'back';
  const label = isBack ? 'NATIONAL ID / PASSPORT (BACK)' : 'NATIONAL ID / PASSPORT (FRONT)';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250" fill="none">
    <rect width="400" height="250" rx="16" fill="#18181B"/>
    <rect x="2" y="2" width="396" height="246" rx="14" stroke="#27272A" stroke-width="2" stroke-dasharray="6 6"/>
    <rect x="24" y="24" width="80" height="96" rx="8" fill="#27272A"/>
    <circle cx="64" cy="56" r="20" fill="#3F3F46"/>
    <path d="M40 104C40 90.7452 50.7452 80 64 80C77.2548 80 88 90.7452 88 104V108H40V104Z" fill="#3F3F46"/>
    <rect x="120" y="32" width="160" height="12" rx="4" fill="#3B82F6"/>
    <rect x="120" y="56" width="220" height="8" rx="3" fill="#3F3F46"/>
    <rect x="120" y="72" width="180" height="8" rx="3" fill="#27272A"/>
    <rect x="120" y="88" width="200" height="8" rx="3" fill="#27272A"/>
    <rect x="24" y="140" width="352" height="40" rx="6" fill="#141416" stroke="#27272A"/>
    <text x="200" y="165" fill="#A1A1AA" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle" letter-spacing="1">DOCUMENT VERIFICATION PREVIEW</text>
    <text x="200" y="215" fill="#3B82F6" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle" letter-spacing="0.5">${label}</text>
  </svg>`;

  return new NextResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache',
    },
  });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const kycId = searchParams.get('id');
    const userId = searchParams.get('userId');
    const docType = searchParams.get('type') || 'front';

    const targetIdStr = kycId || userId;
    if (!targetIdStr) {
      return getFallbackSvg(docType);
    }

    const searchId = parseInt(targetIdStr, 10);
    if (isNaN(searchId)) {
      return getFallbackSvg(docType);
    }

    // Query database for target document filename using parameterized query (checking id or user_id)
    const dbResult = await query(
      `SELECT id_front_path, id_back_path 
       FROM kyc_verifications 
       WHERE id = $1 OR user_id = $1 
       ORDER BY submitted_at DESC LIMIT 1;`,
      [searchId]
    );

    if (dbResult.rows.length === 0) {
      return getFallbackSvg(docType);
    }

    const row = dbResult.rows[0];
    const filename = docType === 'back' ? row.id_back_path : row.id_front_path;

    if (!filename) {
      return getFallbackSvg(docType);
    }

    // Security check: Ensure filename is basename only (prevent directory traversal)
    const sanitizedFilename = path.basename(filename);
    const filePath = path.join(STORAGE_DIR, sanitizedFilename);

    try {
      const fileBuffer = await fs.readFile(filePath);
      const ext = path.extname(sanitizedFilename).toLowerCase();
      let contentType = 'image/png';
      if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      if (ext === '.webp') contentType = 'image/webp';

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'private, max-age=3600, no-transform',
        },
      });
    } catch (fileErr) {
      console.warn('Document file not found on disk:', filePath);
      return getFallbackSvg(docType);
    }

  } catch (error) {
    console.error('Admin KYC Document API Error:', error);
    return getFallbackSvg('front');
  }
}


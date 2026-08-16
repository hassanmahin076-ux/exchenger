"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import MarketsDetailedView from '../../components/MarketsDetailedView';

export default function MarketsPage() {
  const router = useRouter();

  const handleSelectPair = (pair) => {
    router.push('/futures');
  };

  return (
    <MarketsDetailedView onSelectPair={handleSelectPair} />
  );
}

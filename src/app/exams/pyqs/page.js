'use client';

import TestBatchQuizzes from "../components/TestBatchQuizzes";

export default function PYQsPage() {
  return (
    <TestBatchQuizzes 
      title="Previous Year Questions"
      description="Practice with previous year exam questions"
      isPYQ={true}
    />
  );
}

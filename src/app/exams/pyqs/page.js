'use client';

import TestBatchQuizzes from "../components/TestBatchQuizzes";

export default function PYQsPage() {
  return (
    <TestBatchQuizzes 
      title="Previous Year Questions"
      description="Practice with previous year exam questions"
      // Remove the batchId prop to let the function automatically find PYQ batches
      isPYQ={true}
    />
  );
}

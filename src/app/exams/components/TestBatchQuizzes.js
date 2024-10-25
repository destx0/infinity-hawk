'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Clock, Users, Award } from "lucide-react";
import { fetchTestBatch } from '@/lib/firebase/testBatches';

export default function TestBatchQuizzes({ 
  batchId = 'NHI6vv2PzgQ899Sz4Rll',
  title = 'Quizzes',
  description = 'Practice questions from our collection'
}) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getQuizzes() {
      setLoading(true);
      const { data, error: fetchError } = await fetchTestBatch(batchId);
      
      if (fetchError) {
        setError(fetchError);
      } else {
        setQuizzes(data.quizzes || []);
      }
      setLoading(false);
    }

    getQuizzes();
  }, [batchId]);

  if (loading) {
    return (
      <div className="space-y-4 w-full">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[100px] w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {quizzes.map((quizId, index) => (
          <Card key={quizId} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Quiz {index + 1}</span>
                <Award className="h-5 w-5 text-yellow-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>45 mins</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>1.2k attempts</span>
                  </div>
                </div>
                <Button className="w-full" onClick={() => console.log(`Starting quiz ${quizId}`)}>
                  Start Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

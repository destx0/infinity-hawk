"use client";
import { useEffect } from 'react';
import useAuthStore from '@/store/authStore';

export function ClientLayout({ children, isExamPage }) {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    console.log("Initializing auth in ClientLayout...");
    const unsubscribe = initializeAuth();
    return () => {
      console.log("Cleaning up auth subscription in ClientLayout");
      unsubscribe();
    };
  }, []);

  return children;
} 
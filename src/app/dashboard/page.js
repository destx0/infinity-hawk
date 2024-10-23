'use client';

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/config/firebase';
import Image from 'next/image';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/join');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/join');
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt="Profile"
                width={64}
                height={64}
                className="rounded-full mr-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-avatar.png'; // Provide a default avatar image
                }}
              />
            ) : (
              <div className="w-16 h-16 bg-gray-300 rounded-full mr-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600">
                  {user.displayName ? user.displayName[0].toUpperCase() : '?'}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome, {user.displayName || 'User'}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

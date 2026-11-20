'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function JobStatusPage() {
  const params = useParams();
  const id = params.id as string;

  const [job, setJob] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}/api/jobs/${id}`);
        
        if (!res.ok) throw new Error('Failed to fetch job status');
        
        const data = await res.json();
        setJob(data);

        // If not completed or failed, poll again
        if (data.status === 'QUEUED' || data.status === 'PROCESSING') {
          setTimeout(fetchJob, 1500);
        }
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchJob();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Processing your file...</h1>

        {error && <p className="text-red-500 font-medium mb-4">{error}</p>}

        {!job && !error && <p className="text-gray-500 dark:text-gray-400">Loading job status...</p>}

        {job && (
          <div className="space-y-6">
            <div className="mb-2 flex justify-between items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <span className="uppercase tracking-wider">{job.status}</span>
              <span>{job.progress}%</span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-6 overflow-hidden">
              <div 
                className={`h-4 rounded-full transition-all duration-500 ${
                  job.status === 'FAILED' ? 'bg-red-500' : 
                  job.status === 'COMPLETED' ? 'bg-green-500' : 'bg-indigo-600'
                }`} 
                style={{ width: `${job.progress}%` }}
              ></div>
            </div>

            {job.status === 'FAILED' && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-lg">
                <p><strong>Error:</strong> {job.error}</p>
              </div>
            )}

            {job.status === 'COMPLETED' && job.outputFile && (
              <div className="mt-8 animate-fade-in">
                <p className="text-green-600 dark:text-green-400 font-bold text-xl mb-4">Success! Your file is ready.</p>
                <a 
                  href={(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/' + job.outputFile}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-transform hover:scale-105"
                >
                  Download File
                </a>
              </div>
            )}
            
            {(job.status === 'QUEUED' || job.status === 'PROCESSING') && (
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-4 animate-pulse">
                Please wait while we process your request. Do not close this window.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

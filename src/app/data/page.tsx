"use client";

import React, { useEffect, useState } from 'react';

export default function DataPage() {
  const [data, setData] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('autofilledData');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
          Your information was automatically extracted:
        </h1>

        <div className="bg-gray-900 rounded-lg p-6 shadow-md text-white">
          {data ? (
            <div className="space-y-3">
              {Object.entries(data).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <span className="font-semibold w-32 capitalize">{key}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No data available</p>
          )}
        </div>

        <div className="mt-8 text-gray-300 leading-relaxed space-y-4">
          <p>
            Surprised? You didn’t even need to click the submit button, did you? The information you see above was automatically extracted from your browser the moment the fields were auto-filled. 
          </p>
          <p>
            This means that websites can potentially collect your sensitive personal data without any explicit action from you. Autocomplete is convenient, but it comes with significant privacy risks. 
          </p>
          <p className="text-yellow-400 font-semibold">
            Tip: Disable autocomplete for sensitive fields like emails, addresses, and any sensitive information. Always be cautious about where and how your data is being used.
          </p>
        </div>
      </div>
    </div>
  );
}

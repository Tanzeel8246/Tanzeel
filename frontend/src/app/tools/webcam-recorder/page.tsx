'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function WebcamRecorderPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Turn on camera for live preview
  const startCamera = async () => {
    try {
      setError(null);
      setVideoUrl(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setIsCameraOn(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to access camera and microphone.');
      setIsCameraOn(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    if (isRecording) {
      stopRecording();
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    
    chunksRef.current = [];
    
    try {
      const options = { mimeType: 'video/webm; codecs=vp9' };
      let recorder;
      try {
        recorder = new MediaRecorder(streamRef.current, options);
      } catch (e) {
        recorder = new MediaRecorder(streamRef.current);
      }
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      };

      mediaRecorderRef.current = recorder;
      recorder.start(1000); 
      setIsRecording(true);
      setVideoUrl(null);
    } catch (err: any) {
      console.error(err);
      setError('Failed to start recording.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const downloadVideo = () => {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `webcam_recording_${new Date().getTime()}.webm`;
    a.click();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-12 border-b border-gray-200 dark:border-gray-700 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              Webcam Recorder
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Record video directly from your webcam. 100% free and private, no files are uploaded to any server.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center">
            
            <div className="w-full max-w-3xl">
              
              {/* Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 mb-8 gap-4">
                
                {!isCameraOn ? (
                  <button
                    onClick={startCamera}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    <span>Turn On Camera</span>
                  </button>
                ) : (
                  <>
                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-md transition-all flex items-center justify-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="6" /></svg>
                        <span>Start Recording</span>
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="px-8 py-3 bg-gray-900 hover:bg-black dark:bg-gray-100 dark:hover:bg-white dark:text-gray-900 text-white rounded-lg font-bold shadow-md transition-all flex items-center justify-center space-x-2 animate-pulse"
                      >
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><rect x="6" y="6" width="8" height="8" rx="1" /></svg>
                        <span>Stop Recording</span>
                      </button>
                    )}
                    
                    <button
                      onClick={stopCamera}
                      disabled={isRecording}
                      className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-lg font-bold transition-all disabled:opacity-50"
                    >
                      Turn Off Camera
                    </button>
                  </>
                )}
              </div>

              {error && <div className="mb-6 p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl font-medium text-center">{error}</div>}
              
              {/* Video Preview Area */}
              <div className="w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-300 dark:border-gray-700 aspect-video relative flex items-center justify-center">
                
                {/* Live Preview Element */}
                <video 
                  ref={videoRef}
                  className={`w-full h-full object-cover transform -scale-x-100 ${(!isCameraOn || videoUrl) ? 'hidden' : 'block'}`} 
                  muted 
                />
                
                {/* Playback Element */}
                {videoUrl && !isRecording && (
                  <video 
                    src={videoUrl}
                    className="w-full h-full object-contain" 
                    controls 
                    autoPlay
                  />
                )}

                {!isCameraOn && !videoUrl && (
                  <div className="text-center p-6 text-gray-400 dark:text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    <p className="font-medium text-lg">Camera Preview</p>
                    <p className="text-sm mt-1">Turn on camera to see preview</p>
                  </div>
                )}
                
                {/* Recording Indicator */}
                {isRecording && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-lg animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                    REC
                  </div>
                )}
              </div>

              {/* Download Action */}
              {videoUrl && !isRecording && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={downloadVideo}
                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    <span>Download Recording (.webm)</span>
                  </button>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

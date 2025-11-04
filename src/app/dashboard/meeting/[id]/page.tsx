'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-auth';
import { useRouter, useParams } from 'next/navigation';
import { MeetingPrepService } from '@/lib/database';
import type { Meeting, Brief } from '@/lib/database.types';

export const dynamic = 'force-dynamic';

export default function MeetingDetailPage() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [brief, setBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const meetingId = params.id as string;

  useEffect(() => {
    const loadMeeting = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }
      
      setUser(user);
      
      try {
        const result = await MeetingPrepService.getMeetingWithBrief(meetingId);
        if (result) {
          setMeeting(result.meeting);
          setBrief(result.brief);
        } else {
          console.error('Meeting not found');
        }
      } catch (error) {
        console.error('Error loading meeting:', error);
      } finally {
        setLoading(false);
      }
    };

    if (meetingId) {
      loadMeeting();
    }
  }, [meetingId, router]);

  const formatAttendees = (attendees: string[] | null): string[] => {
    if (!attendees) return [];
    if (typeof attendees === 'string') return [attendees];
    return attendees;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading meeting...</p>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Meeting not found</h2>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const attendees = formatAttendees(meeting.attendees);
  const meetingDate = new Date(meeting.date);
  const isUpcoming = meetingDate >= new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-bold text-gray-900">MeetingPrep AI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.email}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Meeting Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-3xl font-bold text-gray-900">{meeting.title}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isUpcoming 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {isUpcoming ? 'Upcoming' : 'Completed'}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Date</p>
              <p className="text-gray-900">{meetingDate.toLocaleDateString('en-GB', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
            {meeting.time && (
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Time</p>
                <p className="text-gray-900">{meeting.time}</p>
              </div>
            )}
          </div>

          {attendees.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500 mb-2">Attendees</p>
              <div className="flex flex-wrap gap-2">
                {attendees.map((attendee, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                    {attendee}
                  </span>
                ))}
              </div>
            </div>
          )}

          {meeting.company && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500 mb-1">Company</p>
              <p className="text-gray-900">{meeting.company}</p>
            </div>
          )}

          {meeting.description && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
              <p className="text-gray-700">{meeting.description}</p>
            </div>
          )}
        </div>

        {/* Brief Section */}
        {brief ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">AI-Generated Brief</h3>
              {brief.created_at && (
                <span className="text-sm text-gray-500">
                  Generated {new Date(brief.created_at).toLocaleDateString()}
                </span>
              )}
            </div>
            
            <div className="prose max-w-none">
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {brief.content}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <p className="text-gray-600">No brief has been generated for this meeting yet.</p>
            <p className="text-sm text-gray-500 mt-2">Use the Chrome extension to generate a brief.</p>
          </div>
        )}
      </main>
    </div>
  );
}




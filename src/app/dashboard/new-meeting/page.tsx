'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-auth';
import { useRouter } from 'next/navigation';

export default function NewMeeting() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    attendees: '',
    company: '',
    meetingType: 'sales',
    objectives: '',
    context: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }
      
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, [router, supabase.auth]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // Simulate AI brief generation
    setTimeout(() => {
      setIsGenerating(false);
      // For now, just redirect back to dashboard
      // Later we'll integrate OpenAI and save to database
      router.push('/dashboard');
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
                ← Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">New Meeting Prep</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.email}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Meeting Details</h2>
            <p className="text-gray-600">Provide information about your upcoming meeting to generate AI-powered preparation materials.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Meeting Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Sales Call with TechCorp"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Time
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Meeting Type */}
            <div>
              <label htmlFor="meetingType" className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Type
              </label>
              <select
                id="meetingType"
                name="meetingType"
                value={formData.meetingType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="sales">Sales Call</option>
                <option value="demo">Product Demo</option>
                <option value="discovery">Discovery Call</option>
                <option value="negotiation">Negotiation</option>
                <option value="followup">Follow-up Meeting</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Company/Organization
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="e.g., TechCorp Solutions"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Attendees */}
            <div>
              <label htmlFor="attendees" className="block text-sm font-medium text-gray-700 mb-2">
                Attendees *
              </label>
              <input
                type="text"
                id="attendees"
                name="attendees"
                required
                value={formData.attendees}
                onChange={handleInputChange}
                placeholder="e.g., John Smith (CEO), Sarah Johnson (CTO)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Separate multiple attendees with commas</p>
            </div>

            {/* Meeting Objectives */}
            <div>
              <label htmlFor="objectives" className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Objectives
              </label>
              <textarea
                id="objectives"
                name="objectives"
                rows={3}
                value={formData.objectives}
                onChange={handleInputChange}
                placeholder="e.g., Demonstrate our CRM integration capabilities, understand their current pain points, discuss pricing..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Additional Context */}
            <div>
              <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Context
              </label>
              <textarea
                id="context"
                name="context"
                rows={4}
                value={formData.context}
                onChange={handleInputChange}
                placeholder="e.g., Previous conversations, company background, specific challenges they mentioned..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isGenerating}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating AI Brief...</span>
                  </div>
                ) : (
                  'Generate Meeting Brief'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* AI Brief Preview (when generating) */}
        {isGenerating && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto mb-4"></div>
              </div>
              <p className="text-gray-600 mt-4">AI is researching attendees and generating your meeting brief...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

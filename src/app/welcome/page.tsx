'use client'

import { useRouter } from 'next/navigation'

export default function WelcomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welcome to MeetingPrep AI! 🎉
            </h1>
            <p className="text-xl text-gray-600">
              Let's get you set up in 3 quick steps (takes 1 minute)
            </p>
          </div>

          {/* Step 1 */}
          <div className="mb-8 p-6 bg-purple-50 rounded-xl border-2 border-purple-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  1
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  📌 Pin the Extension to Your Toolbar
                </h3>
                <p className="text-gray-700 mb-3">
                  Click the puzzle piece icon (🧩) in your Chrome toolbar → Find "MeetingPrep AI" → Click the pin icon
                </p>
                <div className="bg-white p-3 rounded-lg border border-purple-200">
                  <p className="text-sm text-gray-600">
                    💡 This makes it easy to access MeetingPrep AI anytime
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="mb-8 p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  2
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  📅 Open Google Calendar
                </h3>
                <p className="text-gray-700 mb-3">
                  Go to your Google Calendar where your meetings are scheduled
                </p>
                <a
                  href="https://calendar.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Open Google Calendar →
                </a>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="mb-8 p-6 bg-green-50 rounded-xl border-2 border-green-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  3
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  ⚡ Click MeetingPrep AI Icon
                </h3>
                <p className="text-gray-700 mb-3">
                  Look for the MeetingPrep AI icon in your toolbar and click it to generate your first meeting brief!
                </p>
                <div className="bg-white p-3 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600">
                    🎯 The extension will read your calendar and create an AI-powered brief in 30 seconds
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* What You Get */}
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              What You'll Get:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>AI-generated meeting briefs with talking points</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Attendee information and context</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Save 20-30 minutes of prep per meeting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Free: 20 AI briefs per month</span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="https://calendar.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg text-lg font-bold hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
            >
              Get Started Now →
            </a>
            <p className="mt-4 text-sm text-gray-600">
              Need help? Email <a href="mailto:connortoorish1@gmail.com" className="text-blue-600 hover:underline">connortoorish1@gmail.com</a>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}


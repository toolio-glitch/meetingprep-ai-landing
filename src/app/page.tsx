'use client';

export default function Home() {

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">MeetingPrep AI</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              AI-Powered Meeting Intelligence
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Stop Wasting Hours on{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Meeting Prep
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your meeting preparation from 30 minutes of manual research to 3 minutes of AI-powered insights. 
              Built specifically for sales professionals who value their time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <div className="flex items-center space-x-2 text-gray-600">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Save 2+ hours weekly</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Available Now</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <a
                href="https://chrome.google.com/webstore"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Install Extension
              </a>
              <a
                href="/login"
                className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-200"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The Meeting Prep Problem</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sales professionals waste countless hours on manual research before every important call
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Problem */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-red-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Current Reality</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">•</span>
                  <span className="text-gray-700">30+ minutes researching each attendee manually</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">•</span>
                  <span className="text-gray-700">Endless LinkedIn stalking and company research</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">•</span>
                  <span className="text-gray-700">Scrambling for relevant conversation starters</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">•</span>
                  <span className="text-gray-700">2+ hours weekly lost to meeting preparation</span>
                </li>
              </ul>
            </div>

            {/* Solution */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-sm border border-blue-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">MeetingPrep AI</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">•</span>
                  <span className="text-gray-700">Automatic LinkedIn profile and company research</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">•</span>
                  <span className="text-gray-700">Real-time company news and recent updates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">•</span>
                  <span className="text-gray-700">AI-generated talking points and conversation starters</span>
          </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">•</span>
                  <span className="text-gray-700">3-minute prep instead of 30+ minutes</span>
          </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Two simple steps to transform your meeting preparation workflow
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-200">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Connect Your Calendar</h3>
              <p className="text-gray-600 leading-relaxed">
                Seamlessly integrate with Google Calendar or Outlook. MeetingPrep AI automatically detects your upcoming meetings.
              </p>
            </div>

            <div className="text-center group">
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-200">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI Research & Brief Generation</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI automatically researches attendees&apos; LinkedIn profiles, company news, and finds mutual connections, then delivers a personalized brief with key insights, conversation starters, and strategic talking points.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">The ROI is Undeniable</h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            For sales professionals doing 40+ calls per week, MeetingPrep AI delivers massive time savings and ROI
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">2 Hours</div>
              <div className="text-blue-100">Saved Weekly</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">£400+</div>
              <div className="text-blue-100">Time Value Saved</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">800%+</div>
              <div className="text-blue-100">Return on Investment</div>
            </div>
          </div>
          
          <div className="text-lg text-blue-100">
            <strong className="text-white">Just £49/month</strong> for unlimited meeting prep
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Transform Your Meetings?</h2>
          <p className="text-xl text-gray-600 mb-12">
            Install the Chrome extension and start generating AI-powered meeting briefs in seconds. Sign up directly in the extension after installing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://chrome.google.com/webstore"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Install from Chrome Web Store
            </a>
            <a
              href="/login"
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-200"
            >
              Sign In to Dashboard
            </a>
          </div>
          
          <p className="mt-6 text-sm text-gray-500">
            After installation, open the extension to create your account and get started
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">M</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">MeetingPrep AI</span>
          </div>
          <p className="text-gray-600">
            &copy; 2024 MeetingPrep AI. Built by a doctor who understands efficiency. Designed for sales professionals who value their time.
          </p>
          
          {/* Legal Links */}
          <div className="mt-6 flex items-center justify-center space-x-6 text-xs text-gray-400">
            <a href="/privacy" className="hover:text-gray-600 transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="/terms" className="hover:text-gray-600 transition-colors">
              Terms of Service
            </a>
            <span>•</span>
            <a href="mailto:legal@meetingprep.ai" className="hover:text-gray-600 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
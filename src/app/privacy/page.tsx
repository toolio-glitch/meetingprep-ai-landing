export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Introduction</h2>
            <p className="mb-4">
              MeetingPrep AI (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Chrome extension and web service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.1 Chrome Extension Data</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Meeting titles and descriptions from your Google Calendar</li>
              <li>Attendee names and email addresses</li>
              <li>Meeting dates, times, and locations</li>
              <li>Your authentication credentials (encrypted)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.2 Account Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Email address</li>
              <li>Name</li>
              <li>Password (encrypted)</li>
              <li>Subscription and billing information</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.3 Usage Data</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>How you interact with our service</li>
              <li>Features you use most frequently</li>
              <li>Error logs and performance data</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>AI Brief Generation:</strong> We use meeting data to generate personalized preparation briefs</li>
              <li><strong>Service Improvement:</strong> To enhance our AI models and user experience</li>
              <li><strong>Account Management:</strong> To manage your subscription and provide customer support</li>
              <li><strong>Communication:</strong> To send service updates and important notifications</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Third-Party Services</h2>
            <p className="mb-4">We use the following third-party services:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>OpenAI:</strong> For AI-powered brief generation (business-grade API with data protection)</li>
              <li><strong>Supabase:</strong> For secure data storage and user authentication</li>
              <li><strong>Stripe:</strong> For payment processing (we don&apos;t store payment card details)</li>
              <li><strong>Google Calendar API:</strong> To access your meeting information (with your permission)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Data Security</h2>
            <p className="mb-4">
              We implement industry-standard security measures including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>End-to-end encryption for data transmission</li>
              <li>Secure cloud storage with access controls</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal data by authorized personnel only</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Your Rights (GDPR Compliance)</h2>
            <p className="mb-4">If you are in the UK or EU, you have the right to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate personal data</li>
              <li><strong>Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
              <li><strong>Objection:</strong> Object to processing of your personal data</li>
              <li><strong>Restriction:</strong> Request restriction of processing</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Data Retention</h2>
            <p className="mb-4">
              We retain your data only as long as necessary to provide our services:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Account data: Until you delete your account</li>
              <li>Meeting briefs: 12 months or until deletion requested</li>
              <li>Usage logs: 6 months for service improvement</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Chrome Extension Permissions</h2>
            <p className="mb-4">Our Chrome extension requests the following permissions:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>calendar.google.com:</strong> To read meeting information for brief generation</li>
              <li><strong>activeTab:</strong> To interact with your current calendar tab</li>
              <li><strong>storage:</strong> To store user preferences locally</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Cookies and Tracking</h2>
            <p className="mb-4">
              We use essential cookies for authentication and service functionality. We do not use tracking cookies for advertising purposes.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Changes to This Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by email or through our service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us at:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p><strong>Email:</strong> connortoorish@icloud.com</p>
              <p><strong>Address:</strong> UK-based</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Thread Composer',
  description: 'Privacy Policy for Thread Composer',
};

export default function PrivacyPage() {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <nav className="legal-nav">
          <Link href="/" className="legal-back">
            ← Back to Thread Composer
          </Link>
        </nav>
      </header>

      <main className="legal-main">
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: January 13, 2025</p>

        <h2>Overview</h2>
        <p>
          Thread Composer ("we", "our", or "the Service") is committed to protecting your privacy. 
          This Privacy Policy explains how we collect, use, and safeguard your information when 
          you use our service.
        </p>

        <h2>Information We Collect</h2>
        <p>When you use Thread Composer, we collect:</p>
        <ul>
          <li>
            <strong>X Account Information:</strong> Your X username, display name, and user ID 
            when you authenticate with the Service.
          </li>
          <li>
            <strong>Authentication Tokens:</strong> Secure tokens provided by X that allow us 
            to post on your behalf. These are stored securely and encrypted.
          </li>
          <li>
            <strong>Usage Data:</strong> Basic analytics about how you use the Service, such as 
            feature usage and error logs.
          </li>
        </ul>

        <h2>Information We Do NOT Collect</h2>
        <ul>
          <li>We do not store copies of your tweets or threads after posting</li>
          <li>We do not access your X password</li>
          <li>We do not read your direct messages</li>
          <li>We do not access your private follower lists</li>
          <li>We do not sell or share your data with third parties</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>We use the collected information to:</p>
        <ul>
          <li>Authenticate you with the Service</li>
          <li>Post threads to X on your behalf when you request it</li>
          <li>Display your username and name in the application</li>
          <li>Improve the Service and fix bugs</li>
        </ul>

        <h2>Data Storage and Security</h2>
        <p>
          Your authentication tokens are stored in encrypted, secure HTTP-only cookies. 
          We use industry-standard security measures to protect your data. Your session 
          data is temporary and can be cleared at any time by signing out.
        </p>

        <h2>Third-Party Services</h2>
        <p>
          Thread Composer integrates with X (formerly Twitter) using their official OAuth 2.0 API. 
          Your use of X through our Service is also subject to X's Privacy Policy and Terms of Service.
        </p>

        <h2>Data Retention</h2>
        <p>
          We retain your session data only while you are actively using the Service. When you 
          sign out, your session data is deleted. You can also revoke Thread Composer's access 
          to your X account at any time through your X account settings.
        </p>

        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access the information we have about you</li>
          <li>Request deletion of your data by signing out</li>
          <li>Revoke access to your X account at any time</li>
          <li>Contact us with privacy concerns</li>
        </ul>

        <h2>Children's Privacy</h2>
        <p>
          Thread Composer is not intended for users under 13 years of age. We do not knowingly 
          collect information from children under 13.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify users of any 
          material changes by updating the "Last updated" date at the top of this page.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or our data practices, 
          please contact us through our support channels.
        </p>
      </main>

      <footer className="legal-footer">
        <p>© 2025 Thread Composer. All rights reserved.</p>
      </footer>
    </div>
  );
}

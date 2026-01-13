import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Thread Composer',
  description: 'Terms of Service for Thread Composer',
};

export default function TermsPage() {
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
        <h1>Terms of Service</h1>
        <p className="legal-updated">Last updated: January 13, 2025</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using Thread Composer ("the Service"), you agree to be bound by these 
          Terms of Service. If you do not agree to these terms, please do not use the Service.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          Thread Composer is a web application that allows users to compose and publish 
          multi-tweet threads to X (formerly Twitter). The Service requires authentication 
          through your X account to function.
        </p>

        <h2>3. User Accounts</h2>
        <p>
          To use Thread Composer, you must have a valid X account. By connecting your X account, 
          you authorize us to:
        </p>
        <ul>
          <li>Access your basic profile information (username, display name)</li>
          <li>Post tweets and threads on your behalf when you explicitly request it</li>
          <li>Read your public profile information</li>
        </ul>
        <p>
          You are responsible for all activity that occurs under your account.
        </p>

        <h2>4. User Conduct</h2>
        <p>You agree not to use the Service to:</p>
        <ul>
          <li>Violate any applicable laws or regulations</li>
          <li>Post spam, misleading content, or malicious links</li>
          <li>Harass, abuse, or harm other users</li>
          <li>Violate X's Terms of Service or Community Guidelines</li>
          <li>Attempt to gain unauthorized access to the Service</li>
        </ul>

        <h2>5. Content Ownership</h2>
        <p>
          You retain all ownership rights to the content you create and post through Thread Composer. 
          We do not claim any ownership over your tweets or threads. However, content posted to X 
          is subject to X's Terms of Service.
        </p>

        <h2>6. Service Availability</h2>
        <p>
          We strive to maintain Service availability but do not guarantee uninterrupted access. 
          The Service may be temporarily unavailable due to maintenance, updates, or circumstances 
          beyond our control.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          Thread Composer is provided "as is" without warranties of any kind. We are not liable 
          for any damages arising from your use of the Service, including but not limited to:
        </p>
        <ul>
          <li>Loss of data or content</li>
          <li>Service interruptions</li>
          <li>Actions taken by X on your account</li>
          <li>Any indirect, incidental, or consequential damages</li>
        </ul>

        <h2>8. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your access to the Service at any time, 
          for any reason, without prior notice. You may also disconnect your account at any time 
          by revoking access through your X account settings.
        </p>

        <h2>9. Changes to Terms</h2>
        <p>
          We may update these Terms of Service from time to time. Continued use of the Service 
          after changes constitutes acceptance of the new terms.
        </p>

        <h2>10. Contact</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us through 
          our support channels.
        </p>
      </main>

      <footer className="legal-footer">
        <p>© 2025 Thread Composer. All rights reserved.</p>
      </footer>
    </div>
  );
}

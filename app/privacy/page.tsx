import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | PostForge',
};

export default function PrivacyPage() {
  return (
    <div className="legal">
      <header className="legal-header">
        <Link href="/" className="legal-back">← Back to PostForge</Link>
      </header>

      <main className="legal-main">
        <h1>Privacy Policy</h1>
        <p className="legal-date">Last updated: January 13, 2025</p>

        <h2>Overview</h2>
        <p>
          PostForge respects your privacy. This policy explains what data we collect 
          and how we use it.
        </p>

        <h2>What We Collect</h2>
        <ul>
          <li><strong>X Account Info:</strong> Username, display name, and user ID when you sign in</li>
          <li><strong>Auth Tokens:</strong> Encrypted tokens to post on your behalf</li>
          <li><strong>Prompts:</strong> Topics you enter for post generation (not stored permanently)</li>
        </ul>

        <h2>What We Don't Collect</h2>
        <ul>
          <li>Your X password</li>
          <li>Your direct messages</li>
          <li>Your followers list</li>
          <li>Browsing history</li>
        </ul>

        <h2>How We Use Data</h2>
        <ul>
          <li>Authenticate you with X</li>
          <li>Generate posts based on your prompts</li>
          <li>Publish posts when you request it</li>
        </ul>

        <h2>AI Processing</h2>
        <p>
          Your prompts are sent to AI services (OpenAI) to generate posts. These 
          prompts are processed in real-time and not stored by us after generation.
        </p>

        <h2>Data Storage</h2>
        <p>
          Session data is stored in encrypted cookies. When you sign out, it's deleted. 
          You can revoke access anytime in your X account settings.
        </p>

        <h2>Third Parties</h2>
        <p>
          We integrate with X (for posting) and OpenAI (for generation). Their privacy 
          policies also apply to data processed by them.
        </p>

        <h2>Your Rights</h2>
        <ul>
          <li>Sign out to delete session data</li>
          <li>Revoke X access in your account settings</li>
          <li>Contact us with privacy questions</li>
        </ul>
      </main>

      <footer className="legal-footer">© 2025 PostForge</footer>
    </div>
  );
}

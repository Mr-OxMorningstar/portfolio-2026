import { useState } from 'react';
import { profile } from '../data/profile';

const SUBJECT = 'Hello from your portfolio';
const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(SUBJECT)}`;

// Opens the visitor's mail app with the address and subject filled in; the copy button covers visitors without one.
export default function EmailButton() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = mailto;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={mailto}
        className="inline-block bg-ink px-5 py-2.5 font-medium text-paper no-underline transition-colors hover:bg-accent"
      >
        Email me
      </a>
      <button
        type="button"
        onClick={copy}
        className="cursor-pointer border border-rule px-4 py-2.5 text-sm text-muted transition-colors hover:border-ink hover:text-ink"
      >
        <span aria-live="polite">{copied ? 'Copied' : 'Copy address'}</span>
      </button>
    </div>
  );
}

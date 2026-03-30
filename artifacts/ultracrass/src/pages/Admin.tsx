import { useState } from 'react';
import { Link } from 'wouter';
import { PostCategory, CATEGORY_LABELS } from '@/types';

const ADMIN_PASSWORD = 'ultracrass2024';
const PASS_KEY = 'uc_auth';

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid var(--border)',
  color: 'var(--fg)',
  fontFamily: 'var(--font-sans)',
  fontSize: '15px',
  fontWeight: 300,
  padding: '12px 0',
  outline: 'none',
  lineHeight: 1.6,
  transition: 'border-color 0.2s',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '9px',
  letterSpacing: '0.2em',
  color: 'var(--fg-muted)',
  textTransform: 'uppercase' as const,
  display: 'block',
  marginBottom: '6px',
};

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);

  const attempt = () => {
    if (pw === ADMIN_PASSWORD) {
      localStorage.setItem(PASS_KEY, '1');
      setError(false);
      onLogin();
    } else {
      setError(true);
      setPw('');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      <div style={{ width: '100%', maxWidth: '320px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '0.25em',
          color: 'var(--fg-muted)',
          textTransform: 'uppercase',
          marginBottom: '40px',
        }}>
          ultracrass / zugang
        </div>
        <label style={labelStyle}>Passwort</label>
        <input
          type="password"
          value={pw}
          onChange={e => { setPw(e.target.value); setError(false); }}
          onKeyDown={e => e.key === 'Enter' && attempt()}
          autoFocus
          style={{
            ...inputStyle,
            borderBottomColor: error ? '#8b3333' : 'var(--border)',
          }}
          onFocus={e => (e.target.style.borderBottomColor = error ? '#8b3333' : 'var(--fg-muted)')}
          onBlur={e => (e.target.style.borderBottomColor = error ? '#8b3333' : 'var(--border)')}
        />
        {error && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#8b3333', marginTop: '8px', letterSpacing: '0.05em' }}>
            falsch
          </div>
        )}
        <button
          onClick={attempt}
          style={{
            marginTop: '32px',
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--fg-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            padding: '12px 24px',
            cursor: 'pointer',
            width: '100%',
            transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--fg-muted)'; e.currentTarget.style.color = 'var(--fg)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--fg-muted)'; }}
        >
          Eintreten
        </button>
        <Link href="/">
          <div style={{
            marginTop: '20px',
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.15em',
            color: 'var(--fg-dim)',
            textTransform: 'uppercase',
            textAlign: 'center',
            cursor: 'pointer',
          }}>
            ← zurück
          </div>
        </Link>
      </div>
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => localStorage.getItem(PASS_KEY) === '1');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PostCategory>('fragment');

  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'devmode'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />;
  }

  const logout = () => {
    localStorage.removeItem(PASS_KEY);
    setAuthed(false);
  };

  const isDev = import.meta.env.DEV;

  const publish = async () => {
    if (!title.trim() || !content.trim()) return;
    setStatus('loading');

    if (isDev) {
      await new Promise(r => setTimeout(r, 600));
      setStatus('devmode');
      return;
    }

    try {
      const resp = await fetch('/.netlify/functions/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          category,
          content: content.trim(),
        }),
      });
      if (!resp.ok) {
        const msg = await resp.text();
        throw new Error(msg || resp.statusText);
      }
      setStatus('success');
      setTitle('');
      setContent('');
      setCategory('fragment');
    } catch (e: unknown) {
      setStatus('error');
      setErrorMsg(e instanceof Error ? e.message : 'Unbekannter Fehler');
    }
  };

  const reset = () => { setStatus('idle'); setErrorMsg(''); };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', padding: '60px 32px 120px', maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.25em', color: 'var(--fg-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
            ultracrass / archiv
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 400 }}>
            Neuer Eintrag
          </div>
        </div>
        <div style={{ display: 'flex', gap: '20px', paddingTop: '4px' }}>
          <Link href="/">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', color: 'var(--fg-dim)', textTransform: 'uppercase', cursor: 'pointer' }}>← zurück</span>
          </Link>
          <button onClick={logout} style={{ background: 'none', border: 'none', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', color: 'var(--fg-dim)', textTransform: 'uppercase', cursor: 'pointer', padding: 0 }}>
            logout
          </button>
        </div>
      </div>

      {status === 'success' ? (
        <div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 400, color: 'var(--accent)', marginBottom: '12px' }}>
            Veröffentlicht.
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--fg-muted)', lineHeight: 1.8, marginBottom: '32px' }}>
            Der Eintrag wurde an GitHub übergeben.<br />
            Die Seite aktualisiert sich in ~60 Sekunden.
          </div>
          <button onClick={reset} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '12px 24px', cursor: 'pointer' }}>
            Weiterschreiben
          </button>
        </div>
      ) : status === 'devmode' ? (
        <div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 400, color: 'var(--accent)', marginBottom: '12px' }}>
            Entwicklungsmodus
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--fg-muted)', lineHeight: 1.9, marginBottom: '32px' }}>
            Lokale Vorschau — der Eintrag wurde nicht gespeichert.<br />
            Im Netlify-Deployment (ultracrass.com) wird er direkt<br />
            nach GitHub committed und die Seite baut neu.
          </div>
          <div style={{ border: '1px solid var(--border)', padding: '24px', marginBottom: '32px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', color: 'var(--fg-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Vorschau</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
              {CATEGORY_LABELS[category]} · {new Date().toLocaleDateString('de-DE')}
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', marginBottom: '12px' }}>{title}</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#aaa', lineHeight: 1.7 }}>{content}</div>
          </div>
          <button onClick={reset} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '12px 24px', cursor: 'pointer' }}>
            ← Bearbeiten
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <div>
            <label style={labelStyle}>Titel</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="—"
              style={{ ...inputStyle }}
              onFocus={e => (e.target.style.borderBottomColor = 'var(--fg-muted)')}
              onBlur={e => (e.target.style.borderBottomColor = 'var(--border)')}
            />
          </div>

          <div>
            <label style={labelStyle}>Kategorie</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as PostCategory)}
              style={{
                ...inputStyle,
                appearance: 'none',
                cursor: 'pointer',
                color: 'var(--fg)',
              }}
              onFocus={e => (e.target.style.borderBottomColor = 'var(--fg-muted)')}
              onBlur={e => (e.target.style.borderBottomColor = 'var(--border)')}
            >
              {(Object.keys(CATEGORY_LABELS) as PostCategory[]).map(k => (
                <option key={k} value={k} style={{ background: '#111' }}>{CATEGORY_LABELS[k]}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Text</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="—"
              rows={8}
              style={{
                ...inputStyle,
                resize: 'vertical',
              }}
              onFocus={e => (e.target.style.borderBottomColor = 'var(--fg-muted)')}
              onBlur={e => (e.target.style.borderBottomColor = 'var(--border)')}
            />
          </div>

          {status === 'error' && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#8b3333', letterSpacing: '0.05em' }}>
              Fehler: {errorMsg}
            </div>
          )}

          <div>
            <button
              onClick={publish}
              disabled={!title.trim() || !content.trim() || status === 'loading'}
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                color: (!title.trim() || !content.trim()) ? 'var(--fg-dim)' : 'var(--fg-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                padding: '14px 32px',
                cursor: (!title.trim() || !content.trim()) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                width: '100%',
              }}
              onMouseEnter={e => {
                if (title.trim() && content.trim()) {
                  e.currentTarget.style.borderColor = 'var(--fg-muted)';
                  e.currentTarget.style.color = 'var(--fg)';
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.color = (!title.trim() || !content.trim()) ? 'var(--fg-dim)' : 'var(--fg-muted)';
              }}
            >
              {status === 'loading' ? 'Wird übertragen...' : 'Veröffentlichen →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

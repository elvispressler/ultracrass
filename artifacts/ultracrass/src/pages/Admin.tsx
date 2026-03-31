import { useState } from 'react';
import { Link } from 'wouter';
import { PostCategory, CATEGORY_LABELS } from '@/types';
import { Post } from '@/types';
import postsData from '@/data/posts.json';

const ADMIN_PASSWORD = 'ultracrass2024';
const PASS_KEY = 'uc_auth';

const GERMAN_MONTHS = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];

function formatDateDE(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return `${d.getDate()}. ${GERMAN_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

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

function PostList({ isDev }: { isDev: boolean }) {
  const [posts, setPosts] = useState<Post[]>(() =>
    [...(postsData as Post[])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  );
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setDeleteError(null);

    if (isDev) {
      await new Promise(r => setTimeout(r, 400));
      setPosts(prev => prev.filter(p => p.id !== id));
      setConfirmId(null);
      setDeletingId(null);
      return;
    }

    try {
      const resp = await fetch('/.netlify/functions/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      });
      if (!resp.ok) {
        const msg = await resp.text();
        throw new Error(msg || resp.statusText);
      }
      setPosts(prev => prev.filter(p => p.id !== id));
      setConfirmId(null);
    } catch (e: unknown) {
      setDeleteError(e instanceof Error ? e.message : 'Fehler beim Löschen');
    } finally {
      setDeletingId(null);
    }
  };

  if (posts.length === 0) {
    return (
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        color: 'var(--fg-dim)',
        letterSpacing: '0.1em',
        padding: '24px 0',
      }}>
        — keine Einträge —
      </div>
    );
  }

  return (
    <div>
      {deleteError && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#8b3333', letterSpacing: '0.05em', marginBottom: '16px' }}>
          {deleteError}
        </div>
      )}
      {posts.map(post => {
        const isConfirming = confirmId === post.id;
        const isDeleting = deletingId === post.id;

        return (
          <div
            key={post.id}
            style={{
              borderBottom: '1px solid var(--border)',
              padding: '16px 0',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '16px',
              transition: 'opacity 0.2s',
              opacity: isDeleting ? 0.4 : 1,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '8px',
                letterSpacing: '0.18em',
                color: 'var(--fg-dim)',
                textTransform: 'uppercase',
                marginBottom: '5px',
              }}>
                {CATEGORY_LABELS[post.category as PostCategory] ?? post.category}
                {' · '}
                {new Date(post.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </div>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '15px',
                fontWeight: 400,
                color: 'var(--fg)',
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {post.title}
              </div>
            </div>

            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '2px' }}>
              {isConfirming ? (
                <>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={isDeleting}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      letterSpacing: '0.15em',
                      color: '#8b3333',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    {isDeleting ? '...' : 'Löschen'}
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    disabled={isDeleting}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      letterSpacing: '0.15em',
                      color: 'var(--fg-dim)',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Abbrechen
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setConfirmId(post.id); setDeleteError(null); }}
                  title="Eintrag löschen"
                  style={{
                    background: 'none',
                    border: 'none',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '14px',
                    color: 'var(--fg-dim)',
                    cursor: 'pointer',
                    padding: '0 4px',
                    lineHeight: 1,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#8b3333')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-dim)')}
                >
                  ×
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => localStorage.getItem(PASS_KEY) === '1');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PostCategory>('fragment');
  const [content, setContent] = useState('');
  const [postDate, setPostDate] = useState<string>(todayISO);
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
          action: 'publish',
          title: title.trim(),
          category,
          content: content.trim(),
          date: new Date(postDate + 'T12:00:00').toISOString(),
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
      setPostDate(todayISO());
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
              {CATEGORY_LABELS[category]} · {formatDateDE(postDate)}
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
            <label style={labelStyle}>Datum</label>
            <input
              type="date"
              value={postDate}
              onChange={e => setPostDate(e.target.value)}
              style={{
                ...inputStyle,
                colorScheme: 'dark',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                letterSpacing: '0.06em',
              }}
              onFocus={e => (e.target.style.borderBottomColor = 'var(--fg-muted)')}
              onBlur={e => (e.target.style.borderBottomColor = 'var(--border)')}
            />
            <div style={{
              marginTop: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.12em',
              color: 'var(--accent)',
              opacity: 0.8,
            }}>
              {postDate ? formatDateDE(postDate) : '—'}
            </div>
          </div>

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

          <div style={{ marginTop: '24px' }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              letterSpacing: '0.2em',
              color: 'var(--fg-muted)',
              textTransform: 'uppercase',
              marginBottom: '4px',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--border)',
            }}>
              Alle Einträge
            </div>
            <PostList isDev={isDev} />
          </div>
        </div>
      )}
    </div>
  );
}

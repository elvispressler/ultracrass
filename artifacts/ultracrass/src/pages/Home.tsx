import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import postsData from '@/data/posts.json';
import { Post, PostCategory, CATEGORY_LABELS } from '@/types';

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const sorted = [...(postsData as Post[])].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setPosts(sorted);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)' }}>

      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '20px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.25em',
            color: 'var(--fg-muted)',
            textTransform: 'uppercase',
            marginBottom: '2px',
          }}>
            ultracrass
          </div>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '18px',
            fontWeight: 400,
            color: 'var(--fg)',
            letterSpacing: '-0.01em',
          }}>
            Fragmente
          </div>
        </div>
        <Link href="/admin">
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.2em',
            color: 'var(--fg-dim)',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'color 0.2s',
            paddingTop: '4px',
            display: 'inline-block',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg-muted)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-dim)')}
          >
            ↗
          </span>
        </Link>
      </header>

      <main style={{ paddingTop: '100px', maxWidth: '680px', margin: '0 auto', padding: '100px 32px 120px' }}>
        {posts.length === 0 ? (
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--fg-muted)',
            letterSpacing: '0.1em',
            marginTop: '80px',
          }}>
            — noch nichts hier —
          </div>
        ) : (
          posts.map((post, i) => (
            <article key={post.id} style={{
              paddingTop: i === 0 ? '60px' : '64px',
              paddingBottom: '64px',
              borderBottom: i < posts.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{
                display: 'flex',
                gap: '20px',
                alignItems: 'baseline',
                marginBottom: '18px',
                flexWrap: 'wrap',
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.15em',
                  color: 'var(--fg-muted)',
                  textTransform: 'uppercase',
                }}>
                  {CATEGORY_LABELS[post.category as PostCategory] ?? post.category}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  color: 'var(--fg-dim)',
                }}>
                  {formatDate(post.date)} · {formatTime(post.date)}
                </span>
              </div>

              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(22px, 4vw, 30px)',
                fontWeight: 400,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                color: 'var(--fg)',
                marginBottom: '20px',
              }}>
                {post.title}
              </h2>

              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '15px',
                fontWeight: 300,
                lineHeight: 1.75,
                color: '#aaa',
                whiteSpace: 'pre-wrap',
              }}>
                {post.content}
              </p>
            </article>
          ))
        )}
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '40px 32px',
        fontFamily: 'var(--font-mono)',
        fontSize: '9px',
        letterSpacing: '0.2em',
        color: 'var(--fg-dim)',
        textTransform: 'uppercase',
        borderTop: '1px solid var(--border)',
      }}>
        ultracrass.com
      </footer>
    </div>
  );
}

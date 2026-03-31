import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import postsData from '@/data/posts.json';
import { Post, PostCategory, CATEGORY_LABELS } from '@/types';
import { pickArtwork, Artwork } from '@/lib/artworks';

const sessionArtwork: Artwork = pickArtwork();

const GERMAN_MONTHS_LONG = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  return `${day}. ${GERMAN_MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
};

function Meta({ post }: { post: Post }) {
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'baseline', flexWrap: 'wrap' }}>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '0.22em',
          color: 'var(--fg-muted)',
          textTransform: 'uppercase',
          transition: 'color 0.4s ease',
          cursor: 'default',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-muted)')}
      >
        {CATEGORY_LABELS[post.category as PostCategory] ?? post.category}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '0.08em',
          color: 'var(--fg-dim)',
          transition: 'color 0.4s ease',
          cursor: 'default',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg-muted)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-dim)')}
      >
        {formatDate(post.date)}
      </span>
    </div>
  );
}

function ArtworkLayer() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <img
        src={sessionArtwork.url}
        alt=""
        loading="lazy"
        style={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: '52%',
          height: '130%',
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: 0.22,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, var(--bg) 18%, transparent 62%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, transparent 70%, var(--bg) 100%)',
        }}
      />
    </div>
  );
}

function ArtworkCredit() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '18px',
        right: 0,
        fontFamily: 'var(--font-mono)',
        fontSize: '8px',
        letterSpacing: '0.12em',
        color: 'var(--fg-dim)',
        textTransform: 'uppercase',
        pointerEvents: 'none',
        zIndex: 2,
        opacity: 0.6,
      }}
    >
      {sessionArtwork.artist} · {sessionArtwork.title} · {sessionArtwork.year}
    </div>
  );
}

function HeroPost({ post }: { post: Post }) {
  const articleBase: React.CSSProperties = {
    position: 'relative',
    padding: '80px 0 72px',
    borderBottom: '1px solid var(--border)',
    overflow: 'hidden',
  };

  const contentBase: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
  };

  if (post.category === 'zitat') {
    return (
      <article style={articleBase}>
        <ArtworkLayer />
        <div style={contentBase}>
          <Meta post={post} />
          <div style={{
            marginTop: '48px',
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(28px, 6vw, 56px)',
            fontStyle: 'italic',
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: 'var(--fg)',
            maxWidth: '820px',
          }}>
            {post.content}
          </div>
          <div style={{
            marginTop: '24px',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.15em',
            color: 'var(--fg-muted)',
          }}>
            — {post.title}
          </div>
        </div>
        <ArtworkCredit />
      </article>
    );
  }

  return (
    <article style={articleBase}>
      <ArtworkLayer />
      <div style={contentBase}>
        <Meta post={post} />
        <h2 style={{
          marginTop: '28px',
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(32px, 6vw, 64px)',
          fontWeight: 400,
          lineHeight: 1.08,
          letterSpacing: '-0.03em',
          color: 'var(--fg)',
          maxWidth: '800px',
        }}>
          {post.title}
        </h2>
        <p style={{
          marginTop: '28px',
          fontFamily: 'var(--font-sans)',
          fontSize: '16px',
          fontWeight: 300,
          lineHeight: 1.8,
          color: '#999',
          maxWidth: '560px',
          whiteSpace: 'pre-wrap',
        }}>
          {post.content}
        </p>
      </div>
      <ArtworkCredit />
    </article>
  );
}

function GridPost({ post, variant }: { post: Post; variant: 'left' | 'right' | 'center' | 'wide' }) {
  const styles: Record<string, React.CSSProperties> = {
    left: { gridColumn: '1 / 2', paddingRight: '40px' },
    right: { gridColumn: '2 / 3', paddingLeft: '40px', paddingTop: '60px' },
    center: { gridColumn: '1 / -1', maxWidth: '480px', margin: '0 auto', textAlign: 'center' },
    wide: { gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 80px', alignItems: 'start' },
  };

  if (post.category === 'zitat') {
    return (
      <article style={{
        gridColumn: '1 / -1',
        padding: '64px 0',
        borderBottom: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <Meta post={post} />
        <div style={{
          marginTop: '32px',
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 'clamp(22px, 3.5vw, 36px)',
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
          color: 'var(--fg)',
          maxWidth: '640px',
          margin: '32px auto 0',
        }}>
          {post.content}
        </div>
        <div style={{
          marginTop: '20px',
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '0.15em',
          color: 'var(--fg-muted)',
        }}>
          — {post.title}
        </div>
      </article>
    );
  }

  const containerStyle: React.CSSProperties = {
    padding: '64px 0',
    borderBottom: '1px solid var(--border)',
    ...styles[variant],
  };

  if (variant === 'wide') {
    return (
      <article style={{ gridColumn: '1 / -1', padding: '64px 0', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 80px', alignItems: 'start' }}>
          <div>
            <Meta post={post} />
            <h3 style={{
              marginTop: '20px',
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(20px, 2.5vw, 28px)',
              fontWeight: 400,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              color: 'var(--fg)',
            }}>
              {post.title}
            </h3>
          </div>
          <p style={{
            paddingTop: '8px',
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            fontWeight: 300,
            lineHeight: 1.8,
            color: '#888',
            whiteSpace: 'pre-wrap',
          }}>
            {post.content}
          </p>
        </div>
      </article>
    );
  }

  return (
    <article style={containerStyle}>
      <Meta post={post} />
      <h3 style={{
        marginTop: '20px',
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(18px, 2vw, 24px)',
        fontWeight: 400,
        lineHeight: 1.25,
        letterSpacing: '-0.02em',
        color: 'var(--fg)',
        marginBottom: '14px',
      }}>
        {post.title}
      </h3>
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '13px',
        fontWeight: 300,
        lineHeight: 1.8,
        color: '#777',
        whiteSpace: 'pre-wrap',
      }}>
        {post.content}
      </p>
    </article>
  );
}

const GRID_VARIANTS: Array<'left' | 'right' | 'wide' | 'left' | 'right'> = [
  'wide', 'left', 'right', 'wide', 'left', 'right',
];

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const sorted = [...(postsData as Post[])].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setPosts(sorted);
  }, []);

  const [hero, ...rest] = posts;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)' }}>

      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '18px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.28em',
            color: 'var(--fg-muted)',
            textTransform: 'uppercase',
          }}>
            ultracrass
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.1em',
            color: 'var(--fg-dim)',
          }}>
            Fragmente · Beobachtungen · Notizen
          </span>
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
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg-muted)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-dim)')}
          >
            ↗
          </span>
        </Link>
      </header>

      <main style={{ paddingTop: '61px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 40px' }}>

          {!hero ? (
            <div style={{
              padding: '120px 0',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--fg-muted)',
              letterSpacing: '0.1em',
            }}>
              — noch nichts hier —
            </div>
          ) : (
            <>
              <HeroPost post={hero} />

              {rest.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0',
                }}>
                  {rest.map((post, i) => {
                    const variant = GRID_VARIANTS[i % GRID_VARIANTS.length];
                    const isQuote = post.category === 'zitat';
                    const effectiveVariant = isQuote ? 'left' : variant;
                    return (
                      <GridPost key={post.id} post={post} variant={isQuote ? 'left' : effectiveVariant} />
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '48px 40px',
        fontFamily: 'var(--font-mono)',
        fontSize: '9px',
        letterSpacing: '0.2em',
        color: 'var(--fg-dim)',
        textTransform: 'uppercase',
        borderTop: '1px solid var(--border)',
        marginTop: '40px',
      }}>
        ultracrass.com
      </footer>
    </div>
  );
}

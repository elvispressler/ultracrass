import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import postsData from '@/data/posts.json';
import { Post, PostCategory, PostLink, CATEGORY_LABELS } from '@/types';
import { pickArtwork, getArtworkUrl, Artwork } from '@/lib/artworks';

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
  const url = getArtworkUrl(sessionArtwork.file);
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
      {/* Ghost wash — full bleed, very low opacity */}
      <img
        src={url}
        alt=""
        loading="eager"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center top',
          opacity: 0.07,
        }}
      />
      {/* Corner fragment — bleeds in organically from top-right */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          opacity: 0.32,
          maskImage: 'radial-gradient(ellipse 58% 90% at 92% 10%, black 0%, transparent 68%)',
          WebkitMaskImage: 'radial-gradient(ellipse 58% 90% at 92% 10%, black 0%, transparent 68%)',
        }}
      />
      {/* Bottom fade to background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, transparent 55%, var(--bg) 100%)',
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

function getLinkLabel(link: PostLink): string {
  if (link.label) return link.label;
  try { return new URL(link.url).hostname.replace(/^www\./, ''); }
  catch { return link.url; }
}

function PostLinks({ links, compact = false }: { links?: PostLink[]; compact?: boolean }) {
  if (!links || links.length === 0) return null;
  return (
    <div style={{ marginTop: compact ? '14px' : '22px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
      {links.map((link, i) => (
        <a
          key={i}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.16em',
            color: 'var(--fg-dim)',
            textDecoration: 'none',
            textTransform: 'uppercase',
            transition: 'color 0.3s ease',
            display: 'inline-block',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-dim)')}
        >
          ↗ {getLinkLabel(link)}
        </a>
      ))}
    </div>
  );
}

const glassPanel: React.CSSProperties = {
  position: 'relative',
  zIndex: 1,
  display: 'inline-block',
  maxWidth: '780px',
  width: '100%',
  background: 'rgba(6, 6, 6, 0.56)',
  backdropFilter: 'blur(22px)',
  WebkitBackdropFilter: 'blur(22px)',
  padding: '52px 60px 56px',
  borderBottom: '1px solid rgba(255,255,255,0.045)',
  borderRight: '1px solid rgba(255,255,255,0.025)',
  marginLeft: '-60px',
};

function HeroPost({ post }: { post: Post }) {
  const articleBase: React.CSSProperties = {
    position: 'relative',
    minHeight: '480px',
    display: 'flex',
    alignItems: 'flex-start',
    paddingTop: '72px',
    paddingBottom: '0',
    borderBottom: '1px solid var(--border)',
    overflow: 'hidden',
  };

  if (post.category === 'zitat') {
    return (
      <article style={articleBase}>
        <ArtworkLayer />
        <div style={glassPanel}>
          <Meta post={post} />
          <div style={{
            marginTop: '44px',
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(26px, 5.5vw, 54px)',
            fontStyle: 'italic',
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: 'var(--fg)',
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
          <PostLinks links={post.links} />
        </div>
        <ArtworkCredit />
      </article>
    );
  }

  return (
    <article style={articleBase}>
      <ArtworkLayer />
      <div style={glassPanel}>
        <Meta post={post} />
        <h2 style={{
          marginTop: '28px',
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(30px, 5.5vw, 62px)',
          fontWeight: 400,
          lineHeight: 1.08,
          letterSpacing: '-0.03em',
          color: 'var(--fg)',
        }}>
          {post.title}
        </h2>
        <p style={{
          marginTop: '28px',
          fontFamily: 'var(--font-sans)',
          fontSize: '15px',
          fontWeight: 300,
          lineHeight: 1.85,
          color: '#9a9a9a',
          whiteSpace: 'pre-wrap',
        }}>
          {post.content}
        </p>
        <PostLinks links={post.links} />
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

  if (variant === 'center' && post.category !== 'zitat') {
    return (
      <article style={{
        gridColumn: '1 / -1',
        padding: '72px 0',
        borderBottom: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <Meta post={post} />
        <h3 style={{
          marginTop: '36px',
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: 'clamp(22px, 3.8vw, 38px)',
          lineHeight: 1.18,
          letterSpacing: '-0.015em',
          color: 'var(--fg)',
          maxWidth: '620px',
          margin: '36px auto 0',
        }}>
          {post.title}
        </h3>
        {post.content && (
          <p style={{
            marginTop: '20px',
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            fontWeight: 300,
            lineHeight: 1.8,
            color: '#777',
            maxWidth: '440px',
            margin: '20px auto 0',
            whiteSpace: 'pre-wrap',
          }}>
            {post.content}
          </p>
        )}
        <PostLinks links={post.links} compact />
      </article>
    );
  }

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
        <PostLinks links={post.links} compact />
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
          <div>
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
            <PostLinks links={post.links} compact />
          </div>
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
      <PostLinks links={post.links} compact />
    </article>
  );
}

type GridVariant = 'left' | 'right' | 'center' | 'wide';

function getVariantForPost(post: Post, sideIndex: number): GridVariant {
  if (post.category === 'zitat') return 'center';
  const len = (post.title + post.content).length;
  if (len >= 480) return 'wide';
  if (len < 100) return 'center';
  return sideIndex % 2 === 0 ? 'left' : 'right';
}

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
                  {(() => {
                    let sideIdx = 0;
                    return rest.map((post) => {
                      const variant = getVariantForPost(post, sideIdx);
                      if (variant === 'left' || variant === 'right') sideIdx++;
                      return <GridPost key={post.id} post={post} variant={variant} />;
                    });
                  })()}
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

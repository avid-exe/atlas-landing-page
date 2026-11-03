'use client'

import { useEffect, useState } from 'react'

const chatbotUrl = 'https://unilesa-atlas.vercel.app/'
const feedbackUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSd6GVS0c7m0Q3exjKru-43uJUL6-g39BU2mvwKfBugMQAKMng/viewform'

function ArrowUpRight() {
  return <span aria-hidden="true" className="arrow">↗</span>
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="section-label">{children}</p>
}

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [iframeBlocked, setIframeBlocked] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    let savedTheme: string | null = null
    try { savedTheme = window.localStorage.getItem('atlas-theme') } catch {}
    const nextTheme = (savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : null) ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    setTheme(nextTheme)
    document.documentElement.dataset.theme = nextTheme
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    document.documentElement.dataset.theme = nextTheme
    try { window.localStorage.setItem('atlas-theme', nextTheme) } catch {}
  }

  useEffect(() => {
    if (iframeLoaded) return
    const timeout = window.setTimeout(() => setIframeBlocked(true), 10000)
    return () => window.clearTimeout(timeout)
  }, [iframeLoaded])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus()
      }
    }
    if (menuOpen) window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <main>
      <a className="skip-link" href="#top">Skip to content</a>
      <header className="site-header">
        <div className="container nav-wrap">
          <a className="brand" href="#top" aria-label="Atlas home" onClick={closeMenu}>
            <img src="/atlas-network-logo.svg" alt="Atlas network logo" className="brand-mark" />
            <span>Atlas</span>
          </a>
          <button className="menu-toggle" aria-expanded={menuOpen} aria-controls="site-nav" onClick={() => setMenuOpen(!menuOpen)}>
            <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
            <span className="menu-lines" />
          </button>
          <nav id="site-nav" className={menuOpen ? 'site-nav open' : 'site-nav'} aria-label="Main navigation">
            <a href="#about" onClick={closeMenu}>About</a>
            <a href="#atlas-ai" onClick={closeMenu}>Atlas AI</a>
            <a href="#library" onClick={closeMenu}>Atlas Library</a>
            <a href="#feedback" onClick={closeMenu}>Student Feedback</a>
            <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}><span className="sr-only">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>{theme === 'dark' ? <svg className="theme-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg> : <svg className="theme-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.2A8 8 0 0 1 8.8 4 8.5 8.5 0 1 0 20 15.2Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>}</button><a className="button button-small" href={chatbotUrl} target="_blank" rel="noreferrer">Try Atlas AI <ArrowUpRight /></a>
          </nav>
        </div>
      </header>

      <section id="top" tabIndex={-1} className="hero container">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> An independent student-built project</p>
          <h1>Your campus.<br /><em>Your questions.</em><br />One Atlas.</h1>
          <p className="hero-text">Atlas is a student-built platform designed to help University of Ilesa students find information, access helpful resources, and navigate campus life more easily.</p>
          <div className="hero-actions">
            <a className="button" href={chatbotUrl} target="_blank" rel="noreferrer">Try Atlas AI <ArrowUpRight /></a>
            <a className="text-link" href="#feedback">Help shape Atlas <span aria-hidden="true">↓</span></a>
          </div>
          <p className="status-note">Atlas is currently being built and improved with student feedback.</p>
        </div>
      </section>

      <section id="about" className="section section-bordered container">
        <div className="section-intro">
          <SectionLabel>01 / The work in progress</SectionLabel>
          <h2>Building Atlas,<br /><em>one step at a time.</em></h2>
          <p>We&apos;re starting with the tools students need today and gradually building what comes next.</p>
        </div>
        <div className="milestones">
          <article className="milestone active">
            <div className="milestone-top"><span>01</span><span className="pill available"><i /> Available</span></div>
            <h3>Atlas AI</h3>
            <p>A university-focused AI assistant that helps students find information and guidance.</p>
          </article>
          <article className="milestone">
            <div className="milestone-top"><span>02</span><span className="pill"><i /> In development</span></div>
            <h3>Atlas Library</h3>
            <p>A searchable collection of practical guides and tutorials designed to help students navigate university processes.</p>
          </article>
          <article className="milestone">
            <div className="milestone-top"><span>03</span><span className="pill"><i /> Exploring</span></div>
            <h3>More student tools</h3>
            <p>Additional features will be considered based on real student challenges and feedback.</p>
          </article>
        </div>
      </section>

      <section id="atlas-ai" className="section container ai-section">
        <div className="ai-heading">
          <div><SectionLabel>02 / Available now</SectionLabel><h2>Meet <em>Atlas AI.</em></h2></div>
          <p>Ask questions about university information and get helpful guidance through Atlas AI.</p>
        </div>
        <div className="chat-frame">
          <div className="frame-bar"><span className="frame-dot" /><span className="frame-url">Atlas AI / Student assistant</span><span className="frame-live">Live preview</span></div>
          {!iframeLoaded && !iframeBlocked && <div className="iframe-loading" aria-live="polite">Loading Atlas AI<span className="loading-dots">...</span></div>}
          {iframeBlocked && !iframeLoaded && <div className="iframe-fallback" role="status"><strong>Atlas AI is ready in its own tab.</strong><span>The preview is taking longer than expected. You can open the full assistant in a new tab.</span><a className="button button-small" href={chatbotUrl} target="_blank" rel="noreferrer">Open Atlas AI <ArrowUpRight /></a></div>}
          <iframe title="Live interactive preview of Atlas AI" src={chatbotUrl} onLoad={() => { setIframeLoaded(true); setIframeBlocked(false) }} />
        </div>
        <div className="ai-footer"><p>The full Atlas AI experience is available in its own space.</p><a className="text-link" href={chatbotUrl} target="_blank" rel="noreferrer">Open Atlas AI <ArrowUpRight /></a></div>
      </section>

      <section id="library" className="section library-section container section-bordered">
        <div><SectionLabel>03 / Coming next</SectionLabel><h2>A guide for the things<br /><em>nobody explains.</em></h2></div>
        <div className="library-copy"><span className="pill large"><i /> In development</span><p>Atlas Library is being developed to help students find clear, practical guides for common university processes.</p><ul><li>Searchable student guides</li><li>Step-by-step instructions</li><li>Student ratings and anonymous comments</li><li>A way to report outdated information</li></ul></div>
      </section>

      <section id="feedback" className="feedback-section">
        <div className="container feedback-inner">
          <SectionLabel>04 / Your voice matters</SectionLabel>
          <h2>Help us build something<br /><em>students actually need.</em></h2>
          <p>We don&apos;t want to guess what students struggle with. We want to hear directly from you.</p>
          <a className="button button-light" href={feedbackUrl} target="_blank" rel="noreferrer">Share your experience <ArrowUpRight /></a>
        </div>
      </section>

      <section className="section approach container">
        <div><SectionLabel>05 / Our approach</SectionLabel><h2>Built with students,<br /><em>for students.</em></h2></div>
        <div className="principles">
          <article><span>01</span><h3>Listen first</h3><p>Understand the challenges UNILESA students experience.</p></article>
          <article><span>02</span><h3>Build thoughtfully</h3><p>Develop tools that solve meaningful problems rather than adding unnecessary features.</p></article>
          <article><span>03</span><h3>Improve continuously</h3><p>Use student feedback to refine existing features and guide what comes next.</p></article>
        </div>
      </section>

      <section className="community-section container"><div><SectionLabel>06 / Keep in touch</SectionLabel><h2>Stay close to what&apos;s next.</h2><p>Follow Atlas for development updates, upcoming features, and opportunities to share your ideas.</p></div><a className="button" href="https://whatsapp.com/channel/0029Vb9303PLY6czypOJq71Y" target="_blank" rel="noreferrer">Join our WhatsApp channel <ArrowUpRight /></a></section>

      <footer className="site-footer"><div className="container footer-top"><a className="brand" href="#top"><img src="/atlas-network-logo.svg" alt="Atlas network logo" className="brand-mark" /><span>Atlas</span></a><p>Built for UNILESA students.</p><div className="footer-links"><a href={chatbotUrl} target="_blank" rel="noreferrer">Atlas AI <ArrowUpRight /></a><a href={feedbackUrl} target="_blank" rel="noreferrer">Student feedback <ArrowUpRight /></a></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Atlas</span><span>Atlas is an independent student-built project and is not officially affiliated with or endorsed by the University of Ilesa.</span></div></footer>
    </main>
  )
}

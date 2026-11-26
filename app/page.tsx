'use client'

import { useEffect, useRef, useState } from 'react'

const chatbotUrl = 'https://unilesa-atlas.vercel.app/'
const libraryUrl = 'https://atlas-library-henna.vercel.app/'
const feedbackUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSd6GVS0c7m0Q3exjKru-43uJUL6-g39BU2mvwKfBugMQAKMng/viewform'

export default function Page() {
  const headerRef = useRef<HTMLElement>(null)
  const milestonesRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [iframeBlocked, setIframeBlocked] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add('reveal-enabled')

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.08,
      }
    )

    const elements = document.querySelectorAll('.reveal')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobile = window.matchMedia('(max-width: 720px)')
    let frame = 0
    let lastScroll = Math.max(0, window.scrollY)
    const update = () => {
      frame = 0
      const scroll = Math.max(0, window.scrollY)
      const header = headerRef.current
      if (header) {
        header.dataset.scrolled = String(scroll > 24)
        if (scroll < 96) {
          header.dataset.hidden = 'false'
          lastScroll = scroll
        } else if (Math.abs(scroll - lastScroll) >= 10) {
          header.dataset.hidden = String(scroll > lastScroll)
          lastScroll = scroll
        }
      }
      const timeline = milestonesRef.current
      if (!timeline) return
      const rect = timeline.getBoundingClientRect()
      const distance = mobile.matches ? rect.height : window.innerHeight * 0.5
      const progress = motion.matches ? 1 : Math.min(1, Math.max(0, (window.innerHeight * 0.8 - rect.top) / distance))
      timeline.style.setProperty('--timeline-progress', String(progress))
      timeline.querySelectorAll<HTMLElement>('.milestone').forEach((item) => {
        const marker = window.getComputedStyle(item, '::before')
        const threshold = mobile.matches
          ? (item.offsetTop + parseFloat(marker.top) + 5) / rect.height
          : (item.offsetLeft + parseFloat(marker.left) + 5) / rect.width
        item.dataset.linked = String(progress >= threshold && progress > 0)
      })
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    const resize = new ResizeObserver(schedule)
    if (milestonesRef.current) resize.observe(milestonesRef.current)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    motion.addEventListener('change', schedule)
    update()
    return () => {
      window.cancelAnimationFrame(frame)
      resize.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      motion.removeEventListener('change', schedule)
    }
  }, [])

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
      <header ref={headerRef} className="site-header" data-menu-open={menuOpen}>
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
            <a className="button button-small" href={chatbotUrl} target="_blank" rel="noreferrer">Try Atlas AI</a>
          </nav>
        </div>
      </header>

      <section id="top" tabIndex={-1} className="hero container">
        <div className="hero-copy">
          <h1>Your campus.<br /><em>Your questions.</em><br />One Atlas.</h1>
          <p className="hero-text">Atlas helps University of Ilesa students find answers, access resources, and navigate campus life.</p>
          <div className="hero-actions">
            <a className="button" href={chatbotUrl} target="_blank" rel="noreferrer">Try Atlas AI</a>
            <a className="button button-outline" href={libraryUrl} target="_blank" rel="noreferrer">Explore Atlas Library</a>
            <a className="text-link" href="#feedback">Help shape Atlas</a>
          </div>
        </div>
      </section>

      <section id="about" className="section section-bordered container">
        <div className="section-intro reveal">
          <div>
            <h2>Building Atlas,<br /><em>one step at a time.</em></h2>
          </div>
          <p>We&apos;re starting with the tools students need today and gradually building what comes next.</p>
        </div>
        <div ref={milestonesRef} className="milestones reveal reveal-stagger">
          <article className="milestone active">
            <div className="milestone-top"><span>01</span><span className="pill available"><i /> Available</span></div>
            <h3>Atlas AI</h3>
            <p>A university-focused AI assistant that helps students find information and guidance.</p>
          </article>
          <article className="milestone active">
            <div className="milestone-top"><span>02</span><span className="pill available"><i /> Available</span></div>
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
        <div className="ai-heading reveal">
          <div><h2>Meet <em>Atlas AI.</em></h2></div>
          <p>Ask questions about university information and get helpful guidance through Atlas AI.</p>
        </div>
        <div className="chat-frame reveal">
          <div className="frame-bar"><span className="frame-dot" /><span className="frame-url">Atlas AI / Student assistant</span><span className="frame-live">Live preview</span></div>
          {!iframeLoaded && !iframeBlocked && <div className="iframe-loading" aria-live="polite">Loading Atlas AI<span className="loading-dots">...</span></div>}
          {iframeBlocked && !iframeLoaded && <div className="iframe-fallback" role="status"><strong>Atlas AI is ready in its own tab.</strong><span>The preview is taking longer than expected. You can open the full assistant in a new tab.</span><a className="button button-small" href={chatbotUrl} target="_blank" rel="noreferrer">Open Atlas AI</a></div>}
          <iframe title="Live interactive preview of Atlas AI" src={chatbotUrl} onLoad={() => { setIframeLoaded(true); setIframeBlocked(false) }} />
        </div>
        <div className="ai-footer reveal"><p>The full Atlas AI experience is available in its own space.</p><a className="text-link" href={chatbotUrl} target="_blank" rel="noreferrer">Open Atlas AI</a></div>
      </section>

      <section id="library" className="section library-section container section-bordered">
        <div className="reveal">
          <h2>A guide for the things<br /><em>nobody explains.</em></h2>
        </div>
        <div className="library-copy reveal">
          <span className="pill large available"><i /> Live</span>
          <p>Atlas Library is live to help students find clear, practical guides for common university processes.</p>
          <ul>
            <li>Searchable student guides</li>
            <li>Step-by-step instructions</li>
            <li>Student ratings and anonymous comments</li>
            <li>A way to report outdated information</li>
          </ul>
          <div className="library-actions">
            <a className="button" href={libraryUrl} target="_blank" rel="noreferrer">Explore Atlas Library</a>
          </div>
        </div>
      </section>

      <section id="feedback" className="feedback-section">
        <div className="container feedback-inner reveal">
          <h2>Help us build something<br /><em>students actually need.</em></h2>
          <p>We don&apos;t want to guess what students struggle with. We want to hear directly from you.</p>
          <a className="button button-light" href={feedbackUrl} target="_blank" rel="noreferrer">Share your experience</a>
        </div>
      </section>

      <section className="section approach container">
        <div className="reveal">
          <h2>Built with students,<br /><em>for students.</em></h2>
        </div>
        <div className="principles reveal reveal-stagger">
          <article><span>01</span><h3>Listen first</h3><p>Understand the challenges UNILESA students experience.</p></article>
          <article><span>02</span><h3>Build thoughtfully</h3><p>Develop tools that solve meaningful problems rather than adding unnecessary features.</p></article>
          <article><span>03</span><h3>Improve continuously</h3><p>Use student feedback to refine existing features and guide what comes next.</p></article>
        </div>
      </section>

      <section className="community-section container reveal">
        <div>
          <h2>Stay close to what&apos;s next.</h2>
          <p>Follow Atlas for development updates, upcoming features, and opportunities to share your ideas.</p>
        </div>
        <a className="button" href="https://whatsapp.com/channel/0029Vb9303PLY6czypOJq71Y" target="_blank" rel="noreferrer">Join our WhatsApp channel</a>
      </section>

      <footer className="site-footer">
        <div className="container footer-top">
          <div className="footer-brand">
            <a className="brand" href="#top">
              <img src="/atlas-network-logo.svg" alt="Atlas network logo" className="brand-mark" />
              <span>Atlas</span>
            </a>
            <p>Built for UNILESA students.</p>
          </div>
          <nav className="footer-links" aria-label="Atlas tools">
            <h3>Tools</h3>
            <a href={chatbotUrl} target="_blank" rel="noreferrer">Atlas AI</a>
            <a href={libraryUrl} target="_blank" rel="noreferrer">Atlas Library</a>
          </nav>
          <nav className="footer-links" aria-label="Atlas community">
            <h3>Community</h3>
            <a href={feedbackUrl} target="_blank" rel="noreferrer">Student feedback</a>
            <a href="https://whatsapp.com/channel/0029Vb9303PLY6czypOJq71Y" target="_blank" rel="noreferrer">WhatsApp channel</a>
          </nav>
          <nav className="footer-links" aria-label="About Atlas">
            <h3>Atlas</h3>
            <a href="#about">About the project</a>
            <a href="#top">Back to top</a>
          </nav>
        </div>
        <div className="container footer-bottom">
          <span>Independent student project. Not affiliated with or endorsed by UNILESA.</span>
          <span>© {new Date().getFullYear()} Atlas</span>
        </div>
      </footer>
    </main>
  )
}

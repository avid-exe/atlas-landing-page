'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export interface MilestoneSliderProps {
  chatbotUrl: string
  libraryUrl: string
}

interface MilestoneCardData {
  id: string
  number: string
  title: string
  description: string
  status: string
  isAvailable: boolean
  href?: string
  external?: boolean
}

export function MilestoneSlider({ chatbotUrl, libraryUrl }: MilestoneSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Motion refs
  const offsetRef = useRef(0)
  const singleCycleWidthRef = useRef(0)
  const isDraggingRef = useRef(false)
  const hasMovedRef = useRef(false)
  const startXRef = useRef(0)
  const lastXRef = useRef(0)
  const isHoveredRef = useRef(false)
  const isManualInteractingRef = useRef(false)
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const prefersReducedMotionRef = useRef(false)

  const items: MilestoneCardData[] = [
    {
      id: 'atlas-ai',
      number: '01',
      title: 'Atlas AI',
      description: 'A university-focused AI assistant that helps students find information and guidance.',
      status: 'Available',
      isAvailable: true,
      href: chatbotUrl,
      external: true,
    },
    {
      id: 'atlas-library',
      number: '02',
      title: 'Atlas Library',
      description: 'A searchable collection of practical guides and tutorials designed to help students navigate university processes.',
      status: 'Available',
      isAvailable: true,
      href: libraryUrl,
      external: true,
    },
    {
      id: 'student-tools',
      number: '03',
      title: 'More student tools',
      description: 'Additional features will be considered based on real student challenges and feedback.',
      status: 'Exploring',
      isAvailable: false,
      href: '#feedback',
      external: false,
    },
  ]

  // Repeat items 4 times to ensure seamless infinite looping on any screen width
  const loopedItems = [...items, ...items, ...items, ...items]

  // Measure one full cycle (width of the first 3 cards)
  const measureCycle = useCallback(() => {
    if (!trackRef.current) return
    const children = trackRef.current.children
    if (children.length >= 4) {
      const first = children[0] as HTMLElement
      const fourth = children[3] as HTMLElement
      const cycleWidth = fourth.offsetLeft - first.offsetLeft
      if (cycleWidth > 0) {
        singleCycleWidthRef.current = cycleWidth
      }
    }
  }, [])

  useEffect(() => {
    prefersReducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    measureCycle()
    window.addEventListener('resize', measureCycle)
    return () => window.removeEventListener('resize', measureCycle)
  }, [measureCycle])

  // Continuous horizontal drift animation
  useEffect(() => {
    let animId: number
    let lastTime = performance.now()

    const step = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1)
      lastTime = now

      const isPaused =
        isDraggingRef.current ||
        isHoveredRef.current ||
        isManualInteractingRef.current ||
        prefersReducedMotionRef.current

      if (!isPaused && singleCycleWidthRef.current > 0) {
        // Smooth drift at ~32 pixels per second
        offsetRef.current += 32 * dt

        // Wrap within single cycle seamlessly
        if (offsetRef.current >= singleCycleWidthRef.current) {
          offsetRef.current -= singleCycleWidthRef.current
        } else if (offsetRef.current < 0) {
          offsetRef.current += singleCycleWidthRef.current
        }

        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`
        }
      }

      animId = requestAnimationFrame(step)
    }

    animId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animId)
  }, [])

  // Drag handling
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return // Left click / touch only
    isDraggingRef.current = true
    hasMovedRef.current = false
    startXRef.current = e.clientX
    lastXRef.current = e.clientX

    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current)
    }

    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {}

    setIsDragging(true)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return

    const deltaX = e.clientX - lastXRef.current
    lastXRef.current = e.clientX

    if (Math.abs(e.clientX - startXRef.current) > 5) {
      hasMovedRef.current = true
    }

    offsetRef.current -= deltaX

    if (singleCycleWidthRef.current > 0) {
      if (offsetRef.current >= singleCycleWidthRef.current) {
        offsetRef.current -= singleCycleWidthRef.current
      } else if (offsetRef.current < 0) {
        offsetRef.current += singleCycleWidthRef.current
      }
    }

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    setIsDragging(false)

    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {}

    // Give the user 1.8 seconds to view the card after releasing
    isManualInteractingRef.current = true
    resumeTimeoutRef.current = setTimeout(() => {
      isManualInteractingRef.current = false
    }, 1800)
  }

  // Wheel / Trackpad horizontal swipe
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0)
    if (delta !== 0) {
      offsetRef.current += delta
      if (singleCycleWidthRef.current > 0) {
        if (offsetRef.current >= singleCycleWidthRef.current) {
          offsetRef.current -= singleCycleWidthRef.current
        } else if (offsetRef.current < 0) {
          offsetRef.current += singleCycleWidthRef.current
        }
      }
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`
      }

      isManualInteractingRef.current = true
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
      resumeTimeoutRef.current = setTimeout(() => {
        isManualInteractingRef.current = false
      }, 1800)
    }
  }

  // Nudge buttons for keyboard & click navigation
  const nudge = (direction: 'left' | 'right') => {
    const children = trackRef.current?.children
    const cardWidth = children && children.length > 0 ? (children[0] as HTMLElement).offsetWidth : 380
    const step = direction === 'right' ? cardWidth : -cardWidth

    const startOffset = offsetRef.current
    const startTime = performance.now()
    const duration = 350

    isManualInteractingRef.current = true
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      let currentOffset = startOffset + step * ease

      if (singleCycleWidthRef.current > 0) {
        if (currentOffset >= singleCycleWidthRef.current) {
          currentOffset -= singleCycleWidthRef.current
        } else if (currentOffset < 0) {
          currentOffset += singleCycleWidthRef.current
        }
      }

      offsetRef.current = currentOffset
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(-${currentOffset}px, 0, 0)`
      }

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        resumeTimeoutRef.current = setTimeout(() => {
          isManualInteractingRef.current = false
        }, 1800)
      }
    }

    requestAnimationFrame(animate)
  }

  const handleCardClick = (e: React.MouseEvent, item: MilestoneCardData) => {
    if (hasMovedRef.current) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
    if (!item.href) return
    if (item.external) {
      window.open(item.href, '_blank', 'noopener,noreferrer')
    } else {
      const el = document.querySelector(item.href)
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="milestones-slider-section" aria-label="Interactive milestones roadmap">
      <div className="container milestones-controls-bar">
        <span className="milestones-drag-hint">
          <span>✦</span> Drag or swipe to move
        </span>
        <div className="milestones-nav-buttons">
          <button
            type="button"
            className="milestones-nav-btn"
            onClick={() => nudge('left')}
            aria-label="Previous milestone"
            title="Previous milestone"
          >
            ←
          </button>
          <button
            type="button"
            className="milestones-nav-btn"
            onClick={() => nudge('right')}
            aria-label="Next milestone"
            title="Next milestone"
          >
            →
          </button>
        </div>
      </div>

      <div
        className={`milestones-viewport ${isDragging ? 'is-dragging' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        onMouseEnter={() => { isHoveredRef.current = true }}
        onMouseLeave={() => { isHoveredRef.current = false }}
      >
        {/* Soft edge fades into background */}
        <div className="milestones-fade-edge left" aria-hidden="true" />
        <div className="milestones-fade-edge right" aria-hidden="true" />

        <div className="milestones-track" ref={trackRef}>
          {loopedItems.map((item, idx) => {
            const isClickable = Boolean(item.href)
            return (
              <article
                key={`${item.id}-${idx}`}
                className={`milestone ${item.isAvailable ? 'active' : ''} ${isClickable ? 'milestone-clickable' : ''}`}
                onClick={(e) => handleCardClick(e, item)}
                role={isClickable ? 'button' : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && isClickable) {
                    e.preventDefault()
                    handleCardClick(e as unknown as React.MouseEvent, item)
                  }
                }}
                aria-label={isClickable ? `${item.title} - ${item.status}. Open link.` : undefined}
              >
                <div className="milestone-top">
                  <span>{item.number}</span>
                  <span className={`pill ${item.isAvailable ? 'available' : ''}`}>
                    <i /> {item.status}
                  </span>
                </div>
                <h3>
                  {item.title}
                  {item.href && item.external && (
                    <span aria-hidden="true" className="arrow milestone-arrow">↗</span>
                  )}
                </h3>
                <p>{item.description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}


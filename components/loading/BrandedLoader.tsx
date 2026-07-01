'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const FULL_TEXT = 'Our Experts . Your Growth'
const TYPING_SPEED = 50

export function BrandedLoader() {
  const [visible, setVisible] = useState(false)
  const [typed, setTyped] = useState('')
  const [zoomed, setZoomed] = useState(false)

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 100)
    const zoomTimer = setTimeout(() => setZoomed(true), 300)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(zoomTimer)
    }
  }, [])

  useEffect(() => {
    if (!visible) return
    let i = 0
    const interval = setInterval(() => {
      i++
      setTyped(FULL_TEXT.slice(0, i))
      if (i >= FULL_TEXT.length) clearInterval(interval)
    }, TYPING_SPEED)
    return () => clearInterval(interval)
  }, [visible])

  const renderText = () => {
    const chars = FULL_TEXT.split('')
    let eIndex = chars.findIndex((c) => c.toLowerCase() === 'e')
    if (eIndex === -1) eIndex = 3

    return FULL_TEXT.split('').map((char, i) => {
      if (i >= typed.length) return null
      const isE = i === eIndex && char === 'E'
      return (
        <span
          key={i}
          style={{
            color: isE ? '#F59B19' : '#1E6991',
            fontWeight: 500,
          }}
        >
          {char}
        </span>
      )
    })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
      <div
        className="transition-all duration-700 ease-out"
        style={{
          transform: zoomed ? 'scale(1)' : 'scale(1.6)',
          opacity: visible ? 1 : 0,
        }}
      >
        <Image
          src="/vaalogo.svg"
          alt="VAA Philippines"
          width={120}
          height={120}
          priority
          className="drop-shadow-xl"
        />
      </div>

      <div
        className="transition-all duration-700 ease-out"
        style={{
          transform: zoomed ? 'scale(1)' : 'scale(1.3)',
          opacity: visible ? 1 : 0,
        }}
      >
        <p
          className="text-2xl tracking-wide"
          style={{
            minHeight: '2rem',
            fontFamily: 'var(--font-montserrat)',
          }}
        >
          {renderText()}
          {typed.length < FULL_TEXT.length && (
            <span className="animate-pulse text-[#1E6991]">|</span>
          )}
        </p>
      </div>
    </div>
  )
}

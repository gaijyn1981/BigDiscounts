'use client'

import { useEffect, useState } from 'react'

interface Props {
  photos: string[]
  title: string
  price: number
  contactButton: React.ReactNode
}

export default function ProductAnimations({ photos, title, price, contactButton }: Props) {
  const [visible, setVisible] = useState(false)
  const [activePhoto, setActivePhoto] = useState(0)
  const [displayPrice, setDisplayPrice] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!visible) return
    let start = 0
    const duration = 800
    const step = price / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= price) {
        setDisplayPrice(price)
        clearInterval(timer)
      } else {
        setDisplayPrice(parseFloat(start.toFixed(2)))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [visible, price])

  // Close lightbox on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!lightbox) return
      if (e.key === 'Escape') setLightbox(false)
      if (e.key === 'ArrowRight') setLightboxIndex(i => (i + 1) % photos.length)
      if (e.key === 'ArrowLeft') setLightboxIndex(i => (i - 1 + photos.length) % photos.length)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightbox, photos.length])

  return (
    <>
      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{background: 'rgba(0,0,0,0.95)'}}
          onClick={() => setLightbox(false)}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white text-3xl font-black hover:opacity-70 z-50"
            onClick={() => setLightbox(false)}
          >✕</button>

          {/* Prev arrow */}
          {photos.length > 1 && (
            <button
              className="absolute left-4 text-white text-4xl font-black hover:opacity-70 z-50 px-4 py-2"
              onClick={e => { e.stopPropagation(); setLightboxIndex(i => (i - 1 + photos.length) % photos.length) }}
            >‹</button>
          )}

          {/* Image */}
          <img
            src={photos[lightboxIndex]}
            alt={title}
            className="max-h-screen max-w-screen-lg object-contain px-16"
            style={{transition: 'opacity 0.2s ease'}}
            onClick={e => e.stopPropagation()}
          />

          {/* Next arrow */}
          {photos.length > 1 && (
            <button
              className="absolute right-4 text-white text-4xl font-black hover:opacity-70 z-50 px-4 py-2"
              onClick={e => { e.stopPropagation(); setLightboxIndex(i => (i + 1) % photos.length) }}
            >›</button>
          )}

          {/* Photo counter */}
          {photos.length > 1 && (
            <div className="absolute bottom-4 text-gray-400 text-sm">
              {lightboxIndex + 1} / {photos.length}
            </div>
          )}
        </div>
      )}

      {/* Photo Gallery */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}
      >
        <div className="space-y-3">
          {photos.length > 0 ? (
            <>
              <div
                className="w-full h-72 rounded-xl overflow-hidden cursor-zoom-in"
                onClick={() => { setLightboxIndex(activePhoto); setLightbox(true) }}
              >
                <img
                  src={photos[activePhoto]}
                  alt={title}
                  className="w-full h-full object-cover hover:scale-105"
                  style={{transition: 'transform 0.3s ease'}}
                />
              </div>
              {photos.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt={title}
                      onClick={() => setActivePhoto(i)}
                      className="w-full h-24 object-cover rounded-lg cursor-pointer"
                      style={{
                        border: activePhoto === i ? '2px solid #fcd968' : '2px solid transparent',
                        transition: 'border 0.2s ease, transform 0.2s ease',
                        transform: activePhoto === i ? 'scale(1.03)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-72 rounded-xl flex items-center justify-center text-8xl" style={{background: '#222'}}>
              📦
            </div>
          )}
        </div>

        {/* Animated Price */}
        <div className="mt-4 text-4xl font-black" style={{color: '#fcd968'}}>
          £{displayPrice.toFixed(2)}
        </div>
      </div>
    </>
  )
}

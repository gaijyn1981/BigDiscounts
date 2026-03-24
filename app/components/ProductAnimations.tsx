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

  // Fade in on load
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Price counter animation
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

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      {/* Photo Gallery */}
      <div className="space-y-3">
        {photos.length > 0 ? (
          <>
            <div className="w-full h-72 rounded-xl overflow-hidden">
              <img
                src={photos[activePhoto]}
                alt={title}
                className="w-full h-full object-cover"
                style={{ transition: 'opacity 0.3s ease' }}
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
          <div className="w-full h-72 rounded-xl flex items-center justify-center text-8xl" style={{ background: '#222' }}>
            📦
          </div>
        )}
      </div>

      {/* Animated Price */}
      <div className="mt-4 text-4xl font-black" style={{ color: '#fcd968' }}>
        £{displayPrice.toFixed(2)}
      </div>
    </div>
  )
}

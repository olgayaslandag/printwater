'use client'

import { useState } from 'react'
import './video-gallery.css'

const videos = [
  {
    id: '894nqTYZZhw',
    title: 'Baskı Suyu Arıtma Sistemleri',
  },
  {
    id: 'BOGYntepF2I',
    title: 'Matbaa Baskı Nemlendirme',
  },
  {
    id: '_AYGk8agNLU',
    title: 'Tekstil Dijital Baskı Nemlendirme',
  },
  {
    id: 'aE7DttyS3bA',
    title: 'Tekstil Dokuma Nemlendirme',
  },
]

export default function VideoGallery() {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)

  const closeModal = () => setActiveVideoId(null)

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      closeModal()
    }
  }

  return (
    <section className="section video-gallery">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="kicker">VİDEO GALERİ</div>
            <h2>Çözümlerimizi Görüntüleyin</h2>
          </div>
        </div>

        <div className="video-grid">
          {videos.map((video) => (
            <div
              key={video.id}
              className="video-card"
              onClick={() => setActiveVideoId(video.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveVideoId(video.id)
                }
              }}
            >
              <img
                src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                alt={video.title}
                loading="lazy"
              />
              <div className="video-overlay">
                <p className="video-title">{video.title}</p>
              </div>
              <div className="play-button" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>

      {activeVideoId && (
        <div
          className="modal-backdrop"
          onClick={handleBackdropClick}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-label="Video oynatıcı"
        >
          <div className="modal-content">
            <button
              type="button"
              className="modal-close"
              onClick={closeModal}
              aria-label="Kapat"
            >
              ×
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
              title="Video oynatıcı"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  )
}

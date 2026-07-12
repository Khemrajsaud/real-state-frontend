import { useState, useEffect, useCallback } from 'react'
import {
  getMediaUrl,
  getPropertyImages,
  getPropertyTitle,
  type Property,
  type PropertyMedia,
} from '../../api/properties'
import { useLanguage } from '../../context/LanguageContext'

type MediaTab = 'images' | 'videos' | 'documents'

const getVideos = (property: Property): string[] => {
  const vids = (property.videos ?? property.propertyVideos ?? []) as PropertyMedia[]
  return vids.map((v) => (typeof v === 'string' ? v : v?.video_url ?? v?.url ?? '')).filter(Boolean)
}

const getDocs = (property: Property): { name: string; url: string }[] => {
  const docs = (property.documents ?? property.propertyDocs ?? []) as PropertyMedia[]
  return docs
    .map((d) => {
      const url = typeof d === 'string' ? d : d?.doc_url ?? d?.url ?? ''
      const name = typeof d === 'string' ? 'Document' : d?.doc_name ?? 'Document'
      return url ? { name, url } : null
    })
    .filter(Boolean) as { name: string; url: string }[]
}

export function PropertyGallery({ property }: { property: Property }) {
  const { language } = useLanguage()
  const isNp = language === 'np'

  const images = getPropertyImages(property)
  const imageUrls = images.map(getMediaUrl).filter((u): u is string => Boolean(u))
  const videoUrls = getVideos(property)
  const docs = getDocs(property)

  const hasImages = imageUrls.length > 0
  const hasVideos = videoUrls.length > 0
  const hasDocs = docs.length > 0

  const defaultTab: MediaTab = hasImages ? 'images' : hasVideos ? 'videos' : 'documents'
  const [activeTab, setActiveTab] = useState<MediaTab>(defaultTab)
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Keyboard navigation for lightbox
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (!lightboxOpen) return
    if (e.key === 'Escape') setLightboxOpen(false)
    if (e.key === 'ArrowRight') setLightboxIndex((i) => Math.min(i + 1, imageUrls.length - 1))
    if (e.key === 'ArrowLeft') setLightboxIndex((i) => Math.max(i - 1, 0))
  }, [lightboxOpen, imageUrls.length])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [handleKey])

  // Lock body scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen])

  if (!hasImages && !hasVideos && !hasDocs) {
    return (
      <div className="property-gallery__empty d-flex align-items-center justify-content-center bg-light rounded-4 text-muted" style={{ height: '320px' }}>
        {isNp ? 'कुनै मिडिया उपलब्ध छैन' : 'No media available'}
      </div>
    )
  }

  const tabCount = [hasImages, hasVideos, hasDocs].filter(Boolean).length

  return (
    <div className="property-gallery">

      {/* ── Media Type Tabs (only show if more than one type) ── */}
      {tabCount > 1 && (
        <div className="d-flex gap-2 mb-3">
          {hasImages && (
            <button
              type="button"
              onClick={() => { setActiveTab('images'); setActiveIndex(0) }}
              className={`btn btn-sm ${activeTab === 'images' ? 'btn-primary' : 'btn-outline-secondary'}`}
            >
              🖼 {isNp ? `तस्वीर (${imageUrls.length})` : `Photos (${imageUrls.length})`}
            </button>
          )}
          {hasVideos && (
            <button
              type="button"
              onClick={() => { setActiveTab('videos'); setActiveIndex(0) }}
              className={`btn btn-sm ${activeTab === 'videos' ? 'btn-primary' : 'btn-outline-secondary'}`}
            >
              🎬 {isNp ? `भिडियो (${videoUrls.length})` : `Videos (${videoUrls.length})`}
            </button>
          )}
          {hasDocs && (
            <button
              type="button"
              onClick={() => setActiveTab('documents')}
              className={`btn btn-sm ${activeTab === 'documents' ? 'btn-primary' : 'btn-outline-secondary'}`}
            >
              📄 {isNp ? `कागजात (${docs.length})` : `Documents (${docs.length})`}
            </button>
          )}
        </div>
      )}

      {/* ── IMAGES ── */}
      {activeTab === 'images' && hasImages && (
        <div>
          {/* Main image */}
          <div
            className="position-relative overflow-hidden rounded-4 mb-3"
            style={{ cursor: 'zoom-in', background: '#000' }}
            onClick={() => { setLightboxIndex(activeIndex); setLightboxOpen(true) }}
          >
            <img
              src={imageUrls[activeIndex]}
              alt={`${getPropertyTitle(property)} ${activeIndex + 1}`}
              className="w-100 d-block"
              style={{ height: '420px', objectFit: 'cover', transition: 'opacity 0.2s' }}
            />
            {/* Image counter badge */}
            <div
              className="position-absolute bottom-0 end-0 m-3 badge bg-dark bg-opacity-75 px-3 py-2"
              style={{ fontSize: '0.8rem', borderRadius: '20px' }}
            >
              {activeIndex + 1} / {imageUrls.length}
            </div>
            {/* Expand icon */}
            <div className="position-absolute top-0 end-0 m-3 bg-dark bg-opacity-50 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </div>
          </div>

          {/* Thumbnails */}
          {imageUrls.length > 1 && (
            <div className="d-flex gap-2 flex-wrap">
              {imageUrls.map((url, i) => (
                <button
                  key={url + i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className="p-0 border-0 rounded-3 overflow-hidden"
                  style={{
                    width: '80px', height: '60px',
                    outline: i === activeIndex ? '3px solid var(--bs-primary)' : '2px solid transparent',
                    opacity: i === activeIndex ? 1 : 0.65,
                    transition: 'all 0.15s',
                    cursor: 'pointer',
                  }}
                >
                  <img src={url} alt={`thumb-${i}`} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── VIDEOS ── */}
      {activeTab === 'videos' && hasVideos && (
        <div>
          <div className="overflow-hidden rounded-4 mb-3 bg-black">
            <video
              key={videoUrls[activeIndex]}
              controls
              className="w-100 d-block"
              style={{ maxHeight: '420px' }}
            >
              <source src={videoUrls[activeIndex]} />
              {isNp ? 'तपाईंको ब्राउजरले भिडियो सपोर्ट गर्दैन।' : 'Your browser does not support video.'}
            </video>
          </div>
          {videoUrls.length > 1 && (
            <div className="d-flex gap-2 flex-wrap">
              {videoUrls.map((url, i) => (
                <button
                  key={url + i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`btn btn-sm ${i === activeIndex ? 'btn-primary' : 'btn-outline-secondary'}`}
                >
                  🎬 {isNp ? `भिडियो ${i + 1}` : `Video ${i + 1}`}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── DOCUMENTS ── */}
      {activeTab === 'documents' && hasDocs && (
        <div className="rounded-4 border bg-white p-3" style={{ minHeight: '200px' }}>
          <p className="fw-semibold mb-3">{isNp ? 'उपलब्ध कागजातहरू' : 'Available Documents'}</p>
          <div className="d-flex flex-column gap-2">
            {docs.map((doc, i) => (
              <a
                key={i}
                href={doc.url}
                target="_blank"
                rel="noreferrer"
                className="d-flex align-items-center gap-3 p-3 border rounded-3 text-decoration-none text-dark"
                style={{ background: '#f8f9fa', transition: 'background 0.15s' }}
              >
                <span style={{ fontSize: '1.5rem' }}>📄</span>
                <div>
                  <div className="fw-medium">{doc.name}</div>
                  <div className="text-muted small">{isNp ? 'हेर्न वा डाउनलोड गर्न क्लिक गर्नुहोस्' : 'Click to view or download'}</div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="ms-auto text-muted">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── LIGHTBOX ── */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {/* Close */}
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            style={{
              position: 'absolute', top: '16px', right: '20px',
              background: 'none', border: 'none', color: '#fff',
              fontSize: '2rem', cursor: 'pointer', lineHeight: 1, zIndex: 10000,
            }}
          >
            ×
          </button>

          {/* Prev */}
          {lightboxIndex > 0 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => i - 1) }}
              style={{
                position: 'absolute', left: '16px',
                background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
                width: '48px', height: '48px', borderRadius: '50%',
                fontSize: '1.4rem', cursor: 'pointer', zIndex: 10000,
              }}
            >
              ‹
            </button>
          )}

          {/* Image */}
          <img
            src={imageUrls[lightboxIndex]}
            alt={`${getPropertyTitle(property)} ${lightboxIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw', maxHeight: '88vh',
              objectFit: 'contain', borderRadius: '8px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
            }}
          />

          {/* Next */}
          {lightboxIndex < imageUrls.length - 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => i + 1) }}
              style={{
                position: 'absolute', right: '16px',
                background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
                width: '48px', height: '48px', borderRadius: '50%',
                fontSize: '1.4rem', cursor: 'pointer', zIndex: 10000,
              }}
            >
              ›
            </button>
          )}

          {/* Counter */}
          <div style={{
            position: 'absolute', bottom: '20px',
            color: '#fff', fontSize: '0.9rem', opacity: 0.8,
          }}>
            {lightboxIndex + 1} / {imageUrls.length}
          </div>

          {/* Thumbnail strip */}
          {imageUrls.length > 1 && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute', bottom: '50px',
                display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center',
                maxWidth: '90vw',
              }}
            >
              {imageUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`lb-thumb-${i}`}
                  onClick={() => setLightboxIndex(i)}
                  style={{
                    width: '56px', height: '42px', objectFit: 'cover',
                    borderRadius: '4px', cursor: 'pointer',
                    outline: i === lightboxIndex ? '2px solid #fff' : '2px solid transparent',
                    opacity: i === lightboxIndex ? 1 : 0.5,
                    transition: 'all 0.15s',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

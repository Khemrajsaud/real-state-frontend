import { useState } from 'react'
import {
  getMediaUrl,
  getPropertyImages,
  getPropertyTitle,
  type Property,
} from '../../api/properties'

export function PropertyGallery({ property }: { property: Property }) {
  const images = getPropertyImages(property)
  const imageUrls = images
    .map(getMediaUrl)
    .filter((imageUrl): imageUrl is string => Boolean(imageUrl))

  const [activeImageIndex, setActiveImageIndex] = useState(0)

  if (imageUrls.length === 0) {
    return <div className="property-gallery__empty">No property images available</div>
  }

  const activeUrl = imageUrls[activeImageIndex] ?? imageUrls[0]

  return (
    <div className="property-gallery">
      <div className="property-gallery__main-wrap position-relative overflow-hidden rounded-4 mb-3">
        <img
          src={activeUrl}
          alt={getPropertyTitle(property)}
          className="property-gallery__main w-100"
          style={{ transition: 'all 0.3s ease' }}
        />
      </div>
      {imageUrls.length > 1 ? (
        <div className="property-gallery__thumbs d-flex gap-2 flex-wrap">
          {imageUrls.map((imageUrl, index) => (
            <button
              key={imageUrl}
              type="button"
              className={`property-gallery__thumb-btn p-0 border-0 rounded-3 overflow-hidden ${
                index === activeImageIndex ? 'property-gallery__thumb-btn--active' : ''
              }`}
              onClick={() => setActiveImageIndex(index)}
              style={{ width: '80px', height: '60px', opacity: index === activeImageIndex ? 1 : 0.6 }}
            >
              <img
                src={imageUrl}
                alt={`${getPropertyTitle(property)} ${index + 1}`}
                className="w-100 h-100"
                style={{ objectFit: 'cover' }}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

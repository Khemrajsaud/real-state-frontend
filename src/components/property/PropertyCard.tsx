import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import {
  formatShortPrice,
  getMediaUrl,
  getPropertyId,
  getPropertyImages,
  type Property,
} from '../../api/properties'
import { FavoriteButton } from './FavoriteButton'
import { useLanguage } from '../../context/LanguageContext'
import {
  translateCategory,
  translateStatus,
  translatePropertyTitle,
  translateAddress,
  translateAmenity,
} from '../../utils/translateHelpers'

export function PropertyCard({ property }: { property: Property }) {
  const { language } = useLanguage()
  const isNp = language === 'np'
  const propertyId = getPropertyId(property)
  const images = getPropertyImages(property)
  const coverImage = getMediaUrl(images[0])
  
  const categoryName = translateCategory(
    typeof property.category === 'object' ? property.category?._id : String(property.category ?? ''),
    language
  )
  const statusName = translateStatus(
    typeof property.status === 'object' ? property.status?._id : String(property.status ?? ''),
    language
  )
  const statusId = typeof property.status === 'object' && property.status !== null
    ? property.status._id ?? ''
    : String(property.status ?? '')
  
  const title = translatePropertyTitle(property.title ?? '', language)
  const address = translateAddress(property.address, language)

  // Dynamic features (Area & Road size)
  const area = (property.area as string) || ''
  const roadSize = (property.roadSize as string) || ''

  // Agency info fallback
  const agencyName = (property.agencyName as string) || (isNp ? 'भूमिराज रियल इस्टेट' : 'Bhumiraj Real Estate')
  const agencyCount = (property.agencyPropertiesCount as number) || 12

  // Ribbon determination
  const isFeatured = Boolean(property.isFeatured)
  const isHot = Boolean(property.isHot)

  return (
    <Card className="property-card h-100 overflow-hidden border-0 bg-white">
      <div className="position-relative">
        <Link
          to={propertyId ? `/properties/${propertyId}` : '#'}
          className="property-card__image-link d-block position-relative overflow-hidden"
          aria-label={`View ${title}`}
        >
          {coverImage ? (
            <Card.Img
              src={coverImage}
              alt={title}
              className="property-card__image"
              loading="lazy"
            />
          ) : (
            <div className="property-card__placeholder">{isNp ? 'तस्वीर उपलब्ध छैन' : 'No image available'}</div>
          )}

          {/* Corner Ribbon */}
          {isFeatured && (
            <div className="property-card__ribbon property-card__ribbon--featured" title={isNp ? 'विशेष' : 'Featured'}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="property-card__ribbon-icon">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          )}
          {!isFeatured && isHot && (
            <div className="property-card__ribbon property-card__ribbon--hot" title={isNp ? 'लोकप्रिय' : 'Hot'}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="property-card__ribbon-icon">
                <path d="M17.557 8.417c-.314-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4.417 9 .917 8 .417c-.014.2-.236 1.7-.5 3-.75.75-2.25 2-2.25 4 0 1.152.6 1.86 1.5 2.5-.5 1-1.5 1.5-1.5 3 0 1.956 1.5 3.5 3.5 3.5m0-1c-1.52 0-2.5-1.127-2.5-2.5 0-1 .5-1.5 1-2.5.5.917 1 1.417 1.5 1.917.176-.176.3-.376.5-.5.1.1.2.2.3.4.5.8.5 1.8.5 2.6 0 1.373-1.02 2-2.3 2" />
              </svg>
            </div>
          )}

          {/* Status Badge (Top-Right) */}
          {statusName && (
            <span className={`property-card__status-badge property-card__status-badge--${statusId.includes('rent') ? 'rent' : 'sale'}`}>
              {statusName}
            </span>
          )}

          {/* Price Badge (Bottom-Left) */}
          <span className="property-card__price-badge">
            {formatShortPrice(property.price, isNp)}
          </span>
        </Link>

        {/* Favorite Button (Floating Top-Right below Status Badge) */}
        <div className="property-card__fav-wrapper">
          <FavoriteButton property={property} minimal={true} />
        </div>
      </div>

      <Card.Body className="p-3 d-flex flex-column">
        {/* Category */}
        {categoryName && (
          <span className="property-card__category-label">
            {categoryName}
          </span>
        )}

        {/* Title */}
        <Card.Title className="property-card__title h6 mb-2">
          <Link
            to={propertyId ? `/properties/${propertyId}` : '#'}
            className="text-decoration-none text-dark hover-text-primary"
          >
            {title}
          </Link>
        </Card.Title>

        {/* Address */}
        <div className="property-card__location d-flex align-items-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="property-card__location-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-truncate">{address}</span>
        </div>

        {/* Features Row */}
        <div className="property-card__features-row d-flex align-items-center gap-3 mb-3">
          {area ? (
            <div className="property-card__feature-item d-flex align-items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="property-card__feature-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>{area}</span>
            </div>
          ) : null}

          {roadSize ? (
            <div className="property-card__feature-item d-flex align-items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="property-card__feature-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v10M16 7v10M12 7v10" strokeDasharray="2 2" />
              </svg>
              <span>{roadSize}</span>
            </div>
          ) : null}

          {!area && !roadSize && property.amenities && property.amenities.length > 0 ? (
            <div className="property-card__feature-item d-flex align-items-center gap-1">
              <span className="badge bg-light text-secondary">
                {translateAmenity(
                  typeof property.amenities[0] === 'string'
                    ? property.amenities[0]
                    : property.amenities[0].name ?? property.amenities[0].title ?? '',
                  language
                )}
              </span>
            </div>
          ) : null}
        </div>

        {/* Divider */}
        <hr className="property-card__divider mt-auto mb-3" />

        {/* Footer info: Agency logo & name + View Details */}
        <div className="property-card__footer d-flex align-items-center justify-content-between">
          <div className="property-card__agency d-flex align-items-center gap-2">
            <div className="property-card__agency-avatar">
              {agencyName.charAt(0)}
            </div>
            <div className="property-card__agency-info">
              <div className="property-card__agency-name">{agencyName}</div>
              <Link to="/properties" className="property-card__agency-link">
                {agencyCount} {isNp ? 'सम्पत्तिहरू' : 'Properties'}
              </Link>
            </div>
          </div>
          <Link
            to={propertyId ? `/properties/${propertyId}` : '#'}
            className="property-card__view-btn fw-bold text-decoration-none"
          >
            {isNp ? 'विवरण हेर्नुहोस्' : 'View Details'}
          </Link>
        </div>
      </Card.Body>
    </Card>
  )
}

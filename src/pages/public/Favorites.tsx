import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Col, Container, Row, Button, Card } from 'react-bootstrap'
import { Link, Navigate } from 'react-router-dom'
import { getFavoriteProperty, getFavorites, toggleFavorite } from '../../api/favorites'
import { getPropertyId, getPropertyImages, getMediaUrl, formatShortPrice, getPropertyCategoryName, getPropertyStatusName, type Property } from '../../api/properties'
import { EmptyState } from '../../components/common/EmptyState'
import { ErrorState } from '../../components/common/ErrorState'
import { Loader } from '../../components/common/Loader'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../context/LanguageContext'

const isProperty = (p: Property | null): p is Property => Boolean(p)

function FavoriteCard({ property, userId }: { property: Property; userId: string | number }) {
  const { t, language } = useLanguage()
  const isNp = language === 'np'
  const queryClient = useQueryClient()
  const propertyId = getPropertyId(property)
  const images = getPropertyImages(property)
  const coverImage = getMediaUrl(images[0])
  const category = getPropertyCategoryName(property)
  const status = getPropertyStatusName(property)

  const removeMutation = useMutation({
    mutationFn: () => toggleFavorite({ userId, propertyId: propertyId ?? '' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites', userId] }),
  })

  return (
    <Card className="h-100 border-0 shadow-sm overflow-hidden">
      <div className="position-relative">
        {coverImage ? (
          <img src={coverImage} alt={property.title as string} className="w-100" style={{ height: '200px', objectFit: 'cover' }} />
        ) : (
          <div className="bg-light d-flex align-items-center justify-content-center text-muted" style={{ height: '200px' }}>
            {isNp ? 'तस्वीर छैन' : 'No image'}
          </div>
        )}
        {status && <span className="position-absolute top-0 end-0 m-2 badge bg-success">{status}</span>}
      </div>
      <Card.Body className="p-3 d-flex flex-column">
        {category && <span className="text-primary small fw-semibold mb-1">{category}</span>}
        <h6 className="fw-bold mb-1">
          <Link to={`/properties/${propertyId}`} className="text-dark text-decoration-none">
            {property.title as string}
          </Link>
        </h6>
        <p className="text-muted small mb-2">📍 {property.address as string}</p>
        <div className="fw-bold text-primary mb-3">{formatShortPrice(property.price, isNp)}</div>
        <div className="mt-auto d-flex gap-2">
          <Link to={`/properties/${propertyId}`} className="btn btn-sm btn-primary flex-grow-1">
            {t('favViewDetails')}
          </Link>
          <Button
            size="sm"
            variant="outline-danger"
            disabled={removeMutation.isPending}
            onClick={() => removeMutation.mutate()}
            title={isNp ? 'मनपर्नेबाट हटाउनुहोस्' : 'Remove from favorites'}
          >
            {removeMutation.isPending ? (
              <span className="spinner-border spinner-border-sm" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ef4444" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export function Favorites() {
  const { user, isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const userId = user?.id ?? user?._id

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: { pathname: '/favorites' } }} />
  }

  const { data: favorites = [], isLoading, isError, error } = useQuery({
    queryKey: ['favorites', userId],
    queryFn: () => getFavorites(userId ?? ''),
    enabled: Boolean(userId),
  })

  const favoriteProperties = favorites.map(getFavoriteProperty).filter(isProperty)

  return (
    <main>
      <Container className="py-5">
        <p className="eyebrow text-primary">{t('favEyebrow')}</p>
        <h1 className="display-6 fw-bold mb-1">{t('favTitle')}</h1>
        <p className="text-muted mb-4">
          {t('favSubtitle')}
          {favoriteProperties.length > 0 && (
            <span className="ms-2 badge bg-primary">{favoriteProperties.length} {t('favProperties')}</span>
          )}
        </p>

        {isLoading && <Loader label={t('favLoading')} />}
        {isError && (
          <ErrorState
            title={t('favError')}
            message={error instanceof Error ? error.message : undefined}
          />
        )}
        {!isLoading && !isError && favoriteProperties.length === 0 && (
          <EmptyState title={t('favEmpty')} message={t('favEmptyMsg')} />
        )}
        {!isLoading && !isError && favoriteProperties.length > 0 && (
          <Row xs={1} md={2} lg={3} className="g-4">
            {favoriteProperties.map((property) => (
              <Col key={String(property._id ?? property.id ?? property.title)}>
                <FavoriteCard property={property} userId={userId ?? ''} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </main>
  )
}

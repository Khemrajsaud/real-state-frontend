import { useQuery } from '@tanstack/react-query'
import { Col, Container, Row } from 'react-bootstrap'
import { getFavoriteProperty, getFavorites } from '../../api/favorites'
import { EmptyState } from '../../components/common/EmptyState'
import { ErrorState } from '../../components/common/ErrorState'
import { Loader } from '../../components/common/Loader'
import { PropertyCard } from '../../components/property/PropertyCard'
import { useAuth } from '../../hooks/useAuth'
import type { Property } from '../../api/properties'

const isProperty = (property: Property | null): property is Property => Boolean(property)

export function Favorites() {
  const { user } = useAuth()
  const userId = user?._id ?? user?.id
  const {
    data: favorites = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['favorites', userId],
    queryFn: () => getFavorites(userId ?? ''),
    enabled: Boolean(userId),
  })
  const favoriteProperties = favorites.map(getFavoriteProperty).filter(isProperty)

  return (
    <main>
      <Container className="py-5">
        <p className="eyebrow text-primary">Saved properties</p>
        <h1 className="display-6 fw-bold">Your favorites</h1>
        <p className="mb-4 text-muted">Properties you saved while browsing.</p>
        {isLoading ? <Loader label="Loading favorites..." /> : null}
        {isError ? (
          <ErrorState
            title="Could not load favorites"
            message={error instanceof Error ? error.message : undefined}
          />
        ) : null}
        {!isLoading && !isError && favoriteProperties.length === 0 ? (
          <EmptyState
            title="No favorites yet"
            message="Browse properties and save the ones you like."
          />
        ) : null}
        {!isLoading && !isError && favoriteProperties.length > 0 ? (
          <Row xs={1} md={2} lg={3} className="g-4">
            {favoriteProperties.map((property) => (
              <Col key={String(property._id ?? property.id ?? property.title)}>
                <PropertyCard property={property} />
              </Col>
            ))}
          </Row>
        ) : null}
      </Container>
    </main>
  )
}

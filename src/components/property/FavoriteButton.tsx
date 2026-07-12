import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useLocation } from 'react-router-dom'
import { getFavorites, getFavoriteProperty, toggleFavorite } from '../../api/favorites'
import { getPropertyId, type Property } from '../../api/properties'
import { useAuth } from '../../hooks/useAuth'

const getUserId = (user: ReturnType<typeof useAuth>['user']) => user?._id ?? user?.id
const isProperty = (property: Property | null): property is Property => Boolean(property)

interface FavoriteButtonProps {
  property: Property
  minimal?: boolean
}

export function FavoriteButton({ property, minimal = false }: FavoriteButtonProps) {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()
  const userId = getUserId(user)
  const propertyId = getPropertyId(property)
  const queryClient = useQueryClient()

  const favoritesQuery = useQuery({
    queryKey: ['favorites', userId],
    queryFn: () => getFavorites(userId ?? ''),
    enabled: Boolean(isAuthenticated && userId),
  })

  const favoritePropertyIds = new Set(
    (favoritesQuery.data ?? [])
      .map((favorite) => getFavoriteProperty(favorite))
      .filter(isProperty)
      .map((favoriteProperty) => String(getPropertyId(favoriteProperty))),
  )
  const isFavorite = propertyId ? favoritePropertyIds.has(String(propertyId)) : false

  const favoriteMutation = useMutation({
    mutationFn: () =>
      toggleFavorite({
        userId: userId ?? '',
        propertyId: propertyId ?? '',
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['favorites', userId] })
    },
  })

  const heartIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill={isFavorite ? "#ef4444" : "none"} viewBox="0 0 24 24" stroke={isFavorite ? "#ef4444" : "currentColor"} strokeWidth="2" style={{ width: '1.2rem', height: '1.2rem' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  )

  if (minimal) {
    if (!isAuthenticated) {
      return (
        <Link to="/login" state={{ from: location }} className="btn-favorite btn-favorite--minimal" aria-label="Sign in to save">
          {heartIcon}
        </Link>
      )
    }

    return (
      <button
        type="button"
        className={`btn-favorite btn-favorite--minimal ${isFavorite ? 'btn-favorite--active' : ''}`}
        disabled={!userId || !propertyId || favoriteMutation.isPending}
        onClick={() => favoriteMutation.mutate()}
        aria-label={isFavorite ? "Remove from saved" : "Save property"}
      >
        {heartIcon}
      </button>
    )
  }

  if (!isAuthenticated) {
    return (
      <Link to="/login" state={{ from: location }} className="btn btn-outline-primary">
        Sign in to save
      </Link>
    )
  }

  return (
    <button
      type="button"
      className={`btn ${isFavorite ? 'btn-primary' : 'btn-outline-primary'}`}
      disabled={!userId || !propertyId || favoriteMutation.isPending}
      onClick={() => favoriteMutation.mutate()}
    >
      {favoriteMutation.isPending
        ? 'Saving...'
        : isFavorite
          ? 'Saved'
          : 'Save property'}
    </button>
  )
}

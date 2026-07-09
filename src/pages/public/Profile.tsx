import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import {
  getProfile,
  updateProfileAvatar,
  updateProfileText,
  deleteProfile,
  type ProfileTextPayload,
} from '../../api/profile'
import { ErrorState } from '../../components/common/ErrorState'
import { Loader } from '../../components/common/Loader'
import { useAuth } from '../../hooks/useAuth'

const getAvatarUrl = (profile?: Record<string, unknown> | null) => {
  if (!profile) {
    return null
  }

  return (
    String(profile.avatarUrl ?? '') ||
    String(profile.avatar ?? '') ||
    String(profile.image ?? '') ||
    null
  )
}

export function Profile() {
  const { user, logout } = useAuth()
  const userId = user?._id ?? user?.id
  const queryClient = useQueryClient()
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileTextPayload>()

  const profileQuery = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getProfile(userId ?? ''),
    enabled: Boolean(userId),
  })

  useEffect(() => {
    if (profileQuery.data) {
      reset({
        name: String(profileQuery.data.name ?? ''),
        phone: String(profileQuery.data.phone ?? ''),
        dob: String(profileQuery.data.dob ?? ''),
      })
    }
  }, [profileQuery.data, reset])

  const textMutation = useMutation({
    mutationFn: (payload: ProfileTextPayload) => updateProfileText(userId ?? '', payload),
    onSuccess: async () => {
      setStatusMessage('Profile updated.')
      await queryClient.invalidateQueries({ queryKey: ['profile', userId] })
    },
  })

  const avatarMutation = useMutation({
    mutationFn: (avatar: File) => updateProfileAvatar(userId ?? '', avatar),
    onSuccess: async () => {
      setStatusMessage('Avatar updated.')
      await queryClient.invalidateQueries({ queryKey: ['profile', userId] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteProfile(userId ?? ''),
    onSuccess: () => {
      setShowDeleteConfirm(false)
      logout()
    },
  })

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const avatar = event.target.files?.[0]

    if (avatar) {
      setStatusMessage(null)
      avatarMutation.mutate(avatar)
    }
  }

  const onSubmit = async (payload: ProfileTextPayload) => {
    setStatusMessage(null)
    await textMutation.mutateAsync(payload)
  }

  if (profileQuery.isLoading) {
    return (
      <Container className="py-5">
        <Loader label="Loading profile..." />
      </Container>
    )
  }

  if (profileQuery.isError) {
    return (
      <Container className="py-5">
        <ErrorState title="Could not load profile" />
      </Container>
    )
  }

  const avatarUrl = getAvatarUrl(profileQuery.data)

  return (
    <main>
      <Container className="py-5">
        <p className="eyebrow text-primary">Profile</p>
        <h1 className="display-6 fw-bold">Your account</h1>
        <Row className="g-4">
          <Col lg={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4 text-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile avatar" className="profile-avatar" />
                ) : (
                  <div className="profile-avatar profile-avatar--empty">
                    {profileQuery.data?.name?.charAt(0) ?? 'U'}
                  </div>
                )}
                <h2 className="h5 mt-3 mb-1">{profileQuery.data?.name ?? 'User'}</h2>
                <p className="text-muted">{profileQuery.data?.email}</p>
                <Form.Group controlId="profile-avatar">
                  <Form.Label className="btn btn-outline-primary mb-0">
                    {avatarMutation.isPending ? 'Uploading...' : 'Change avatar'}
                  </Form.Label>
                  <Form.Control
                    className="visually-hidden"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={avatarMutation.isPending}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4 p-md-5">
                {statusMessage ? <Alert variant="success">{statusMessage}</Alert> : null}
                {textMutation.isError ? (
                  <Alert variant="danger">
                    {textMutation.error instanceof Error
                      ? textMutation.error.message
                      : 'Profile update failed.'}
                  </Alert>
                ) : null}
                {avatarMutation.isError ? (
                  <Alert variant="danger">
                    {avatarMutation.error instanceof Error
                      ? avatarMutation.error.message
                      : 'Avatar update failed.'}
                  </Alert>
                ) : null}
                <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <Form.Group className="mb-3" controlId="profile-name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      isInvalid={Boolean(errors.name)}
                      {...register('name', { required: 'Name is required.' })}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="profile-phone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      isInvalid={Boolean(errors.phone)}
                      {...register('phone', { required: 'Phone is required.' })}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phone?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-4" controlId="profile-dob">
                    <Form.Label>Date of birth</Form.Label>
                    <Form.Control type="date" {...register('dob')} />
                  </Form.Group>
                  <Button type="submit" disabled={isSubmitting || textMutation.isPending}>
                    {textMutation.isPending ? 'Saving...' : 'Save changes'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="border-0 shadow-sm mt-5 border-start border-danger border-4">
          <Card.Body className="p-4">
            <h3 className="h6 fw-bold text-danger mb-2">Danger Zone</h3>
            <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
              Deleting your account is permanent and cannot be undone. All your data, favorites, and profile information will be removed.
            </p>
            {deleteMutation.isError ? (
              <Alert variant="danger" className="mb-3">
                {deleteMutation.error instanceof Error ? deleteMutation.error.message : 'Account deletion failed.'}
              </Alert>
            ) : null}
            {!showDeleteConfirm ? (
              <Button variant="outline-danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                Delete my account
              </Button>
            ) : (
              <div className="d-flex align-items-center gap-3 p-3 bg-danger bg-opacity-10 rounded-3">
                <span className="text-danger fw-bold" style={{ fontSize: '0.9rem' }}>Are you sure?</span>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate()}
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Yes, delete permanently'}
                </Button>
                <Button variant="outline-secondary" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </main>
  )
}

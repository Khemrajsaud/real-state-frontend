import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { Alert, Badge, Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import {
  getAdminProperties,
  getPropertyMeta,
  createProperty,
  deleteProperty,
  formatNprPrice,
  getPropertyId,
  getPropertyTitle,
  getPropertyCategoryName,
  getPropertyStatusName,
  getPropertyAmenityNames,
  updateProperty,
  type Property,
  type PropertyMeta,
  type PropertyFormPayload,
} from '../../api/properties'
import { ErrorState } from '../../components/common/ErrorState'
import { Loader } from '../../components/common/Loader'

const emptyPropertyForm: PropertyFormPayload = {
  title: '',
  description: '',
  price: '',
  address: '',
  categoryId: '',
  statusId: '',
  locationLink: '',
  amenityIds: [],
}

const getPropertyAmenityIds = (property: Property): string[] => {
  const relations = property.property_amenities
  if (!Array.isArray(relations)) return []
  return relations
    .map((r) => r.amenityId ?? (typeof r.amenity === 'object' ? r.amenity?._id ?? r.amenity?.id : null))
    .filter(Boolean)
    .map((id) => String(id))
}

const getExistingImages = (property: Property): string[] => {
  const imgs = property.images ?? property.propertyImages ?? []
  return (imgs as any[])
    .map((img) => (typeof img === 'string' ? img : img?.image_url ?? img?.url ?? img?.secure_url ?? null))
    .filter(Boolean)
}

const getExistingVideos = (property: Property): string[] => {
  const vids = property.videos ?? property.propertyVideos ?? []
  return (vids as any[])
    .map((v) => (typeof v === 'string' ? v : v?.video_url ?? v?.url ?? null))
    .filter(Boolean)
}

const getExistingDocs = (property: Property): { name: string; url: string }[] => {
  const docs = property.documents ?? property.propertyDocs ?? []
  return (docs as any[])
    .map((d) => {
      const url = typeof d === 'string' ? d : d?.doc_url ?? d?.url ?? null
      const name = typeof d === 'string' ? 'Document' : d?.doc_name ?? 'Document'
      return url ? { name, url } : null
    })
    .filter(Boolean) as { name: string; url: string }[]
}

const statusVariant = (name?: string | null) => {
  if (!name) return 'secondary'
  if (name === 'Available') return 'success'
  if (name === 'Sold') return 'danger'
  return 'warning'
}

export function PropertiesManage() {
  const queryClient = useQueryClient()
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const imageInputRef = useRef<HTMLInputElement | null>(null)

  const { data: meta, isLoading: isMetaLoading } = useQuery<PropertyMeta>({
    queryKey: ['admin', 'property-meta'],
    queryFn: getPropertyMeta,
  })

  const { data = [], isLoading, isError } = useQuery({
    queryKey: ['admin', 'properties'],
    queryFn: getAdminProperties,
  })

  const { register, handleSubmit, reset, watch } = useForm<PropertyFormPayload>({
    defaultValues: emptyPropertyForm,
  })

  const watchedImages = watch('propertyImages')

  useEffect(() => {
    if (!watchedImages || watchedImages.length === 0) {
      setImagePreviewUrls([])
      return
    }
    const urls = Array.from(watchedImages).map((file) => URL.createObjectURL(file))
    setImagePreviewUrls(urls)
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [watchedImages])

  useEffect(() => {
    setImagePreviewUrls([])
    if (!editingProperty) {
      reset({
        ...emptyPropertyForm,
        categoryId: String(meta?.categories?.[0]?.id ?? ''),
        statusId: String(meta?.statuses?.[0]?.id ?? ''),
        amenityIds: [],
      })
      return
    }
    reset({
      ...emptyPropertyForm,
      title: editingProperty.title ?? '',
      description: editingProperty.description ?? '',
      price: String(editingProperty.price ?? ''),
      address: editingProperty.address ?? '',
      categoryId:
        typeof editingProperty.category === 'object'
          ? String(editingProperty.category._id ?? editingProperty.category.id ?? '')
          : String(meta?.categories?.[0]?.id ?? ''),
      statusId:
        typeof editingProperty.status === 'object'
          ? String(editingProperty.status._id ?? editingProperty.status.id ?? '')
          : String(meta?.statuses?.[0]?.id ?? ''),
      locationLink: editingProperty.locationLink ?? '',
      amenityIds: getPropertyAmenityIds(editingProperty),
    })
  }, [editingProperty, meta, reset])

  const saveMutation = useMutation({
    mutationFn: (payload: PropertyFormPayload) => {
      const propertyId = editingProperty ? getPropertyId(editingProperty) : null
      return propertyId ? updateProperty(propertyId, payload) : createProperty(payload)
    },
    onSuccess: async () => {
      setMessage(editingProperty ? 'Property updated successfully.' : 'Property created successfully.')
      setEditingProperty(null)
      setImagePreviewUrls([])
      await queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] })
      await queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProperty,
    onSuccess: async () => {
      setMessage('Property deleted successfully.')
      setDeleteTarget(null)
      await queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] })
      await queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
  })

  const onSubmit = (payload: PropertyFormPayload) => saveMutation.mutate(payload)

  const handleCancelEdit = () => {
    setEditingProperty(null)
    setImagePreviewUrls([])
  }

  const existingImages = editingProperty ? getExistingImages(editingProperty) : []
  const existingVideos = editingProperty ? getExistingVideos(editingProperty) : []
  const existingDocs = editingProperty ? getExistingDocs(editingProperty) : []

  return (
    <section>
      <p className="eyebrow text-primary">Admin</p>
      <h1 className="h2 fw-bold mb-4">Manage Properties</h1>

      {message && (
        <Alert variant="success" dismissible onClose={() => setMessage(null)}>
          {message}
        </Alert>
      )}
      {saveMutation.isError && (
        <Alert variant="danger" dismissible onClose={() => saveMutation.reset()}>
          {(saveMutation.error as Error)?.message ?? 'Save failed. Please try again.'}
        </Alert>
      )}
      {deleteMutation.isError && (
        <Alert variant="danger" dismissible onClose={() => deleteMutation.reset()}>
          Delete failed. Please try again.
        </Alert>
      )}

      {/* ── Form Card ── */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-white border-bottom py-3">
          <h5 className="mb-0 fw-semibold">
            {editingProperty ? `Editing: ${getPropertyTitle(editingProperty)}` : 'Add New Property'}
          </h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="g-3">

              {/* Title */}
              <Col md={6}>
                <Form.Label className="fw-medium">Title <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  placeholder="e.g. 3BHK House in Baneshwor"
                  {...register('title', { required: true })}
                />
              </Col>

              {/* Price */}
              <Col md={3}>
                <Form.Label className="fw-medium">Price (Rs.) <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 8500000"
                  {...register('price', { required: true })}
                />
              </Col>

              {/* Address */}
              <Col md={3}>
                <Form.Label className="fw-medium">Address <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  placeholder="e.g. New Baneshwor, Kathmandu"
                  {...register('address', { required: true })}
                />
              </Col>

              {/* Category */}
              <Col md={4}>
                <Form.Label className="fw-medium">Category <span className="text-danger">*</span></Form.Label>
                <Form.Select {...register('categoryId', { required: true })} disabled={isMetaLoading}>
                  <option value="">{isMetaLoading ? 'Loading...' : 'Select category'}</option>
                  {meta?.categories.map((c) => (
                    <option key={c.id} value={String(c.id)}>{c.name}</option>
                  ))}
                </Form.Select>
              </Col>

              {/* Status */}
              <Col md={4}>
                <Form.Label className="fw-medium">Status <span className="text-danger">*</span></Form.Label>
                <Form.Select {...register('statusId', { required: true })} disabled={isMetaLoading}>
                  <option value="">{isMetaLoading ? 'Loading...' : 'Select status'}</option>
                  {meta?.statuses.map((s) => (
                    <option key={s.id} value={String(s.id)}>{s.name}</option>
                  ))}
                </Form.Select>
              </Col>

              {/* Google Maps */}
              <Col md={4}>
                <Form.Label className="fw-medium">Google Maps Link</Form.Label>
                <Form.Control
                  placeholder="https://maps.google.com/..."
                  {...register('locationLink')}
                />
              </Col>

              {/* Amenities */}
              <Col md={12}>
                <Form.Label className="fw-medium">Amenities</Form.Label>
                <div className="d-flex flex-wrap gap-3 p-3 border rounded bg-light">
                  {isMetaLoading ? (
                    <span className="text-muted small">Loading amenities...</span>
                  ) : (
                    meta?.amenities.map((amenity) => (
                      <Form.Check
                        key={amenity.id}
                        type="checkbox"
                        id={`amenity-${amenity.id}`}
                        label={amenity.name}
                        value={String(amenity.id)}
                        {...register('amenityIds')}
                      />
                    ))
                  )}
                </div>
                <Form.Text className="text-muted">Select all that apply.</Form.Text>
              </Col>

              {/* Description */}
              <Col md={12}>
                <Form.Label className="fw-medium">Description <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Describe the property in detail..."
                  {...register('description', { required: true })}
                />
              </Col>

              {/* Images */}
              <Col md={4}>
                <Form.Label className="fw-medium">
                  Images {!editingProperty && <span className="text-danger">*</span>}
                  <span className="text-muted fw-normal"> (max 10)</span>
                </Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  accept="image/*"
                  {...register('propertyImages')}
                  ref={(e) => {
                    register('propertyImages').ref(e)
                    imageInputRef.current = e
                  }}
                />
                {/* New image previews */}
                {imagePreviewUrls.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {imagePreviewUrls.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`preview-${i}`}
                        className="admin-thumb"
                      />
                    ))}
                  </div>
                )}
                {/* Existing images on edit */}
                {editingProperty && existingImages.length > 0 && (
                  <div className="mt-2">
                    <Form.Text className="text-muted d-block mb-1">Current images:</Form.Text>
                    <div className="d-flex flex-wrap gap-2">
                      {existingImages.map((url, i) => (
                        <img key={i} src={url} alt={`existing-${i}`} className="admin-thumb" />
                      ))}
                    </div>
                  </div>
                )}
              </Col>

              {/* Videos */}
              <Col md={4}>
                <Form.Label className="fw-medium">
                  Videos
                  <span className="text-muted fw-normal"> (max 2)</span>
                </Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  accept="video/*"
                  {...register('propertyVideos')}
                />
                {editingProperty && existingVideos.length > 0 && (
                  <div className="mt-2">
                    <Form.Text className="text-muted d-block mb-1">Current videos ({existingVideos.length}):</Form.Text>
                    <div className="d-flex flex-column gap-1">
                      {existingVideos.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noreferrer" className="small text-truncate">
                          Video {i + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </Col>

              {/* Documents */}
              <Col md={4}>
                <Form.Label className="fw-medium">
                  Documents
                  <span className="text-muted fw-normal"> (max 5)</span>
                </Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  {...register('propertyDocs')}
                />
                {editingProperty && existingDocs.length > 0 && (
                  <div className="mt-2">
                    <Form.Text className="text-muted d-block mb-1">Current documents:</Form.Text>
                    <div className="d-flex flex-column gap-1">
                      {existingDocs.map((doc, i) => (
                        <a key={i} href={doc.url} target="_blank" rel="noreferrer" className="small text-truncate">
                          📄 {doc.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </Col>

            </Row>

            <div className="mt-4 d-flex gap-2 align-items-center">
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending
                  ? (editingProperty ? 'Updating...' : 'Creating...')
                  : (editingProperty ? 'Update Property' : 'Create Property')}
              </Button>
              {editingProperty && (
                <Button variant="outline-secondary" onClick={handleCancelEdit}>
                  Cancel Edit
                </Button>
              )}
              <span className="text-muted small ms-auto">
                <span className="text-danger">*</span> Required fields
              </span>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* ── Properties Table ── */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-bottom py-3 d-flex align-items-center justify-content-between">
          <h5 className="mb-0 fw-semibold">All Properties</h5>
          <Badge bg="secondary">{data.length} total</Badge>
        </Card.Header>
        <Card.Body className="p-0">
          {isLoading && <div className="p-4"><Loader label="Loading properties..." /></div>}
          {isError && <div className="p-4"><ErrorState title="Could not load properties" /></div>}
          {!isLoading && !isError && data.length === 0 && (
            <div className="p-4 text-center text-muted">No properties yet. Add one above.</div>
          )}
          {!isLoading && !isError && data.length > 0 && (
            <Table responsive hover className="admin-table bg-white mb-0">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Address</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Amenities</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((property) => {
                  const propertyId = getPropertyId(property)
                  const images = getExistingImages(property)
                  const categoryName = getPropertyCategoryName(property)
                  const statusName = getPropertyStatusName(property)
                  const amenityNames = getPropertyAmenityNames(property)

                  return (
                    <tr key={String(propertyId ?? property.title)}>
                      <td>
                        {images[0] ? (
                          <img src={images[0]} alt={getPropertyTitle(property)} className="admin-thumb" />
                        ) : (
                          <div
                            className="admin-thumb d-flex align-items-center justify-content-center bg-light text-muted rounded"
                            style={{ fontSize: '0.7rem' }}
                          >
                            No image
                          </div>
                        )}
                      </td>
                      <td className="fw-medium align-middle">{getPropertyTitle(property)}</td>
                      <td className="align-middle">{formatNprPrice(property.price)}</td>
                      <td className="align-middle text-muted small">{property.address}</td>
                      <td className="align-middle">
                        {categoryName ? (
                          <Badge bg="primary" className="fw-normal">{categoryName}</Badge>
                        ) : '—'}
                      </td>
                      <td className="align-middle">
                        {statusName ? (
                          <Badge bg={statusVariant(statusName)} className="fw-normal">{statusName}</Badge>
                        ) : '—'}
                      </td>
                      <td className="align-middle">
                        <div className="d-flex flex-wrap gap-1">
                          {amenityNames.length > 0
                            ? amenityNames.slice(0, 3).map((name) => (
                                <Badge key={name} bg="light" text="dark" className="border fw-normal small">
                                  {name}
                                </Badge>
                              ))
                            : <span className="text-muted small">—</span>}
                          {amenityNames.length > 3 && (
                            <Badge bg="light" text="dark" className="border fw-normal small">
                              +{amenityNames.length - 3}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="text-end align-middle">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          className="me-1"
                          onClick={() => {
                            setEditingProperty(property)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          disabled={!propertyId}
                          onClick={() => setDeleteTarget(property)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* ── Delete Confirmation Modal ── */}
      <Modal show={!!deleteTarget} onHide={() => setDeleteTarget(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Property</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{' '}
          <strong>{deleteTarget ? getPropertyTitle(deleteTarget) : ''}</strong>?
          <br />
          <span className="text-danger small">
            This will permanently remove the property and all its images, videos, and documents from Cloudinary.
          </span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            disabled={deleteMutation.isPending}
            onClick={() => {
              const id = deleteTarget ? getPropertyId(deleteTarget) : null
              if (id) deleteMutation.mutate(id)
            }}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  )
}

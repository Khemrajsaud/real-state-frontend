import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Alert, Button, Card, Col, Form, Row, Table } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import {
  createProperty,
  deleteProperty,
  formatNprPrice,
  getProperties,
  getPropertyId,
  getPropertyTitle,
  updateProperty,
  type Property,
  type PropertyFormPayload,
} from '../../api/properties'
import { ErrorState } from '../../components/common/ErrorState'
import { Loader } from '../../components/common/Loader'

const emptyPropertyForm: PropertyFormPayload = {
  title: '',
  description: '',
  price: '',
  address: '',
  categoryId: 'cat-house',
  statusId: 'status-sale',
  locationLink: '',
  amenityIds: '',
}

export function PropertiesManage() {
  const queryClient = useQueryClient()
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const { data = [], isLoading, isError } = useQuery({
    queryKey: ['admin', 'properties'],
    queryFn: getProperties,
  })
  const { register, handleSubmit, reset } = useForm<PropertyFormPayload>({
    defaultValues: emptyPropertyForm,
  })

  useEffect(() => {
    if (!editingProperty) {
      reset(emptyPropertyForm)
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
          ? String(editingProperty.category._id ?? emptyPropertyForm.categoryId)
          : emptyPropertyForm.categoryId,
      statusId:
        typeof editingProperty.status === 'object'
          ? String(editingProperty.status._id ?? emptyPropertyForm.statusId)
          : emptyPropertyForm.statusId,
      locationLink: editingProperty.locationLink ?? '',
    })
  }, [editingProperty, reset])

  const saveMutation = useMutation({
    mutationFn: (payload: PropertyFormPayload) => {
      const propertyId = editingProperty ? getPropertyId(editingProperty) : null

      return propertyId
        ? updateProperty(propertyId, payload)
        : createProperty(payload)
    },
    onSuccess: async () => {
      setMessage('Property saved.')
      setEditingProperty(null)
      await queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] })
      await queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProperty,
    onSuccess: async () => {
      setMessage('Property deleted.')
      await queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] })
      await queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
  })

  const onSubmit = (payload: PropertyFormPayload) => saveMutation.mutate(payload)

  return (
    <section>
      <p className="eyebrow text-primary">Admin</p>
      <h1 className="h2 fw-bold mb-4">Manage properties</h1>
      {message ? <Alert variant="success">{message}</Alert> : null}
      {saveMutation.isError ? <Alert variant="danger">Save failed.</Alert> : null}
      {deleteMutation.isError ? <Alert variant="danger">Delete failed.</Alert> : null}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label>Title</Form.Label>
                <Form.Control {...register('title', { required: true })} />
              </Col>
              <Col md={3}>
                <Form.Label>Price</Form.Label>
                <Form.Control {...register('price', { required: true })} />
              </Col>
              <Col md={3}>
                <Form.Label>Address</Form.Label>
                <Form.Control {...register('address', { required: true })} />
              </Col>
              <Col md={6}>
                <Form.Label>Category</Form.Label>
                <Form.Select {...register('categoryId', { required: true })}>
                  <option value="cat-house">House</option>
                  <option value="cat-apartment">Apartment</option>
                  <option value="cat-land">Land</option>
                  <option value="cat-commercial">Commercial</option>
                  <option value="cat-flats">Flats</option>
                  <option value="cat-office">Office Space</option>
                  <option value="cat-shop">Shop Space</option>
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label>Status</Form.Label>
                <Form.Select {...register('statusId', { required: true })}>
                  <option value="status-sale">For Sale</option>
                  <option value="status-rent">For Rent</option>
                  <option value="status-available">Available</option>
                  <option value="status-construction">Under Construction</option>
                  <option value="status-sold">Sold</option>
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label>Google Maps link</Form.Label>
                <Form.Control {...register('locationLink')} />
              </Col>
              <Col md={6}>
                <Form.Label>Amenities</Form.Label>
                <div className="d-flex flex-wrap gap-2 p-2 border rounded bg-light">
                  {[
                    'Parking', 'Water supply', 'Road access', 'Balcony',
                    'Security', 'Market nearby', 'Garden', 'Swimming Pool',
                    'Gym', 'Garage', 'Elevator', 'Clear boundary',
                    'Main road', 'Peaceful area',
                  ].map((amenity) => (
                    <Form.Check
                      key={amenity}
                      type="checkbox"
                      id={`amenity-${amenity}`}
                      label={amenity}
                      value={amenity}
                      {...register('amenityIds')}
                      className="me-2"
                    />
                  ))}
                </div>
                <Form.Text className="text-muted">Select all that apply.</Form.Text>
              </Col>
              <Col md={12}>
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} {...register('description', { required: true })} />
              </Col>
              <Col md={4}>
                <Form.Label>Images</Form.Label>
                <Form.Control type="file" multiple accept="image/*" {...register('propertyImages')} />
              </Col>
              <Col md={4}>
                <Form.Label>Videos</Form.Label>
                <Form.Control type="file" multiple accept="video/*" {...register('propertyVideos')} />
              </Col>
              <Col md={4}>
                <Form.Label>Documents</Form.Label>
                <Form.Control type="file" multiple {...register('propertyDocs')} />
              </Col>
            </Row>
            <div className="mt-3 d-flex gap-2">
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving...' : editingProperty ? 'Update' : 'Create'}
              </Button>
              {editingProperty ? (
                <Button variant="outline-secondary" onClick={() => setEditingProperty(null)}>
                  Cancel edit
                </Button>
              ) : null}
            </div>
          </Form>
        </Card.Body>
      </Card>
      {isLoading ? <Loader label="Loading properties..." /> : null}
      {isError ? <ErrorState title="Could not load properties" /> : null}
      {!isLoading && !isError ? (
        <Table responsive hover className="admin-table bg-white">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Address</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {data.map((property) => {
              const propertyId = getPropertyId(property)

              return (
                <tr key={String(propertyId ?? property.title)}>
                  <td>{getPropertyTitle(property)}</td>
                  <td>{formatNprPrice(property.price)}</td>
                  <td>{property.address}</td>
                  <td className="text-end">
                    <Button size="sm" variant="outline-primary" onClick={() => setEditingProperty(property)}>
                      Edit
                    </Button>{' '}
                    <Button
                      size="sm"
                      variant="outline-danger"
                      disabled={!propertyId || deleteMutation.isPending}
                      onClick={() => propertyId && deleteMutation.mutate(propertyId)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      ) : null}
    </section>
  )
}

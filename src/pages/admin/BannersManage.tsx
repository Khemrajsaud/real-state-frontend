import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Alert, Button, Card, Form, Table } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import {
  createBanner,
  deleteBanner,
  getBannerImage,
  getBanners,
  updateBanner,
  type Banner,
  type BannerFormPayload,
} from '../../api/banners'
import { Loader } from '../../components/common/Loader'

export function BannersManage() {
  const queryClient = useQueryClient()
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const { data = [], isLoading } = useQuery({ queryKey: ['banners'], queryFn: getBanners })
  const { register, handleSubmit, reset } = useForm<BannerFormPayload>()
  const saveMutation = useMutation({
    mutationFn: (payload: BannerFormPayload) => {
      const bannerId = editingBanner?._id ?? editingBanner?.id
      return bannerId ? updateBanner(bannerId, payload) : createBanner(payload)
    },
    onSuccess: async () => {
      setMessage('Banner saved.')
      setEditingBanner(null)
      reset()
      await queryClient.invalidateQueries({ queryKey: ['banners'] })
    },
  })
  const deleteMutation = useMutation({
    mutationFn: deleteBanner,
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: ['banners'] }),
  })

  return (
    <section>
      <p className="eyebrow text-primary">Admin</p>
      <h1 className="h2 fw-bold mb-4">Manage banners</h1>
      {message ? <Alert variant="success">{message}</Alert> : null}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit((payload) => saveMutation.mutate(payload))}>
            <Form.Label>Title</Form.Label>
            <Form.Control className="mb-3" defaultValue={editingBanner?.title} {...register('title')} />
            <Form.Label>Image</Form.Label>
            <Form.Control className="mb-3" type="file" accept="image/*" {...register('bannerImage')} />
            <Button type="submit" disabled={saveMutation.isPending}>
              {editingBanner ? 'Update banner' : 'Create banner'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
      {isLoading ? <Loader /> : null}
      <Table responsive hover className="admin-table bg-white">
        <tbody>
          {data.map((banner) => {
            const bannerId = banner._id ?? banner.id
            return (
              <tr key={String(bannerId ?? banner.title)}>
                <td>{getBannerImage(banner) ? <img className="admin-thumb" src={getBannerImage(banner) ?? ''} alt="" /> : null}</td>
                <td>{banner.title}</td>
                <td className="text-end">
                  <Button size="sm" variant="outline-primary" onClick={() => setEditingBanner(banner)}>Edit</Button>{' '}
                  <Button size="sm" variant="outline-danger" disabled={!bannerId} onClick={() => bannerId && deleteMutation.mutate(bannerId)}>Delete</Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </section>
  )
}

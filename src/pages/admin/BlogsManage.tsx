import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Alert, Button, Card, Col, Form, Row, Table } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import {
  createBlog,
  deleteBlog,
  getBlogs,
  type BlogPost,
  type BlogFormPayload,
} from '../../api/blogs'
import { Loader } from '../../components/common/Loader'

const emptyBlogForm: BlogFormPayload = {
  title: '',
  content: '',
  author: 'Admin',
}

export function BlogsManage() {
  const queryClient = useQueryClient()
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  
  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['admin', 'blogs'],
    queryFn: getBlogs,
  })

  const { register, handleSubmit, reset } = useForm<BlogFormPayload>({
    defaultValues: emptyBlogForm,
  })

  useEffect(() => {
    reset(
      editingBlog
        ? {
            title: editingBlog.title ?? '',
            content: editingBlog.content ?? '',
            author: editingBlog.author ?? 'Admin',
          }
        : emptyBlogForm,
    )
  }, [editingBlog, reset])

  const saveMutation = useMutation({
    mutationFn: (payload: BlogFormPayload) => {
      return createBlog(payload)
    },
    onSuccess: async () => {
      setMessage('Blog article published successfully.')
      setEditingBlog(null)
      await queryClient.invalidateQueries({ queryKey: ['admin', 'blogs'] })
      await queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => deleteBlog(id),
    onSuccess: async () => {
      setMessage('Blog article deleted.')
      await queryClient.invalidateQueries({ queryKey: ['admin', 'blogs'] })
      await queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const onSubmit = (payload: BlogFormPayload) => {
    saveMutation.mutate(payload)
  }

  return (
    <section>
      <p className="eyebrow text-primary">Admin</p>
      <h1 className="h2 fw-bold mb-4">Manage Blogs</h1>
      
      {message ? <Alert variant="success" onClose={() => setMessage(null)} dismissible>{message}</Alert> : null}
      {saveMutation.isError ? <Alert variant="danger">Failed to save blog post.</Alert> : null}
      {deleteMutation.isError ? <Alert variant="danger">Failed to delete blog post.</Alert> : null}

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="g-3">
              <Col md={8}>
                <Form.Label>Title</Form.Label>
                <Form.Control {...register('title', { required: true })} placeholder="Enter article title" />
              </Col>
              <Col md={4}>
                <Form.Label>Author</Form.Label>
                <Form.Control {...register('author')} placeholder="Admin" />
              </Col>
              <Col md={12}>
                <Form.Label>Cover Image</Form.Label>
                <Form.Control type="file" accept="image/*" {...register('coverImage')} />
                <Form.Text className="text-muted">
                  Choose a beautiful cover photo for the article feed banner.
                </Form.Text>
              </Col>
              <Col md={12}>
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  {...register('content', { required: true })}
                  placeholder="Write your article content here..."
                />
              </Col>
            </Row>
            <div className="mt-3 d-flex gap-2">
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Publishing...' : 'Publish Blog Post'}
              </Button>
              {editingBlog ? (
                <Button variant="outline-secondary" onClick={() => setEditingBlog(null)}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </Form>
        </Card.Body>
      </Card>

      {isLoading ? <Loader label="Loading articles..." /> : null}

      {!isLoading && blogs.length === 0 ? (
        <Alert variant="info">No blog posts found. Publish your first article above!</Alert>
      ) : null}

      {!isLoading && blogs.length > 0 ? (
        <Table responsive hover className="admin-table bg-white">
          <thead>
            <tr>
              <th>Cover</th>
              <th>Title</th>
              <th>Author</th>
              <th>Date</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => {
              const blogId = blog._id ?? blog.id
              return (
                <tr key={String(blogId ?? blog.title)}>
                  <td>
                    {blog.coverImage ? (
                      <img
                        src={blog.coverImage}
                        alt=""
                        style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : (
                      <span className="text-muted" style={{ fontSize: '0.8rem' }}>No image</span>
                    )}
                  </td>
                  <td className="fw-semibold text-dark">{blog.title}</td>
                  <td>{blog.author}</td>
                  <td>
                    {blog.createdAt
                      ? new Date(blog.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </td>
                  <td className="text-end">
                    <Button
                      size="sm"
                      variant="outline-danger"
                      disabled={!blogId || deleteMutation.isPending}
                      onClick={() => {
                        if (blogId && confirm('Are you sure you want to delete this blog post?')) {
                          deleteMutation.mutate(blogId)
                        }
                      }}
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

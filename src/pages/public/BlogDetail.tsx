import { useQuery } from '@tanstack/react-query'
import { Container, Row, Col } from 'react-bootstrap'
import { useParams, Link } from 'react-router-dom'
import { getBlogBySlug } from '../../api/blogs'
import { Loader } from '../../components/common/Loader'
import { ErrorState } from '../../components/common/ErrorState'
import { useLanguage } from '../../context/LanguageContext'
import { translateBlog } from '../../utils/translateHelpers'

export function BlogDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { language } = useLanguage()
  const isNp = language === 'np'

  const { data: blog, isLoading, isError, error } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => getBlogBySlug(slug ?? ''),
    enabled: Boolean(slug),
  })

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString(isNp ? 'ne-NP' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <Container className="py-5 text-center">
        <Loader label={isNp ? 'लेख लोड हुँदैछ...' : 'Loading article...'} />
      </Container>
    )
  }

  if (isError || !blog) {
    return (
      <Container className="py-5">
        <ErrorState
          title={isNp ? 'लेख फेला परेन' : 'Article not found'}
          message={error instanceof Error ? error.message : undefined}
        />
        <div className="text-center mt-4">
          <Link to="/blogs" className="btn btn-primary">
            {isNp ? 'ब्लगहरूमा फर्कनुहोस्' : 'Back to Blogs'}
          </Link>
        </div>
      </Container>
    )
  }

  const translated = translateBlog(blog, language)

  return (
    <article className="blog-reader-page">
      {/* Article Hero Banner */}
      <section className="blog-reader-hero py-5 text-white">
        <Container className="py-4">
          <Row className="justify-content-center">
            <Col lg={8}>
              <Link to="/blogs" className="text-primary text-decoration-none fw-bold mb-3 d-inline-block">
                &larr; {isNp ? 'ब्लगहरूमा फर्कनुहोस्' : 'Back to Blogs'}
              </Link>
              <h1 className="display-5 fw-extrabold mb-3 text-white leading-tight">
                {translated.title}
              </h1>
              <div className="d-flex align-items-center gap-3 text-light opacity-75" style={{ fontSize: '0.95rem' }}>
                <span className="bg-primary px-3 py-1 rounded-pill text-white text-uppercase fw-bold" style={{ fontSize: '0.75rem' }}>
                  {isNp ? 'जानकारी' : 'Insight'}
                </span>
                <span>By <strong>{blog.author}</strong></span>
                <span>•</span>
                <span>{formatDate(blog.createdAt)}</span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Article Content Area */}
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={8}>
            {/* Big cover image */}
            {blog.coverImage ? (
              <div className="blog-reader-cover-wrapper mb-5 rounded-4 overflow-hidden shadow-lg">
                <img
                  src={blog.coverImage}
                  alt={translated.title}
                  className="w-100 object-fit-cover"
                  style={{ maxHeight: '480px' }}
                />
              </div>
            ) : null}

            {/* Content text */}
            <div className="blog-reader-content" style={{ fontSize: '1.18rem', lineHeight: '1.95', color: '#334155' }}>
              {translated.content?.split('\n').map((paragraph: string, index: number) => (
                <p key={index} className="mb-4">
                  {paragraph.trim()}
                </p>
              ))}
            </div>

            <hr className="my-5" />

            {/* Author Footer Card */}
            <div className="p-4 bg-light rounded-4 d-flex align-items-center gap-3 mb-5 border-0">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>
                {blog.author?.charAt(0) || 'A'}
              </div>
              <div>
                <h4 className="h6 fw-bold mb-1 text-dark">
                  {blog.author || 'Admin'}
                </h4>
                <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
                  {isNp 
                    ? 'भूमिराज रियल इस्टेटको आधिकारिक लेखक।' 
                    : 'Official contributor at Bhumiraj Real Estate.'}
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </article>
  )
}

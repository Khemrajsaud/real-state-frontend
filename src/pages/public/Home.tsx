import { useQuery } from '@tanstack/react-query'
import { Accordion, Carousel, Col, Container, Row, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getBannerImage, getBanners } from '../../api/banners'
import { getFaqs } from '../../api/faqs'
import { getProperties } from '../../api/properties'
import { getTestimonialAvatar, getTestimonials } from '../../api/testimonials'
import { getBlogs } from '../../api/blogs'
import { ErrorState } from '../../components/common/ErrorState'
import { Loader } from '../../components/common/Loader'
import { PropertyCard } from '../../components/property/PropertyCard'
import { companyInfo } from '../../constants/companyInfo'
import { useLanguage } from '../../context/LanguageContext'
import {
  translateTestimonial,
  translateFaq,
  translateBlog,
} from '../../utils/translateHelpers'

export function Home() {
  const { t, language } = useLanguage()
  const isNp = language === 'np'

  const bannersQuery = useQuery({
    queryKey: ['banners'],
    queryFn: getBanners,
  })
  const propertiesQuery = useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
  })
  const testimonialsQuery = useQuery({
    queryKey: ['testimonials'],
    queryFn: getTestimonials,
  })
  const faqsQuery = useQuery({
    queryKey: ['faqs'],
    queryFn: getFaqs,
  })
  const blogsQuery = useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs,
  })

  const banners = bannersQuery.data ?? []
  const featuredProperties = (propertiesQuery.data ?? []).slice(0, 6)
  const testimonials = (testimonialsQuery.data ?? []).slice(0, 3)
  const faqs = (faqsQuery.data ?? []).slice(0, 3)
  const latestBlogs = (blogsQuery.data ?? []).slice(0, 3)
  const isHeroLoading = bannersQuery.isLoading || propertiesQuery.isLoading

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString(isNp ? 'ne-NP' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <main>

      <section className="home-hero p-0">
        {banners.length > 0 ? (
          <Carousel className="home-hero__carousel rounded-0 border-0 shadow-none" indicators={banners.length > 1}>
            {banners.map((banner) => {
              const imageUrl = getBannerImage(banner)

              return (
                <Carousel.Item key={String(banner._id ?? banner.id ?? banner.title)}>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={banner.title ?? 'Featured real estate banner'}
                      className="home-hero__image"
                    />
                  ) : (
                    <div className="home-hero__image home-hero__image--empty" />
                  )}
                  <Carousel.Caption>
                    <Container>
                      <p className="eyebrow">{isNp ? companyInfo.nameNp : companyInfo.nameEn}</p>
                      <h1>{isNp ? companyInfo.taglineNp : companyInfo.taglineEn}</h1>
                      <Link to="/properties" className="btn btn-primary btn-lg">
                        {t('heroBtn')}
                      </Link>
                    </Container>
                  </Carousel.Caption>
                </Carousel.Item>
              )
            })}
          </Carousel>
        ) : (
          <div className="home-hero__fallback rounded-0 border-0 shadow-none">
            <Container>
              <p className="eyebrow text-primary">{isNp ? companyInfo.nameNp : companyInfo.nameEn}</p>
              <h1>{isNp ? companyInfo.taglineNp : companyInfo.taglineEn}</h1>
              <p>{isNp ? companyInfo.shortIntroNp : 'Trusted real estate service for buying, selling, and plotting properties in Kailali, Nepal.'}</p>
              <Link to="/properties" className="btn btn-primary btn-lg">
                {t('heroBtn')}
              </Link>
            </Container>
          </div>
        )}
        {isHeroLoading ? <Loader label="Loading home listings..." /> : null}
      </section>


      <section className="section-block">
        <Container>
          <div className="section-heading">
            <div>
              <p className="eyebrow text-primary">{t('featuredSubtitle')}</p>
              <h2>{t('featuredProperties')}</h2>
            </div>
            <Link to="/properties" className="btn btn-outline-primary">
              {t('viewAll')}
            </Link>
          </div>
          {propertiesQuery.isError ? (
            <ErrorState title="Could not load featured properties" />
          ) : null}
          {!propertiesQuery.isError && featuredProperties.length > 0 ? (
            <Row xs={1} md={2} lg={3} className="g-4">
              {featuredProperties.map((property) => (
                <Col key={String(property._id ?? property.id ?? property.title)}>
                  <PropertyCard property={property} />
                </Col>
              ))}
            </Row>
          ) : null}
        </Container>
      </section>


      <section className="section-block experience-band">
        <Container>
          <Row className="g-5 align-items-center">
            <Col lg={5}>
              <div className="founder-card">
                <img src="/founder.png" alt={isNp ? companyInfo.founderTitleNp : 'Founder'} />
                <div className="founder-card__caption">
                  <strong>{isNp ? companyInfo.founderTitleNp : 'Founder & MD'}</strong>
                  <span>{isNp ? companyInfo.nameNp : companyInfo.nameEn}</span>
                </div>
              </div>
            </Col>
            <Col lg={7}>
              <p className="eyebrow">{t('aboutUs')}</p>
              <h2>{isNp ? '१० वर्षको अनुभव र विश्वास' : '10 Years of Trust & Experience'}</h2>
              <p className="experience-band__copy">{isNp ? companyInfo.aboutNp : companyInfo.aboutEn}</p>
              <blockquote>
                "{isNp ? companyInfo.founderMessageNp : 'Our priority is client trust, transparent transactions, and secure investments.'}"
              </blockquote>
              <div className="experience-list">
                <span>{t('service1')}</span>
                <span>{t('service2')}</span>
                <span>{t('service3')}</span>
                <span>{t('service4')}</span>
              </div>
              <Link to="/about" className="btn btn-outline-light mt-4 px-4">
                {t('readMore')} →
              </Link>
            </Col>
          </Row>
        </Container>
      </section>


      <section className="section-block bg-white">
        <Container>
          <div className="section-heading">
            <div>
              <p className="eyebrow text-primary">{t('latestBlogsSubtitle')}</p>
              <h2>{t('latestBlogs')}</h2>
            </div>
            <Link to="/blogs" className="btn btn-outline-primary">
              {t('viewAll')}
            </Link>
          </div>
          {blogsQuery.isLoading ? <Loader label="Loading articles..." /> : null}
          {blogsQuery.isError ? <ErrorState title="Could not load blog posts" /> : null}
          {!blogsQuery.isError && latestBlogs.length > 0 ? (
            <Row xs={1} md={2} lg={3} className="g-4">
              {latestBlogs.map((blog) => {
                const translated = translateBlog(blog, language)
                return (
                  <Col key={String(blog._id ?? blog.id)}>
                    <Card className="h-100 border-0 shadow-sm blog-card-premium overflow-hidden transition-all duration-300">
                      <div className="blog-card-img-wrapper position-relative">
                        <img
                          src={blog.coverImage || '/placeholder-image.png'}
                          alt={translated.title}
                          className="w-100 object-fit-cover"
                          style={{ height: '200px' }}
                        />
                        <div className="blog-card-badge position-absolute top-0 start-0 m-3 badge bg-primary">
                          {isNp ? 'जानकारी' : 'Insight'}
                        </div>
                      </div>
                      <Card.Body className="p-4 d-flex flex-column">
                        <div className="blog-card-meta d-flex justify-content-between text-muted mb-2" style={{ fontSize: '0.85rem' }}>
                          <span>By {blog.author || 'Admin'}</span>
                          <span>{formatDate(blog.createdAt)}</span>
                        </div>
                        <Card.Title className="h5 fw-bold mb-3 text-dark line-clamp-2">
                          {translated.title}
                        </Card.Title>
                        <Card.Text className="text-muted line-clamp-3 mb-4" style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>
                          {translated.content}
                        </Card.Text>
                        <Link
                          to={`/blogs/${blog.slug}`}
                          className="mt-auto text-primary fw-bold text-decoration-none d-inline-flex align-items-center gap-1 hover-gap"
                        >
                          {isNp ? 'थप पढ्नुहोस्' : 'Read Full Article'} &rarr;
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                )
              })}
            </Row>
          ) : null}
        </Container>
      </section>


      <section className="section-block section-block--soft">
        <Container>
          <div className="section-heading">
            <div>
              <p className="eyebrow text-primary">{t('testiSubtitle')}</p>
              <h2>{t('testimonials')}</h2>
            </div>
          </div>
          {testimonialsQuery.isLoading ? <Loader label="Loading testimonials..." /> : null}
          {testimonialsQuery.isError ? <ErrorState title="Could not load testimonials" /> : null}
          {!testimonialsQuery.isError && testimonials.length > 0 ? (
            <Row xs={1} md={3} className="g-4">
              {testimonials.map((testimonial) => {
                const translated = translateTestimonial(testimonial, language)
                const avatar = getTestimonialAvatar(translated)

                return (
                  <Col key={String(translated._id ?? translated.id ?? translated.clientName)}>
                    <article className="testimonial-card">
                      <div className="testimonial-card__person">
                        {avatar ? (
                          <img src={avatar} alt={translated.clientName ?? 'Client'} />
                        ) : (
                          <span>{translated.clientName?.charAt(0) ?? 'C'}</span>
                        )}
                        <div>
                          <h3>{translated.clientName ?? 'Happy client'}</h3>
                          <p>{translated.role ?? translated.company ?? 'Client'}</p>
                        </div>
                      </div>
                      <p className="mb-0">{translated.message}</p>
                    </article>
                  </Col>
                )
              })}
            </Row>
          ) : null}
        </Container>
      </section>


      <section className="section-block">
        <Container>
          <Row className="g-4 align-items-start">
            <Col lg={5}>
              <p className="eyebrow text-primary">{t('faqsEyebrow')}</p>
              <h2>{t('faqs')}</h2>
              <p className="text-muted">
                {t('faqsSubtitle')}
              </p>
            </Col>
            <Col lg={7}>
              {faqsQuery.isLoading ? <Loader label="Loading FAQs..." /> : null}
              {faqsQuery.isError ? <ErrorState title="Could not load FAQs" /> : null}
              {!faqsQuery.isError && faqs.length > 0 ? (
                <Accordion className="faq-accordion">
                  {faqs.map((faq, index) => {
                    const translated = translateFaq(faq, language)
                    return (
                      <Accordion.Item
                        eventKey={String(index)}
                        key={String(translated._id ?? translated.id ?? translated.question)}
                      >
                        <Accordion.Header>
                          {translated.question ?? 'Question unavailable'}
                        </Accordion.Header>
                        <Accordion.Body>{translated.answer ?? 'Answer coming soon.'}</Accordion.Body>
                      </Accordion.Item>
                    )
                  })}
                </Accordion>
              ) : null}
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  )
}

import { Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

export function NotFound() {
  const { language } = useLanguage()

  const isNp = language === 'np'
  const title = isNp ? 'माफ गर्नुहोला, पृष्ठ फेला परेन' : 'Page Not Found'
  const text = isNp ? 'तपाईंले खोज्नुभएको पृष्ठ यहाँ उपलब्ध छैन। कृपया गृहपृष्ठमा फर्कनुहोस्।' : 'The page you are looking for does not exist or has been moved.'
  const btn = isNp ? 'गृहपृष्ठमा फर्कनुहोस्' : 'Back to Home'

  return (
    <main className="d-flex align-items-center justify-content-center text-center py-5" style={{ minHeight: '70vh' }}>
      <Container>
        <img 
          src="/nepali-404.png" 
          alt="404 Nepali Art" 
          className="img-fluid mb-4" 
          style={{ maxWidth: '320px', mixBlendMode: 'multiply' }} 
        />
        <h1 className="display-1 fw-bold text-primary mb-3" style={{ fontSize: '6rem' }}>404</h1>
        <h2 className="h3 mb-3 fw-bold">{title}</h2>
        <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '26rem' }}>{text}</p>
        <Link to="/">
          <Button variant="primary" size="lg" className="px-5 rounded-pill shadow-sm">
            {btn}
          </Button>
        </Link>
      </Container>
    </main>
  )
}

import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { companyInfo } from '../../constants/companyInfo'
import { useLanguage } from '../../context/LanguageContext'

export function Footer() {
  const { t, language } = useLanguage()
  const isNp = language === 'np'

  return (
    <footer className="site-footer bg-dark-navy text-light py-5 border-top border-primary border-3">
      <Container>
        <Row className="g-4">
          {/* Column 1: About the company */}
          <Col lg={5} md={6}>
            <div className="footer-about">
              <h2 className="footer-brand h4 fw-bold text-white mb-3">
                {isNp ? companyInfo.nameNp : companyInfo.nameEn}
              </h2>
              <p className="footer-desc text-muted mb-4" style={{ fontSize: '0.95rem', lineHeight: '1.7' }}>
                {t('footerAboutText')}
              </p>
              <div className="footer-socials d-flex gap-3">
                {/* Whatsapp Icon Link */}
                <a
                  href={`https://wa.me/${companyInfo.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="social-btn bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '40px', height: '40px', fontSize: '1.2rem', transition: 'all 0.3s ease' }}
                  title="WhatsApp"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                  </svg>
                </a>
              </div>
            </div>
          </Col>

          {/* Column 2: Quick navigation links */}
          <Col lg={3} md={6}>
            <div className="footer-links">
              <h3 className="h6 text-uppercase fw-bold text-white tracking-wider mb-3">
                {t('footerQuickLinks')}
              </h3>
              <ul className="list-unstyled d-flex flex-column gap-2" style={{ fontSize: '0.95rem' }}>
                <li>
                  <Link to="/" className="text-muted text-decoration-none hover-text-primary">
                    {t('navHome')}
                  </Link>
                </li>
                <li>
                  <Link to="/properties" className="text-muted text-decoration-none hover-text-primary">
                    {t('navProperties')}
                  </Link>
                </li>
                <li>
                  <Link to="/blogs" className="text-muted text-decoration-none hover-text-primary">
                    {t('navBlogs')}
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-muted text-decoration-none hover-text-primary">
                    {t('navAbout')}
                  </Link>
                </li>
              </ul>
            </div>
          </Col>

          {/* Column 3: Contact Details */}
          <Col lg={4} md={12}>
            <div className="footer-contact">
              <h3 className="h6 text-uppercase fw-bold text-white tracking-wider mb-3">
                {t('footerContact')}
              </h3>
              <ul className="list-unstyled d-flex flex-column gap-3 text-muted" style={{ fontSize: '0.95rem' }}>
                <li className="d-flex align-items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="text-primary mt-1">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                  </svg>
                  <span>
                    <strong>{t('footerAddress')}:</strong> {isNp ? companyInfo.addressNp : companyInfo.address}
                  </span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="text-primary mt-1">
                    <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58z"/>
                  </svg>
                  <span>
                    <strong>{t('footerPhone')}:</strong> {companyInfo.phones.join('  /  ')}
                  </span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="text-primary mt-1">
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
                  </svg>
                  <span>
                    <strong>{t('footerEmail')}:</strong> <a href={`mailto:${companyInfo.email}`} className="text-muted text-decoration-none hover-text-primary">{companyInfo.email}</a>
                  </span>
                </li>
              </ul>
            </div>
          </Col>
        </Row>

        <hr className="my-4 border-secondary" />

        <div className="d-flex flex-wrap justify-content-between align-items-center text-muted" style={{ fontSize: '0.88rem' }}>
          <p className="mb-0">
            &copy; {new Date().getFullYear()} {isNp ? companyInfo.nameNp : companyInfo.nameEn}. {isNp ? 'सर्वाधिकार सुरक्षित।' : 'All rights reserved.'}
          </p>
          <p className="mb-0">
            {isNp ? 'सुरक्षित र पारदर्शी घर-जग्गा कारोबार।' : 'Secure & Transparent Real Estate Services.'}
          </p>
        </div>
      </Container>
    </footer>
  )
}

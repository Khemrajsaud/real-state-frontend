import { Container, Nav, Navbar as BootstrapNavbar } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'
import { companyDisplayName, companyInfo } from '../../constants/companyInfo'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../context/LanguageContext'

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth()
  const { language, toggleLanguage, t } = useLanguage()

  return (
    <BootstrapNavbar expand="lg" className="site-navbar">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="brand-lockup">
          <img src="/logo.png" alt={`${companyDisplayName} logo`} />
          <span>
            <strong>{companyDisplayName}</strong>
            <small>{companyInfo.taglineEn}</small>
          </span>
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="site-navbar-nav" />
        <BootstrapNavbar.Collapse id="site-navbar-nav">
          <Nav className="site-nav-links mx-lg-auto">
            <Nav.Link as={NavLink} to="/" end>
              {t('navHome')}
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about">
              {t('navAbout')}
            </Nav.Link>
            <Nav.Link as={NavLink} to="/properties">
              {t('navProperties')}
            </Nav.Link>
            <Nav.Link as={NavLink} to="/blogs">
              {t('navBlogs')}
            </Nav.Link>
          </Nav>
          <Nav className="site-nav-actions">
            {isAuthenticated ? (
              <>
                <Nav.Link as={NavLink} to="/favorites">
                  {t('navFavorites')}
                </Nav.Link>
                <Nav.Link as={NavLink} to="/profile">
                  {t('navProfile')}
                </Nav.Link>
                <button type="button" className="btn btn-sm btn-dark" onClick={logout}>
                  {t('navLogin')} {user?.name ? user.name : ''}
                </button>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login" className="login-link">
                  {t('navLogin')}
                </Nav.Link>
                <Nav.Link as={NavLink} to="/signup" className="nav-cta">
                  {t('navGetStarted')}
                </Nav.Link>
              </>
            )}
            <button 
              type="button" 
              className="btn btn-sm btn-outline-secondary ms-2" 
              onClick={toggleLanguage}
              style={{ padding: '0.2rem 0.6rem', fontWeight: 'bold' }}
            >
              {language === 'np' ? 'EN' : 'NP'}
            </button>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  )
}

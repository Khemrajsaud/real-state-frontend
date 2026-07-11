import { useRef, useState, useEffect } from 'react'
import { Container, Nav, Navbar as BootstrapNavbar } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'
import { companyDisplayName, companyInfo } from '../../constants/companyInfo'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../context/LanguageContext'

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth()
  const { language, toggleLanguage, t } = useLanguage()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const avatarUrl = user?.avatar as string | undefined
  const userName = user?.name as string | undefined
  const initials = userName ? userName.charAt(0).toUpperCase() : 'U'

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
            <Nav.Link as={NavLink} to="/" end>{t('navHome')}</Nav.Link>
            <Nav.Link as={NavLink} to="/about">{t('navAbout')}</Nav.Link>
            <Nav.Link as={NavLink} to="/properties">{t('navProperties')}</Nav.Link>
            <Nav.Link as={NavLink} to="/blogs">{t('navBlogs')}</Nav.Link>
          </Nav>

          <Nav className="site-nav-actions align-items-center">
            {isAuthenticated ? (
              <div className="nav-avatar-wrapper" ref={dropdownRef}>
                <button
                  type="button"
                  className="nav-avatar-btn"
                  onClick={() => setDropdownOpen((o) => !o)}
                  aria-label="User menu"
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={userName ?? 'User'} className="nav-avatar-img" />
                  ) : (
                    <div className="nav-avatar-initials">{initials}</div>
                  )}
                  <span className="nav-avatar-name d-none d-lg-inline">{userName}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="ms-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="nav-avatar-dropdown">
                    <div className="nav-avatar-dropdown__header">
                      <div className="fw-semibold">{userName}</div>
                      <div className="text-muted small">{user?.email as string}</div>
                    </div>
                    <Link to="/favorites" className="nav-avatar-dropdown__item" onClick={() => setDropdownOpen(false)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {t('navFavorites')}
                    </Link>
                    <Link to="/profile" className="nav-avatar-dropdown__item" onClick={() => setDropdownOpen(false)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {t('navProfile')}
                    </Link>
                    <div className="nav-avatar-dropdown__divider" />
                    <button
                      type="button"
                      className="nav-avatar-dropdown__item nav-avatar-dropdown__item--danger"
                      onClick={() => { setDropdownOpen(false); logout() }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login" className="login-link">{t('navLogin')}</Nav.Link>
                <Nav.Link as={NavLink} to="/signup" className="nav-cta">{t('navGetStarted')}</Nav.Link>
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

import { NavLink, Outlet } from 'react-router-dom'
import { companyInfo } from '../constants/companyInfo'
import { useAuth } from '../hooks/useAuth'

const adminLinks = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/properties', label: 'Properties' },
  { to: '/admin/banners', label: 'Banners' },
  { to: '/admin/blogs', label: 'Blogs' },
  { to: '/admin/faqs', label: 'FAQs' },
  { to: '/admin/testimonials', label: 'Testimonials' },
  { to: '/admin/inquiries', label: 'Inquiries' },
  { to: '/admin/users', label: 'Users' },
]

export function AdminLayout() {
  const { logout } = useAuth()

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src="/logo.png" alt={`${companyInfo.nameNp} logo`} />
          <h1>{companyInfo.nameNp}</h1>
        </div>
        <nav>
          {adminLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="btn btn-outline-light btn-sm" onClick={logout}>
          Logout
        </button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}

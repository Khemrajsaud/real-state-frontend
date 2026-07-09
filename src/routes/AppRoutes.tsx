import { Route, Routes } from 'react-router-dom'
import { AdminLayout } from '../layouts/AdminLayout'
import { PublicLayout } from '../layouts/PublicLayout'
import { AdminRoute } from './AdminRoute'
import { ProtectedRoute } from './ProtectedRoute'
import { AdminLogin } from '../pages/admin/AdminLogin'
import { BannersManage } from '../pages/admin/BannersManage'
import { Dashboard } from '../pages/admin/Dashboard'
import { FaqsManage } from '../pages/admin/FaqsManage'
import { Inquiries } from '../pages/admin/Inquiries'
import { PropertiesManage } from '../pages/admin/PropertiesManage'
import { Subscribers } from '../pages/admin/Subscribers'
import { TestimonialsManage } from '../pages/admin/TestimonialsManage'
import { Users } from '../pages/admin/Users'
import { Contact } from '../pages/public/Contact'
import { Favorites } from '../pages/public/Favorites'
import { Home } from '../pages/public/Home'
import { Login } from '../pages/public/Login'
import { Profile } from '../pages/public/Profile'
import { PropertyDetail } from '../pages/public/PropertyDetail'
import { PropertyList } from '../pages/public/PropertyList'
import { Signup } from '../pages/public/Signup'
import { NotFound } from '../pages/public/NotFound'
import { ForgotPassword } from '../pages/public/ForgotPassword'
import { About } from '../pages/public/About'
import { Blogs } from '../pages/public/Blogs'
import { BlogDetail } from '../pages/public/BlogDetail'
import { BlogsManage } from '../pages/admin/BlogsManage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="properties" element={<PropertyList />} />
        <Route path="properties/:propertyId" element={<PropertyDetail />} />
        <Route path="contact" element={<Contact />} />
        <Route path="about" element={<About />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="blogs/:slug" element={<BlogDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="favorites" element={<Favorites />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="admin/login" element={<AdminLogin />} />
      <Route element={<AdminRoute />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="properties" element={<PropertiesManage />} />
          <Route path="banners" element={<BannersManage />} />
          <Route path="blogs" element={<BlogsManage />} />
          <Route path="faqs" element={<FaqsManage />} />
          <Route path="testimonials" element={<TestimonialsManage />} />
          <Route path="inquiries" element={<Inquiries />} />
          <Route path="subscribers" element={<Subscribers />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Route>
    </Routes>
  )
}

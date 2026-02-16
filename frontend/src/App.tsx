import { Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { SearchPage } from './pages/SearchPage'
import { LodgingDetailPage } from './pages/LodgingDetailPage'
import { BookingsPage } from './pages/BookingsPage'
import { DashboardPage } from './pages/DashboardPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { HostDashboardPage } from './pages/HostDashboardPage'
import { FavoritesPage } from './pages/FavoritesPage'

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/host" element={<HostDashboardPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/lodgings/:id" element={<LodgingDetailPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
      </Routes>
    </>
  )
}

export default App

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { hostService } from '../services/dashboardService';
import { paymentService } from '../services/paymentService';
import { CalendarComponent } from '../components/CalendarComponent';
import { PricingPanel } from '../components/PricingPanel';

interface Lodging {
  id: string;
  name: string;
  title?: string;
  city?: string;
  location?: {
    city: string;
  };
  price: number;
  images?: string[];
  amenities?: string[];
  description?: string;
}

interface Booking {
  id: string;
  lodgingId: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  numberOfGuests: number;
  status: string;
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  paymentMethod?: 'cash' | 'card';
  hostId?: string;
  userId?: string;
  paymentDate?: Date | null;
  notes?: string;
}

interface Stats {
  totalLodgings: number;
  totalBookings: number;
  totalRevenueK: number;
}

export const HostDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'lodgings' | 'bookings' | 'payments' | 'calendar' | 'pricing'>('overview');
  const [selectedLodgingForCalendar, setSelectedLodgingForCalendar] = useState<string | null>(null);
  const [selectedLodgingForPricing, setSelectedLodgingForPricing] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [paymentSummary, setPaymentSummary] = useState<any | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [lodgings, setLodgings] = useState<Lodging[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageIndexes, setImageIndexes] = useState<{ [key: string]: number }>({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    country: '',
    price: '',
    amenities: '',
    images: [] as File[],
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'host') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'lodgings') {
      fetchLodgings();
    } else if (activeTab === 'bookings') {
      fetchBookings();
    } else if (activeTab === 'payments') {
      fetchPayments();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await hostService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLodgings = async () => {
    try {
      setLoading(true);
      const data = await hostService.getMyLodgings();
      setLodgings(data);
    } catch (error) {
      console.error('Failed to fetch lodgings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await hostService.getMyBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const [summary, history] = await Promise.all([
        paymentService.getPaymentSummary(),
        paymentService.getPaymentHistory(),
      ]);
      setPaymentSummary(summary);
      setPaymentHistory(history);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async (bookingId: string, notes?: string) => {
    try {
      await paymentService.recordCashPayment(bookingId, notes);
      alert('Payment recorded successfully');
      fetchPayments();
      fetchBookings();
    } catch (error) {
      console.error('Failed to record payment:', error);
      alert('Failed to record payment');
    }
  };

  const handleCreateLodging = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const amenitiesArray = formData.amenities
        .split(',')
        .map(a => a.trim())
        .filter(a => a);

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('country', formData.country);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('amenities', JSON.stringify(amenitiesArray));
      formDataToSend.append('rating', '0');

      // Append all image files
      formData.images.forEach((file) => {
        formDataToSend.append('images', file);
      });

      if (editingId) {
        await hostService.updateLodging(editingId, formDataToSend);
      } else {
        await hostService.createLodging(formDataToSend);
      }

      setFormData({
        title: '',
        description: '',
        city: '',
        country: '',
        price: '',
        amenities: '',
        images: [],
      });
      setShowForm(false);
      setEditingId(null);
      fetchLodgings();
      fetchStats();
    } catch (error) {
      console.error('Failed to create lodging:', error);
      alert('Failed to create lodging');
    }
  };

  const handleDeleteLodging = async (lodgingId: string) => {
    if (!confirm('Are you sure you want to delete this lodging?')) return;
    try {
      await hostService.deleteLodging(lodgingId);
      setLodgings(lodgings.filter(l => l.id !== lodgingId));
      fetchStats();
    } catch (error) {
      console.error('Failed to delete lodging:', error);
    }
  };

  const handleEditLodging = (lodging: Lodging) => {
    setFormData({
      title: lodging.title || lodging.name || '',
      description: lodging.description || '',
      city: lodging.location?.city || lodging.city || '',
      country: (lodging.location as any)?.country || '',
      price: lodging.price.toString(),
      amenities: (lodging.amenities || []).join(', '),
      images: [],
    });
    setEditingId(lodging.id);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setFormData({
      title: '',
      description: '',
      city: '',
      country: '',
      price: '',
      amenities: '',
      images: [],
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    try {
      await hostService.updateBookingStatus(bookingId, status);
      fetchBookings();
      fetchStats();
    } catch (error) {
      console.error('Failed to update booking status:', error);
      alert('Failed to update booking');
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center md:bg-fixed bg-scroll" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80")'}}>
      <div className="min-h-screen bg-black bg-opacity-60 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Host Dashboard</h1>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-white border-opacity-20 flex-wrap">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'overview'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('lodgings')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'lodgings'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            My Lodgings
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'bookings'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'payments'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Payments
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'calendar'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'pricing'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Pricing
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats && [
              { label: 'Total Lodgings', value: stats.totalLodgings },
              { label: 'Total Bookings', value: stats.totalBookings },
              { label: 'Revenue (K)', value: stats.totalRevenueK },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-white border-opacity-20 hover:bg-opacity-20 transition-all"
              >
                <p className="text-gray-300 text-sm mb-2">{stat.label}</p>
                <p className="text-4xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Lodgings Tab */}
        {activeTab === 'lodgings' && (
          <div>
            <button
              onClick={() => {
                if (showForm) {
                  handleCancelEdit();
                } else {
                  setShowForm(true);
                }
              }}
              className="mb-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              {showForm ? 'Cancel' : '+ Add New Lodging'}
            </button>

            {showForm && (
              <form
                onSubmit={handleCreateLodging}
                className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl border border-white border-opacity-20 p-6 mb-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6">
                  {editingId ? 'Edit Lodging' : 'Create New Lodging'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white mb-2">Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="Lodging title"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Price (K)</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">City</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Country</label>
                    <input
                      type="text"
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="Country"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-white mb-2">Description</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="Description"
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-white mb-2">Amenities (comma separated)</label>
                    <input
                      type="text"
                      value={formData.amenities}
                      onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                      className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="WiFi, Pool, Gym"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-white mb-2">Images (Select files)</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setFormData({ ...formData, images: Array.from(e.target.files || []) })}
                      className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                    />
                    {formData.images.length > 0 && (
                      <div className="mt-4">
                        <div className="text-sm text-gray-300 mb-3">
                          Selected {formData.images.length} image(s) - Max 10 allowed
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {formData.images.map((file, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${idx}`}
                                className="w-full h-24 object-cover rounded border border-white border-opacity-20"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    images: formData.images.filter((_, i) => i !== idx)
                                  });
                                }}
                                className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                ✕
                              </button>
                              <div className="text-xs text-gray-300 mt-1 truncate">{file.name}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors"
                >
                  {editingId ? 'Update Lodging' : 'Create Lodging'}
                </button>
              </form>
            )}

            {loading ? (
              <div className="text-center text-gray-300">Loading lodgings...</div>
            ) : lodgings.length === 0 ? (
              <div className="text-center text-gray-300 py-8">No lodgings yet. Create your first one!</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lodgings.map((lodging) => {
                  const currentImageIndex = imageIndexes[lodging.id] || 0;
                  const images = lodging.images || [];
                  const currentImage = images[currentImageIndex];
                  const hasMultipleImages = images.length > 1;

                  return (
                  <div
                    key={lodging.id}
                    className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl border border-white border-opacity-20 overflow-hidden hover:bg-opacity-20 transition-all"
                  >
                    {currentImage && (
                      <div className="relative w-full h-48 bg-gray-900">
                        <img
                          src={currentImage}
                          alt={lodging.title || lodging.name}
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                        />
                        {hasMultipleImages && (
                          <>
                            <button
                              onClick={() => setImageIndexes({
                                ...imageIndexes,
                                [lodging.id]: (currentImageIndex - 1 + images.length) % images.length
                              })}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                            >
                              ◀
                            </button>
                            <button
                              onClick={() => setImageIndexes({
                                ...imageIndexes,
                                [lodging.id]: (currentImageIndex + 1) % images.length
                              })}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                            >
                              ▶
                            </button>
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                              {currentImageIndex + 1}/{images.length}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-2">{lodging.title || lodging.name}</h3>
                      <p className="text-gray-300 text-sm mb-2">{lodging.location?.city || lodging.city || 'N/A'}</p>
                      <p className="text-blue-400 font-semibold mb-4">K{lodging.price}/night</p>
                      {lodging.amenities && (
                        <div className="mb-4 flex flex-wrap gap-2">
                          {lodging.amenities.slice(0, 3).map((amenity, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-blue-500 bg-opacity-20 text-blue-300 px-2 py-1 rounded border border-blue-400 border-opacity-50"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditLodging(lodging)}
                          className="flex-1 bg-blue-500 bg-opacity-20 text-blue-300 hover:bg-opacity-40 py-2 rounded border border-blue-400 border-opacity-50 transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteLodging(lodging.id)}
                          className="flex-1 bg-red-500 bg-opacity-20 text-red-300 hover:bg-opacity-40 py-2 rounded border border-red-400 border-opacity-50 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl border border-white border-opacity-20 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-300">Loading bookings...</div>
            ) : (
              <table className="w-full">
                <thead className="border-b border-white border-opacity-20">
                  <tr>
                    <th className="px-6 py-4 text-left text-gray-300">Check In</th>
                    <th className="px-6 py-4 text-left text-gray-300">Check Out</th>
                    <th className="px-6 py-4 text-left text-gray-300">Guests</th>
                    <th className="px-6 py-4 text-left text-gray-300">Total (K)</th>
                    <th className="px-6 py-4 text-left text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-300">
                        No bookings yet
                      </td>
                    </tr>
                  ) : (
                    bookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-white border-opacity-20 hover:bg-white hover:bg-opacity-5">
                        <td className="px-6 py-4 text-white">{new Date(booking.checkInDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-white">{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-white">{booking.numberOfGuests}</td>
                        <td className="px-6 py-4 text-white">K{booking.totalPrice}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded text-sm font-semibold ${
                              booking.status === 'confirmed'
                                ? 'bg-green-500 bg-opacity-20 text-green-300 border border-green-400'
                                : booking.status === 'pending'
                                ? 'bg-yellow-500 bg-opacity-20 text-yellow-300 border border-yellow-400'
                                : 'bg-red-500 bg-opacity-20 text-red-300 border border-red-400'
                            }`}
                          >
                            {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'UNKNOWN'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 flex-wrap">
                            {booking.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                                  className="px-3 py-1 bg-green-500 bg-opacity-20 text-green-300 hover:bg-opacity-40 rounded text-sm border border-green-400 transition-all whitespace-nowrap"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                                  className="px-3 py-1 bg-red-500 bg-opacity-20 text-red-300 hover:bg-opacity-40 rounded text-sm border border-red-400 transition-all whitespace-nowrap"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {booking.status === 'confirmed' && (
                              <button
                                onClick={() => {
                                  if (confirm('Are you sure you want to cancel this booking?')) {
                                    handleUpdateBookingStatus(booking.id, 'cancelled');
                                  }
                                }}
                                className="px-3 py-1 bg-red-500 bg-opacity-20 text-red-300 hover:bg-opacity-40 rounded text-sm border border-red-400 transition-all whitespace-nowrap"
                              >
                                Cancel
                              </button>
                            )}
                            {booking.status === 'cancelled' && (
                              <span className="text-gray-400 text-sm">No actions</span>
                            )}
                            {!booking.status && (
                              <span className="text-blue-400 text-sm">Status missing</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-8">
            {/* Payment Summary Cards */}
            {paymentSummary && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6">
                  <p className="text-green-100 text-sm font-semibold mb-2">Total Earnings</p>
                  <p className="text-3xl font-bold text-white">K{paymentSummary.totalEarnings}</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6">
                  <p className="text-yellow-100 text-sm font-semibold mb-2">Pending Amount</p>
                  <p className="text-3xl font-bold text-white">K{paymentSummary.pendingAmount}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6">
                  <p className="text-blue-100 text-sm font-semibold mb-2">Paid Bookings</p>
                  <p className="text-3xl font-bold text-white">{paymentSummary.paidBookingsCount}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6">
                  <p className="text-purple-100 text-sm font-semibold mb-2">Total Bookings</p>
                  <p className="text-3xl font-bold text-white">{paymentSummary.totalBookings}</p>
                </div>
              </div>
            )}

            {/* Payment History Table */}
            {loading ? (
              <div className="text-center text-gray-300">Loading payment history...</div>
            ) : paymentHistory.length === 0 ? (
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl border border-white border-opacity-20 p-8 text-center text-gray-300">
                No payments recorded yet
              </div>
            ) : (
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl border border-white border-opacity-20 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white border-opacity-10 bg-black bg-opacity-20">
                      <th className="px-6 py-3 text-left text-white text-sm font-semibold">Date</th>
                      <th className="px-6 py-3 text-left text-white text-sm font-semibold">Check-in</th>
                      <th className="px-6 py-3 text-left text-white text-sm font-semibold">Check-out</th>
                      <th className="px-6 py-3 text-left text-white text-sm font-semibold">Amount</th>
                      <th className="px-6 py-3 text-left text-white text-sm font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentHistory.map((payment) => (
                      <tr key={payment.id} className="border-b border-white border-opacity-5 hover:bg-white hover:bg-opacity-5">
                        <td className="px-6 py-4 text-gray-300 text-sm">
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{payment.checkInDate}</td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{payment.checkOutDate}</td>
                        <td className="px-6 py-4 text-green-400 text-sm font-semibold">K{payment.amount}</td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{payment.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pending Payments to Record */}
            {bookings.filter(b => b.status === 'confirmed' && b.paymentStatus !== 'paid').length > 0 && (
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl border border-white border-opacity-20 p-6">
                <h3 className="text-xl font-bold text-white mb-6">Record Cash Payments</h3>
                <div className="space-y-3">
                  {bookings
                    .filter(b => b.status === 'confirmed' && b.paymentStatus !== 'paid')
                    .map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between bg-black bg-opacity-20 p-4 rounded">
                        <div className="flex-1">
                          <p className="text-white font-semibold">K{booking.totalPrice}</p>
                          <p className="text-gray-400 text-sm">{booking.checkInDate} to {booking.checkOutDate}</p>
                          <p className="text-gray-500 text-xs">{booking.numberOfGuests} guests</p>
                        </div>
                        <button
                          onClick={() => handleRecordPayment(booking.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition-all"
                        >
                          Record Payment
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Availability Calendar</h2>
              <p className="text-gray-300 text-sm mb-6">Select a lodging to view its calendar and block dates as needed</p>
              
              {/* Lodging selector */}
              <div className="mb-6">
                <label className="text-white mb-2 block text-sm">Select Lodging:</label>
                <select
                  value={selectedLodgingForCalendar || ''}
                  onChange={(e) => setSelectedLodgingForCalendar(e.target.value)}
                  className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="">-- Choose a lodging --</option>
                  {lodgings.map(l => (
                    <option key={l.id} value={l.id}>{l.title || l.name}</option>
                  ))}
                </select>
              </div>

              {/* Calendar */}
              {selectedLodgingForCalendar && (
                <CalendarComponent
                  lodgingId={selectedLodgingForCalendar}
                  onBlockDates={() => {
                    fetchLodgings();
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Seasonal Pricing</h2>
              <p className="text-gray-300 text-sm mb-6">Manage seasonal pricing for your lodgings</p>
              
              {/* Lodging selector */}
              <div className="mb-6">
                <label className="text-white mb-2 block text-sm">Select Lodging:</label>
                <select
                  value={selectedLodgingForPricing || ''}
                  onChange={(e) => setSelectedLodgingForPricing(e.target.value)}
                  className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="">-- Choose a lodging --</option>
                  {lodgings.map(l => (
                    <option key={l.id} value={l.id}>{l.title || l.name}</option>
                  ))}
                </select>
              </div>

              {/* Pricing Panel */}
              {selectedLodgingForPricing && (
                <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-white border-opacity-20">
                  <PricingPanel
                    lodgingId={selectedLodgingForPricing}
                    basePrice={lodgings.find(l => l.id === selectedLodgingForPricing)?.price || 100}
                  />
                </div>
              )}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

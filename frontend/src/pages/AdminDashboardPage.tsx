import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { adminService } from '../services/dashboardService';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Lodging {
  id: string;
  title?: string;
  name?: string;
  city?: string;
  price: number;
  description?: string;
  amenities?: string[];
  images?: string[];
}

interface Stats {
  totalUsers: number;
  totalLodgings: number;
  adminCount: number;
  hostCount: number;
  clientCount: number;
}

export const AdminDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'lodgings'>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [lodgings, setLodgings] = useState<Lodging[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<{ [key: string]: string }>({});
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    city: '',
    price: '',
    amenities: '',
    images: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'lodgings') {
      fetchLodgings();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers();
      setUsers(data);
      const roleMap: { [key: string]: string } = {};
      data.forEach((user: User) => {
        roleMap[user.id] = user.role;
      });
      setSelectedRole(roleMap);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLodgings = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllLodgings();
      setLodgings(Array.isArray(data) ? data : data.lodgings || []);
    } catch (error) {
      console.error('Failed to fetch lodgings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      setSelectedRole({ ...selectedRole, [userId]: newRole });
      const updatedUsers = users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminService.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleDeleteLodging = async (lodgingId: string) => {
    if (!confirm('Are you sure you want to delete this lodging?')) return;
    try {
      await adminService.deleteLodging(lodgingId);
      setLodgings(lodgings.filter(l => l.id !== lodgingId));
      fetchStats();
    } catch (error) {
      console.error('Failed to delete lodging:', error);
    }
  };

  const handleCreateOrUpdateLodging = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const amenitiesArray = formData.amenities
        .split(',')
        .map(a => a.trim())
        .filter(a => a);
      const imagesArray = formData.images
        .split(',')
        .map(i => i.trim())
        .filter(i => i);

      const lodgingData = {
        title: formData.title || formData.name,
        name: formData.name || formData.title,
        description: formData.description,
        city: formData.city,
        price: parseFloat(formData.price),
        amenities: amenitiesArray,
        images: imagesArray,
        rating: 0,
      };

      if (editingId) {
        await adminService.updateLodging(editingId, lodgingData);
      } else {
        await adminService.createLodging(lodgingData);
      }

      resetForm();
      fetchLodgings();
      fetchStats();
    } catch (error) {
      console.error('Failed to save lodging:', error);
      alert('Failed to save lodging');
    }
  };

  const handleEditLodging = (lodging: Lodging) => {
    console.log('Edit clicked for lodging:', lodging);
    
    // Handle amenities - could be array or string
    const amenitiesStr = Array.isArray(lodging.amenities) 
      ? lodging.amenities.join(', ') 
      : typeof lodging.amenities === 'string' 
      ? lodging.amenities 
      : '';
    
    // Handle images - could be array or string
    const imagesStr = Array.isArray(lodging.images) 
      ? lodging.images.join(', ') 
      : typeof lodging.images === 'string' 
      ? lodging.images 
      : '';

    const newFormData = {
      name: lodging.name || '',
      title: lodging.title || '',
      description: lodging.description || '',
      city: lodging.city || '',
      price: lodging.price.toString(),
      amenities: amenitiesStr,
      images: imagesStr,
    };
    
    console.log('Setting form data:', newFormData);
    setFormData(newFormData);
    setEditingId(lodging.id);
    console.log('Opening modal...');
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      description: '',
      city: '',
      price: '',
      amenities: '',
      images: '',
    });
    setEditingId(null);
    setShowModal(false);
  };

  const openNewLodgingModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      title: '',
      description: '',
      city: '',
      price: '',
      amenities: '',
      images: '',
    });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-cover bg-center md:bg-fixed bg-scroll" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80")'}}>
      <div className="min-h-screen bg-black bg-opacity-60 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-8 border-b border-white border-opacity-20">
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
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'users'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('lodgings')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'lodgings'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Lodgings
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {stats && [
                { label: 'Total Users', value: stats.totalUsers },
                { label: 'Total Lodgings', value: stats.totalLodgings },
                { label: 'Admins', value: stats.adminCount },
                { label: 'Hosts', value: stats.hostCount },
                { label: 'Clients', value: stats.clientCount },
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

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl border border-white border-opacity-20 overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-gray-300">Loading users...</div>
              ) : (
                <table className="w-full">
                  <thead className="border-b border-white border-opacity-20">
                    <tr>
                      <th className="px-6 py-4 text-left text-gray-300">Name</th>
                      <th className="px-6 py-4 text-left text-gray-300">Email</th>
                      <th className="px-6 py-4 text-left text-gray-300">Role</th>
                      <th className="px-6 py-4 text-left text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-white border-opacity-20 hover:bg-white hover:bg-opacity-5">
                        <td className="px-6 py-4 text-white">{user.name}</td>
                        <td className="px-6 py-4 text-gray-300">{user.email}</td>
                        <td className="px-6 py-4">
                          <select
                            value={selectedRole[user.id] || user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="bg-blue-500 bg-opacity-20 text-white rounded px-3 py-1 border border-blue-400 border-opacity-50"
                          >
                            <option value="admin">Admin</option>
                            <option value="host">Host</option>
                            <option value="client">Client</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-red-500 bg-opacity-20 text-red-300 hover:bg-opacity-40 px-3 py-1 rounded border border-red-400 border-opacity-50 transition-all"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Lodgings Tab */}
          {activeTab === 'lodgings' && (
            <div>
              <button
                onClick={openNewLodgingModal}
                className="mb-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                + Add New Lodging
              </button>

              {loading ? (
                <div className="text-center text-gray-300">Loading lodgings...</div>
              ) : lodgings.length === 0 ? (
                <div className="text-center text-gray-300 py-8">No lodgings yet. Create your first one!</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lodgings.map((lodging) => (
                    <div
                      key={lodging.id}
                      className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl border border-white border-opacity-20 overflow-hidden hover:bg-opacity-20 transition-all"
                    >
                      {lodging.images && lodging.images[0] && (
                        <img
                          src={lodging.images[0]}
                          alt={lodging.title || lodging.name}
                          className="w-full h-48 object-cover"
                          crossOrigin="anonymous"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="text-white font-semibold mb-2">{lodging.title || lodging.name}</h3>
                        <p className="text-gray-300 text-sm mb-2">{lodging.city}</p>
                        <p className="text-blue-400 font-semibold mb-4">K{lodging.price}/night</p>
                        {lodging.amenities && (
                          <div className="mb-4 flex flex-wrap gap-2">
                            {(Array.isArray(lodging.amenities) ? lodging.amenities : [lodging.amenities]).slice(0, 3).map((amenity, idx) => (
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
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl border border-white border-opacity-30 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white bg-opacity-20 p-6 border-b border-white border-opacity-30 flex justify-between items-center">
              <h3 className="text-white text-xl font-bold">
                {editingId ? 'Edit Lodging' : 'Create New Lodging'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdateLodging} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white mb-2 font-semibold">Title *</label>
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
                  <label className="block text-white mb-2 font-semibold">Price (K) *</label>
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
                  <label className="block text-white mb-2 font-semibold">City *</label>
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
                  <label className="block text-white mb-2 font-semibold">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                    placeholder="Lodging name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  placeholder="Description"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Amenities (comma separated)</label>
                <input
                  type="text"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  placeholder="WiFi, Pool, Gym"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Images (comma separated URLs)</label>
                <input
                  type="text"
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  placeholder="https://image1.jpg, https://image2.jpg"
                />
              </div>

              <div className="flex gap-4 pt-6 border-t border-white border-opacity-20">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  {editingId ? 'Update Lodging' : 'Create Lodging'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

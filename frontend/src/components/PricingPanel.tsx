import React, { useState, useEffect } from 'react';
import { pricingService } from '../services/pricingService';

interface SeasonalPrice {
  _id: string;
  startDate: string;
  endDate: string;
  pricePerNight: number;
  name: string;
}

interface PricingPanelProps {
  lodgingId: string;
  basePrice: number;
}

export const PricingPanel: React.FC<PricingPanelProps> = ({ lodgingId, basePrice }) => {
  const [prices, setPrices] = useState<SeasonalPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    startDate: '',
    endDate: '',
    pricePerNight: basePrice,
    name: '',
  });

  useEffect(() => {
    loadPrices();
  }, [lodgingId]);

  const loadPrices = async () => {
    try {
      setLoading(true);
      const data = await pricingService.getSeasonalPrices(lodgingId);
      setPrices(data);
    } catch (error) {
      console.error('Error loading prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate || !form.pricePerNight || !form.name) {
      alert('All fields are required');
      return;
    }

    try {
      setLoading(true);
      await pricingService.addSeasonalPrice(
        lodgingId,
        form.startDate,
        form.endDate,
        form.pricePerNight,
        form.name
      );
      setForm({ startDate: '', endDate: '', pricePerNight: basePrice, name: '' });
      setShowForm(false);
      await loadPrices();
    } catch (error) {
      console.error('Error adding price:', error);
      alert('Failed to add seasonal price');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePrice = async (pricingId: string) => {
    if (confirm('Are you sure you want to remove this seasonal price?')) {
      try {
        setLoading(true);
        await pricingService.removeSeasonalPrice(pricingId);
        await loadPrices();
      } catch (error) {
        console.error('Error removing price:', error);
        alert('Failed to remove seasonal price');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Seasonal Pricing</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Seasonal Price'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddPrice} className="bg-gray-50 p-4 rounded space-y-3">
          <input
            type="text"
            placeholder="Season name (e.g., Summer, Off-Season)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="number"
            placeholder="Price per night"
            value={form.pricePerNight}
            onChange={(e) => setForm({ ...form, pricePerNight: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Adding...' : 'Add Price'}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {loading && prices.length === 0 && (
          <p className="text-gray-500">Loading prices...</p>
        )}
        {prices.length === 0 && !loading && (
          <p className="text-gray-500">No seasonal prices set. Using base price: ${basePrice}/night</p>
        )}
        {prices.map((price) => (
          <div key={price._id} className="flex justify-between items-center bg-white p-3 border rounded">
            <div className="flex-1">
              <p className="font-medium">{price.name}</p>
              <p className="text-sm text-gray-600">
                {new Date(price.startDate).toLocaleDateString()} - {new Date(price.endDate).toLocaleDateString()}
              </p>
              <p className="text-sm font-semibold text-blue-600">${price.pricePerNight}/night</p>
            </div>
            <button
              onClick={() => handleRemovePrice(price._id)}
              disabled={loading}
              className="ml-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:bg-gray-400 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

import { SeasonalPriceModel } from '../models/SeasonalPrice';

export const seasonalPricingService = {
  // Add seasonal price
  addSeasonalPrice: async (
    lodgingId: string,
    startDate: string,
    endDate: string,
    pricePerNight: number,
    name: string = 'Seasonal Rate'
  ): Promise<any> => {
    const seasonalPrice = new SeasonalPriceModel({
      lodgingId,
      startDate,
      endDate,
      pricePerNight,
      name,
    });
    await seasonalPrice.save();
    return seasonalPrice.toObject();
  },

  // Remove seasonal price
  removeSeasonalPrice: async (seasonalPriceId: string): Promise<boolean> => {
    const result = await SeasonalPriceModel.deleteOne({ _id: seasonalPriceId });
    return result.deletedCount > 0;
  },

  // Get seasonal prices for a lodging
  getSeasonalPrices: async (lodgingId: string): Promise<any[]> => {
    const prices = await SeasonalPriceModel.find({ lodgingId }).sort({ startDate: 1 });
    return prices.map(p => p.toObject());
  },

  // Get price for a specific date
  getPriceForDate: async (lodgingId: string, date: string, basePrice: number): Promise<number> => {
    const seasonalPrice = await SeasonalPriceModel.findOne({
      lodgingId,
      startDate: { $lte: date },
      endDate: { $gt: date },
    });

    return seasonalPrice ? seasonalPrice.pricePerNight : basePrice;
  },

  // Calculate total price for date range
  calculateTotalPrice: async (
    lodgingId: string,
    startDate: string,
    endDate: string,
    basePrice: number
  ): Promise<{ totalPrice: number; breakdown: Array<{ date: string; price: number }> }> => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const breakdown: Array<{ date: string; price: number }> = [];
    let totalPrice = 0;

    const current = new Date(start);
    while (current < end) {
      const dateStr = current.toISOString().split('T')[0];
      const price = await seasonalPricingService.getPriceForDate(lodgingId, dateStr, basePrice);
      breakdown.push({ date: dateStr, price });
      totalPrice += price;
      current.setDate(current.getDate() + 1);
    }

    return { totalPrice, breakdown };
  },
};

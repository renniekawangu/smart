import React, { useState, useEffect } from 'react';
import { availabilityService } from '../services/availabilityService';

interface CalendarEvent {
  id: string;
  type: 'booking' | 'blocked';
  startDate: string;
  endDate: string;
  title: string;
  color: string;
}

interface CalendarComponentProps {
  lodgingId: string;
  onBlockDates?: (startDate: string, endDate: string) => void;
  onUnblockDate?: (blockedDateId: string) => void;
}

export const CalendarComponent: React.FC<CalendarComponentProps> = ({
  lodgingId,
  onBlockDates,
  onUnblockDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  useEffect(() => {
    fetchCalendarData();
  }, [lodgingId]);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      const data = await availabilityService.getCalendar(lodgingId);
      setEvents([...data.bookings, ...data.blockedDates]);
    } catch (error) {
      console.error('Failed to fetch calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isEventOnDate = (day: number): CalendarEvent | null => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.find(
      e => e.startDate <= dateStr && dateStr < e.endDate
    ) || null;
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

    if (!selectedDates.start) {
      setSelectedDates({ start: date, end: null });
    } else if (!selectedDates.end) {
      if (date < selectedDates.start) {
        setSelectedDates({ start: date, end: selectedDates.start });
      } else {
        setSelectedDates({ start: selectedDates.start, end: date });
      }
    } else {
      setSelectedDates({ start: date, end: null });
    }
  };

  const handleBlockPeriod = async () => {
    if (!selectedDates.start || !selectedDates.end) {
      alert('Please select a date range');
      return;
    }

    const startStr = selectedDates.start.toISOString().split('T')[0];
    const endStr = new Date(selectedDates.end.getTime() + 86400000).toISOString().split('T')[0];

    try {
      await availabilityService.blockDates(lodgingId, startStr, endStr, 'Manually blocked');
      alert('Dates blocked successfully');
      setSelectedDates({ start: null, end: null });
      fetchCalendarData();
      if (onBlockDates) onBlockDates(startStr, endStr);
    } catch (error) {
      console.error('Failed to block dates:', error);
      alert('Failed to block dates');
    }
  };

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl border border-white border-opacity-20 p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="text-white hover:text-blue-200 transition-colors"
          >
            ← Prev
          </button>
          <h2 className="text-white font-bold text-lg">{monthName}</h2>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="text-white hover:text-blue-200 transition-colors"
          >
            Next →
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-white text-xs font-semibold py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            const event = day ? isEventOnDate(day) : null;
            const isSelected =
              day &&
              selectedDates.start &&
              ((selectedDates.end &&
                day >= selectedDates.start.getDate() &&
                day <= selectedDates.end.getDate()) ||
                (!selectedDates.end && day === selectedDates.start.getDate()));

            return (
              <div
                key={idx}
                onClick={() => day && handleDateClick(day)}
                className={`h-10 flex items-center justify-center rounded text-sm cursor-pointer transition-all ${
                  day
                    ? `${
                        event
                          ? `bg-opacity-70 text-white`
                          : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
                      } ${isSelected ? 'border-2 border-blue-400' : ''}`
                    : 'bg-transparent'
                }`}
                style={event ? { backgroundColor: event.color } : {}}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#4CAF50' }}></div>
          <span className="text-gray-300">Confirmed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#FFC107' }}></div>
          <span className="text-gray-300">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#F44336' }}></div>
          <span className="text-gray-300">Blocked</span>
        </div>
      </div>

      {/* Block period section */}
      <div className="border-t border-white border-opacity-20 pt-4">
        <p className="text-white text-sm mb-2">
          Selected: {selectedDates.start && selectedDates.end
            ? `${selectedDates.start.toLocaleDateString()} - ${selectedDates.end.toLocaleDateString()}`
            : selectedDates.start
            ? `${selectedDates.start.toLocaleDateString()} (select end date)`
            : 'Click dates to select range'}
        </p>
        {selectedDates.start && selectedDates.end && (
          <button
            onClick={handleBlockPeriod}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition-all"
          >
            Block These Dates
          </button>
        )}
      </div>
    </div>
  );
};

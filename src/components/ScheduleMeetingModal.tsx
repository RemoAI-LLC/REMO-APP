import React, { useState } from 'react';
import LoadingScreen from './LoadingScreen';

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({ isOpen, onClose, userId }) => {
  const [attendees, setAttendees] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Parse attendees as array
    const attendeeList = attendees
      .split(',')
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    // Compose ISO datetime strings
    let startTime = '';
    let endTime = '';
    try {
      if (!date || !time) throw new Error('Date and time are required');
      // Accepts time as "14:00" or "2:00 pm" etc.
      const dateObj = new Date(`${date}T${time}`);
      if (isNaN(dateObj.getTime())) throw new Error('Invalid date or time');
      startTime = dateObj.toISOString();
      const endDateObj = new Date(dateObj.getTime() + duration * 60000);
      endTime = endDateObj.toISOString();
    } catch (err: any) {
      setError('Invalid date or time format');
      setIsLoading(false);
      return;
    }

    // Build query params for attendees (repeated)
    const attendeesParams = attendeeList.map((email) => `attendees=${encodeURIComponent(email)}`).join('&');
    const url = `${API_BASE_URL}/calendar/create-event?user_id=${encodeURIComponent(userId)}&subject=${encodeURIComponent(subject)}&start_time=${encodeURIComponent(startTime)}&end_time=${encodeURIComponent(endTime)}&${attendeesParams}&location=${encodeURIComponent(location)}&description=${encodeURIComponent(description)}`;

    try {
      const res = await fetch(url, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(`Meeting scheduled! Event link: ${data.event_link}`);
      } else {
        setError(data.detail || data.message || 'Failed to schedule meeting');
      }
    } catch (err) {
      setError('Network or server error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Schedule a Meeting</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">✕</button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Attendees (comma-separated emails)</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={attendees} onChange={e => setAttendees(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={subject} onChange={e => setSubject(e.target.value)} required />
          </div>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Date</label>
              <input type="date" className="w-full border rounded px-3 py-2" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Time</label>
              <input type="time" className="w-full border rounded px-3 py-2" value={time} onChange={e => setTime(e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={duration} min={1} onChange={e => setDuration(Number(e.target.value))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location (optional)</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={location} onChange={e => setLocation(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description (optional)</label>
            <textarea className="w-full border rounded px-3 py-2" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          {error && <div className="bg-red-100 text-red-700 rounded p-2 text-sm">{error}</div>}
          {success && <div className="bg-green-100 text-green-700 rounded p-2 text-sm">{success}</div>}
                  <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 relative" disabled={isLoading}>
          {isLoading ? (
            <>
              <LoadingScreen 
                isVisible={isLoading}
                message="Scheduling..."
                variant="inline"
                size="small"
                showLogo={false}
              />
            </>
          ) : (
            'Schedule Meeting'
          )}
        </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleMeetingModal; 
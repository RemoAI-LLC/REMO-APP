import React, { useState, useEffect } from 'react';
import { FaBell, FaCheckSquare, FaCalendarAlt, FaPlus, FaTrash, FaEdit, FaSync } from 'react-icons/fa';
import { MdSchedule } from 'react-icons/md';

interface Reminder {
  id: string;
  description: string;
  time: string;
  date: string;
  completed: boolean;
}

interface Todo {
  id: string;
  task: string;
  priority: 'high' | 'medium' | 'low';
  due_date?: string;
  completed: boolean;
  category?: string;
}

interface Meeting {
  id: string;
  subject: string;
  start_time: string;
  end_time: string;
  attendees: string[];
  location?: string;
  description?: string;
}

const Dashboard: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState<'reminder' | 'todo' | 'meeting'>('reminder');
  const [userId, setUserId] = useState<string>('');

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Get user ID from localStorage or context
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId') || 'test_user_123';
    setUserId(storedUserId);
  }, []);

  // Fetch data from API
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch reminders
        const remindersResponse = await fetch(`${API_BASE_URL}/user/${userId}/reminders`);
        if (remindersResponse.ok) {
          const remindersData = await remindersResponse.json();
          setReminders(remindersData.reminders || []);
        }

        // Fetch todos
        const todosResponse = await fetch(`${API_BASE_URL}/user/${userId}/todos`);
        if (todosResponse.ok) {
          const todosData = await todosResponse.json();
          setTodos(todosData.todos || []);
        }

        // Fetch meetings
        const meetingsResponse = await fetch(`${API_BASE_URL}/user/${userId}/meetings`);
        if (meetingsResponse.ok) {
          const meetingsData = await meetingsResponse.json();
          setMeetings(meetingsData.meetings || []);
        }

        // If no data from API, use mock data for demonstration
        if (!reminders.length && !todos.length && !meetings.length) {
          setReminders([
            {
              id: '1',
              description: 'Team meeting at 10 AM',
              time: '10:00',
              date: '2024-01-15',
              completed: false
            },
            {
              id: '2',
              description: 'Submit project report',
              time: '17:00',
              date: '2024-01-15',
              completed: true
            },
            {
              id: '3',
              description: 'Call client',
              time: '14:30',
              date: '2024-01-16',
              completed: false
            }
          ]);

          setTodos([
            {
              id: '1',
              task: 'Review project documentation',
              priority: 'high',
              due_date: '2024-01-15',
              completed: false,
              category: 'work'
            },
            {
              id: '2',
              task: 'Update portfolio',
              priority: 'medium',
              due_date: '2024-01-17',
              completed: false,
              category: 'personal'
            },
            {
              id: '3',
              task: 'Buy groceries',
              priority: 'low',
              completed: true,
              category: 'personal'
            }
          ]);

          setMeetings([
            {
              id: '1',
              subject: 'Weekly Team Standup',
              start_time: '2024-01-15T10:00:00Z',
              end_time: '2024-01-15T10:30:00Z',
              attendees: ['john@example.com', 'jane@example.com'],
              location: 'Conference Room A'
            },
            {
              id: '2',
              subject: 'Client Presentation',
              start_time: '2024-01-16T14:00:00Z',
              end_time: '2024-01-16T15:00:00Z',
              attendees: ['client@example.com'],
              location: 'Virtual Meeting'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Use mock data as fallback
        setReminders([
          {
            id: '1',
            description: 'Team meeting at 10 AM',
            time: '10:00',
            date: '2024-01-15',
            completed: false
          }
        ]);
        setTodos([
          {
            id: '1',
            task: 'Review project documentation',
            priority: 'high',
            due_date: '2024-01-15',
            completed: false,
            category: 'work'
          }
        ]);
        setMeetings([
          {
            id: '1',
            subject: 'Weekly Team Standup',
            start_time: '2024-01-15T10:00:00Z',
            end_time: '2024-01-15T10:30:00Z',
            attendees: ['john@example.com', 'jane@example.com'],
            location: 'Conference Room A'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, API_BASE_URL]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTodaysItems = () => {
    const today = new Date().toISOString().split('T')[0];
    return {
      reminders: reminders.filter(r => r.date === today && !r.completed),
      todos: todos.filter(t => t.due_date === today && !t.completed),
      meetings: meetings.filter(m => m.start_time.startsWith(today))
    };
  };

  const todaysItems = getTodaysItems();

  const refreshData = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      
      // Fetch reminders
      const remindersResponse = await fetch(`${API_BASE_URL}/user/${userId}/reminders`);
      if (remindersResponse.ok) {
        const remindersData = await remindersResponse.json();
        setReminders(remindersData.reminders || []);
      }

      // Fetch todos
      const todosResponse = await fetch(`${API_BASE_URL}/user/${userId}/todos`);
      if (todosResponse.ok) {
        const todosData = await todosResponse.json();
        setTodos(todosData.todos || []);
      }

      // Fetch meetings
      const meetingsResponse = await fetch(`${API_BASE_URL}/user/${userId}/meetings`);
      if (meetingsResponse.ok) {
        const meetingsData = await meetingsResponse.json();
        setMeetings(meetingsData.meetings || []);
      }
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your reminders, todos, and meetings in one place
            </p>
          </div>
          <button
            onClick={refreshData}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaSync className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <FaBell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Reminders</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {reminders.filter(r => !r.completed).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <FaCheckSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Todos</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {todos.filter(t => !t.completed).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <FaCalendarAlt className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Meetings</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {todaysItems.meetings.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reminders Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <FaBell className="mr-2 text-blue-600 dark:text-blue-400" />
                  Reminders
                </h2>
                <button
                  onClick={() => {
                    setModalType('reminder');
                    setShowAddModal(true);
                  }}
                  className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  <FaPlus className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              {todaysItems.reminders.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No reminders for today
                </p>
              ) : (
                <div className="space-y-3">
                  {todaysItems.reminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={reminder.completed}
                          onChange={() => {
                            setReminders(prev =>
                              prev.map(r =>
                                r.id === reminder.id ? { ...r, completed: !r.completed } : r
                              )
                            );
                          }}
                          className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <p className={`font-medium ${reminder.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                            {reminder.description}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {reminder.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                          <FaEdit className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Todos Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <FaCheckSquare className="mr-2 text-green-600 dark:text-green-400" />
                  Todos
                </h2>
                <button
                  onClick={() => {
                    setModalType('todo');
                    setShowAddModal(true);
                  }}
                  className="p-2 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                >
                  <FaPlus className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              {todaysItems.todos.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No todos due today
                </p>
              ) : (
                <div className="space-y-3">
                  {todaysItems.todos.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => {
                            setTodos(prev =>
                              prev.map(t =>
                                t.id === todo.id ? { ...t, completed: !t.completed } : t
                              )
                            );
                          }}
                          className="mr-3 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <div>
                          <p className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                            {todo.task}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                              {todo.priority}
                            </span>
                            {todo.category && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {todo.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400">
                          <FaEdit className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Meetings Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <FaCalendarAlt className="mr-2 text-purple-600 dark:text-purple-400" />
                  Today's Meetings
                </h2>
                <button
                  onClick={() => {
                    setModalType('meeting');
                    setShowAddModal(true);
                  }}
                  className="p-2 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                >
                  <FaPlus className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              {todaysItems.meetings.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No meetings scheduled today
                </p>
              ) : (
                <div className="space-y-3">
                  {todaysItems.meetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {meeting.subject}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {formatTime(meeting.start_time)} - {formatTime(meeting.end_time)}
                          </p>
                          {meeting.location && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              📍 {meeting.location}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            👥 {meeting.attendees.length} attendees
                          </p>
                        </div>
                        <div className="flex space-x-2 ml-2">
                          <button className="p-1 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                            <FaEdit className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <MdSchedule className="mr-2 text-indigo-600 dark:text-indigo-400" />
              Calendar View
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                  {day}
                </div>
              ))}
              
              {/* Calendar days would go here */}
              {Array.from({ length: 35 }, (_, i) => {
                const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
                date.setDate(date.getDate() + i - date.getDay());
                
                const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
                const isToday = date.toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={i}
                    className={`p-2 min-h-[80px] border border-gray-200 dark:border-gray-700 ${
                      isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'
                    } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <div className={`text-sm ${isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                      {date.getDate()}
                    </div>
                    {/* Event indicators would go here */}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal (placeholder) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add New {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This is a placeholder for the add {modalType} form.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 
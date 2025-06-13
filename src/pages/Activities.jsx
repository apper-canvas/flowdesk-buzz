import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import activityService from '../services/api/activityService';
import contactService from '../services/api/contactService';
import dealService from '../services/api/dealService';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [filterType, setFilterType] = useState('');
  const [filterContact, setFilterContact] = useState('');
  const [formData, setFormData] = useState({
    type: 'call',
    subject: '',
    description: '',
    contactId: '',
    dealId: '',
    date: new Date().toISOString().slice(0, 16),
    duration: ''
  });

  const activityTypes = [
    { id: 'call', name: 'Call', icon: 'Phone', color: 'bg-blue-500' },
    { id: 'email', name: 'Email', icon: 'Mail', color: 'bg-green-500' },
    { id: 'meeting', name: 'Meeting', icon: 'Calendar', color: 'bg-purple-500' },
    { id: 'note', name: 'Note', icon: 'FileText', color: 'bg-gray-500' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [activitiesData, contactsData, dealsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ]);
      setActivities(activitiesData);
      setContacts(contactsData);
      setDeals(dealsData);
    } catch (err) {
      setError(err.message || 'Failed to load activities');
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject.trim()) {
      toast.error('Subject is required');
      return;
    }

    const activityData = {
      ...formData,
      duration: parseInt(formData.duration) || 0
    };

    try {
      if (selectedActivity) {
        const updated = await activityService.update(selectedActivity.id, activityData);
        setActivities(prev => prev.map(a => a.id === selectedActivity.id ? updated : a));
        toast.success('Activity updated successfully');
      } else {
        const created = await activityService.create(activityData);
        setActivities(prev => [created, ...prev]);
        toast.success('Activity logged successfully');
        setIsCreating(false);
      }
      
      setFormData({
        type: 'call',
        subject: '',
        description: '',
        contactId: '',
        dealId: '',
        date: new Date().toISOString().slice(0, 16),
        duration: ''
      });
      setSelectedActivity(null);
    } catch (err) {
      toast.error(err.message || 'Failed to save activity');
    }
  };

  const handleDelete = async (activity) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;
    
    try {
      await activityService.delete(activity.id);
      setActivities(prev => prev.filter(a => a.id !== activity.id));
      setSelectedActivity(null);
      toast.success('Activity deleted successfully');
    } catch (err) {
      toast.error('Failed to delete activity');
    }
  };

  const openEditForm = (activity) => {
    setSelectedActivity(activity);
    setFormData({
      type: activity.type || 'call',
      subject: activity.subject || '',
      description: activity.description || '',
      contactId: activity.contactId || '',
      dealId: activity.dealId || '',
      date: activity.date ? new Date(activity.date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      duration: activity.duration?.toString() || ''
    });
    setIsCreating(false);
  };

  const openCreateForm = () => {
    setIsCreating(true);
    setSelectedActivity(null);
    setFormData({
      type: 'call',
      subject: '',
      description: '',
      contactId: '',
      dealId: '',
      date: new Date().toISOString().slice(0, 16),
      duration: ''
    });
  };

  const closeForm = () => {
    setIsCreating(false);
    setSelectedActivity(null);
    setFormData({
      type: 'call',
      subject: '',
      description: '',
      contactId: '',
      dealId: '',
      date: new Date().toISOString().slice(0, 16),
      duration: ''
    });
  };

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    const matchesType = !filterType || activity.type === filterType;
    const matchesContact = !filterContact || activity.contactId === filterContact;
    return matchesType && matchesContact;
  });

  // Sort activities by date (newest first)
  const sortedActivities = filteredActivities.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg p-12 text-center shadow-sm">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Activities</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Activities</h1>
          <p className="text-gray-600">Track all customer interactions</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          <span>Log Activity</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Types</option>
              {activityTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-64">
            <select
              value={filterContact}
              onChange={(e) => setFilterContact(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Contacts</option>
              {contacts.map(contact => (
                <option key={contact.id} value={contact.id}>{contact.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Activities Timeline */}
      <div className="space-y-4">
        {sortedActivities.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm">
            <ApperIcon name="Clock" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {activities.length === 0 ? 'No activities yet' : 'No activities match your filters'}
            </h3>
            <p className="text-gray-600 mb-4">
              {activities.length === 0 
                ? 'Start logging your customer interactions'
                : 'Try adjusting your filters'
              }
            </p>
            {activities.length === 0 && (
              <button
                onClick={openCreateForm}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Log First Activity
              </button>
            )}
          </div>
        ) : (
          sortedActivities.map((activity, index) => {
            const contact = contacts.find(c => c.id === activity.contactId);
            const deal = deals.find(d => d.id === activity.dealId);
            const activityType = activityTypes.find(t => t.id === activity.type);
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-transparent hover:border-primary"
                onClick={() => openEditForm(activity)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${activityType?.color || 'bg-gray-500'} rounded-full flex items-center justify-center`}>
                    <ApperIcon 
                      name={activityType?.icon || 'Clock'} 
                      className="w-6 h-6 text-white" 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {activity.subject || 'No subject'}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                          <span className="capitalize">{activity.type}</span>
                          {contact && (
                            <span className="flex items-center space-x-1">
                              <ApperIcon name="User" className="w-4 h-4" />
                              <span>{contact.name}</span>
                            </span>
                          )}
                          {deal && (
                            <span className="flex items-center space-x-1">
                              <ApperIcon name="Target" className="w-4 h-4" />
                              <span>{deal.title}</span>
                            </span>
                          )}
                          <span className="flex items-center space-x-1">
                            <ApperIcon name="Clock" className="w-4 h-4" />
                            <span>
                              {format(new Date(activity.date), 'MMM d, yyyy h:mm a')}
                            </span>
                          </span>
                          {activity.duration > 0 && (
                            <span>{activity.duration} min</span>
                          )}
                        </div>
                        {activity.description && (
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {activity.description}
                          </p>
                        )}
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(activity);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Activity Form Modal */}
      <AnimatePresence>
        {(isCreating || selectedActivity) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={closeForm}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {isCreating ? 'Log Activity' : 'Edit Activity'}
                  </h2>
                  <button
                    onClick={closeForm}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {activityTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact
                    </label>
                    <select
                      value={formData.contactId}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select contact...</option>
                      {contacts.map(contact => (
                        <option key={contact.id} value={contact.id}>{contact.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Related Deal
                    </label>
                    <select
                      value={formData.dealId}
                      onChange={(e) => setFormData(prev => ({ ...prev, dealId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select deal...</option>
                      {deals.map(deal => (
                        <option key={deal.id} value={deal.id}>{deal.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      {isCreating ? 'Log Activity' : 'Update Activity'}
                    </button>
                    <button
                      type="button"
                      onClick={closeForm}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Activities;
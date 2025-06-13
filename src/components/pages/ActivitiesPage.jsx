import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns'; // date-fns is already used, keep it
import ApperIcon from '@/components/ApperIcon';
import activityService from '@/services/api/activityService';
import contactService from '@/services/api/contactService';
import dealService from '@/services/api/dealService';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import ErrorState from '@/components/molecules/ErrorState';
import ActivityList from '@/components/organisms/ActivityList';
import ActivityForm from '@/components/organisms/ActivityForm';


function ActivitiesPage() {
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


  if (loading) {
    return (
      &lt;div className="p-6 max-w-7xl mx-auto">
        &lt;div className="animate-pulse">
          &lt;div className="h-8 bg-gray-200 rounded w-1/4 mb-8">&lt;/div>
          &lt;div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              &lt;div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                &lt;div className="flex items-start space-x-4">
                  &lt;div className="w-10 h-10 bg-gray-200 rounded-full">&lt;/div>
                  &lt;div className="flex-1">
                    &lt;div className="h-4 bg-gray-200 rounded w-1/3 mb-2">&lt;/div>
                    &lt;div className="h-4 bg-gray-200 rounded w-1/2">&lt;/div>
                  &lt;/div>
                &lt;/div>
              &lt;/div>
            ))}
          &lt;/div>
        &lt;/div>
      &lt;/div>
    );
  }

  if (error) {
    return (
      &lt;ErrorState
        title="Error Loading Activities"
        message={error}
        onRetry={loadData}
      />
    );
  }

  return (
    &lt;div className="p-6 max-w-7xl mx-auto">
      &lt;div className="flex items-center justify-between mb-6">
        &lt;div>
          &lt;Heading level={1} className="text-3xl font-bold text-gray-900 mb-2">Activities&lt;/Heading>
          &lt;Text variant="p" className="text-gray-600">Track all customer interactions&lt;/Text>
        &lt;/div>
        &lt;Button variant="primary" onClick={openCreateForm} className="space-x-2">
          &lt;ApperIcon name="Plus" className="w-5 h-5" />
          &lt;span>Log Activity&lt;/span>
        &lt;/Button>
      &lt;/div>

      &lt;ActivityList
        activities={activities}
        filteredActivities={filteredActivities}
        contacts={contacts}
        deals={deals}
        filterType={filterType}
        setFilterType={setFilterType}
        filterContact={filterContact}
        setFilterContact={setFilterContact}
        activityTypes={activityTypes}
        openCreateForm={openCreateForm}
        openEditForm={openEditForm}
        handleDelete={handleDelete}
      />

      &lt;ActivityForm
        selectedActivity={selectedActivity}
        isCreating={isCreating}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        closeForm={closeForm}
        contacts={contacts}
        deals={deals}
        activityTypes={activityTypes}
      />
    &lt;/div>
  );
}

export default ActivitiesPage;
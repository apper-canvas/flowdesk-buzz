import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import contactService from '../services/api/contactService';
import dealService from '../services/api/dealService';
import activityService from '../services/api/activityService';

function MainFeature() {
  const navigate = useNavigate();
  const [recentContacts, setRecentContacts] = useState([]);
  const [activeDeals, setActiveDeals] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [contacts, deals, activities] = await Promise.all([
          contactService.getAll(),
          dealService.getAll(),
          activityService.getAll()
        ]);

        // Get recent contacts (last 3)
        const sortedContacts = contacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentContacts(sortedContacts.slice(0, 3));

        // Get active deals (not won/lost)
        const activeDealsList = deals.filter(deal => !['won', 'lost'].includes(deal.stage.toLowerCase()));
        setActiveDeals(activeDealsList.slice(0, 3));

        // Get recent activities (last 5)
        const sortedActivities = activities.sort((a, b) => new Date(b.date) - new Date(a.date));
        setRecentActivities(sortedActivities.slice(0, 5));
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const totalRevenue = activeDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
  const avgDealValue = activeDeals.length > 0 ? totalRevenue / activeDeals.length : 0;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Skeleton for metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        
        {/* Skeleton for content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg p-12 text-center shadow-sm">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
          Welcome to FlowDesk CRM
        </h1>
        <p className="text-gray-600">
          Manage your customer relationships and track sales opportunities
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-primary"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Contacts</p>
              <p className="text-2xl font-bold text-gray-900">{recentContacts.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="w-6 h-6 text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-accent"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Deals</p>
              <p className="text-2xl font-bold text-gray-900">{activeDeals.length}</p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Target" className="w-6 h-6 text-accent" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-secondary"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" className="w-6 h-6 text-secondary" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Contacts</h2>
            <button
              onClick={() => navigate('/contacts')}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              View All
            </button>
          </div>

          {recentContacts.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Users" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-3">No contacts yet</p>
              <button
                onClick={() => navigate('/contacts')}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Add First Contact
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentContacts.map((contact, index) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate('/contacts')}
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {contact.name?.charAt(0)?.toUpperCase() || 'N'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {contact.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {contact.company || contact.email || 'No details'}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Active Deals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Active Deals</h2>
            <button
              onClick={() => navigate('/deals')}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              View Pipeline
            </button>
          </div>

          {activeDeals.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Target" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-3">No active deals</p>
              <button
                onClick={() => navigate('/deals')}
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
              >
                Create First Deal
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeDeals.map((deal, index) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate('/deals')}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {deal.title || 'Untitled Deal'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {deal.stage || 'No stage'} • {deal.probability || 0}% probability
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-accent">
                      ${(deal.value || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {deal.expectedClose ? new Date(deal.expectedClose).toLocaleDateString() : 'No date'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white"
      >
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/contacts')}
            className="flex items-center space-x-3 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <ApperIcon name="UserPlus" className="w-6 h-6" />
            <span className="font-medium">Add Contact</span>
          </button>
          <button
            onClick={() => navigate('/deals')}
            className="flex items-center space-x-3 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <ApperIcon name="Plus" className="w-6 h-6" />
            <span className="font-medium">Create Deal</span>
          </button>
          <button
            onClick={() => navigate('/activities')}
            className="flex items-center space-x-3 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <ApperIcon name="Calendar" className="w-6 h-6" />
            <span className="font-medium">Log Activity</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default MainFeature;
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import contactService from '@/services/api/contactService';
import dealService from '@/services/api/dealService';
import activityService from '@/services/api/activityService';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import ActiveDealsList from '@/components/organisms/ActiveDealsList';
import RecentContactsList from '@/components/organisms/RecentContactsList';
import QuickActions from '@/components/organisms/QuickActions';

function HomePage() {
  const [recentContacts, setRecentContacts] = useState([]);
  const [activeDeals, setActiveDeals] = useState([]);
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
        const activeDealsList = deals.filter(deal => !['won', 'lost'].includes(deal.stage?.toLowerCase() || ''));
        setActiveDeals(activeDealsList.slice(0, 3));
        
        // No longer need recent activities on home page as per MainFeature analysis
        // const sortedActivities = activities.sort((a, b) => new Date(b.date) - new Date(a.date));
        // setRecentActivities(sortedActivities.slice(0, 5));
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
  // const avgDealValue = activeDeals.length > 0 ? totalRevenue / activeDeals.length : 0; // Not used in UI

  if (loading) {
    return (
      &lt;div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Skeleton for metrics */}
        &lt;div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            &lt;div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              &lt;div className="h-4 bg-gray-200 rounded w-1/2 mb-2">&lt;/div>
              &lt;div className="h-8 bg-gray-200 rounded w-3/4">&lt;/div>
            &lt;/div>
          ))}
        &lt;/div>
        
        {/* Skeleton for content */}
        &lt;div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            &lt;div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              &lt;div className="h-6 bg-gray-200 rounded w-1/3 mb-4">&lt;/div>
              &lt;div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  &lt;div key={j} className="h-16 bg-gray-200 rounded">&lt;/div>
                ))}
              &lt;/div>
            &lt;/div>
          ))}
        &lt;/div>
      &lt;/div>
    );
  }

  if (error) {
    return (
      &lt;div className="max-w-7xl mx-auto p-6">
        &lt;div className="bg-white rounded-lg p-12 text-center shadow-sm">
          &lt;ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          &lt;Heading level={3} className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Dashboard&lt;/Heading>
          &lt;Text variant="p" className="text-gray-600 mb-4">{error}&lt;/Text>
          &lt;Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          &lt;/Button>
        &lt;/div>
      &lt;/div>
    );
  }

  return (
    &lt;div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      &lt;div className="mb-8">
        &lt;Heading level={1} className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to FlowDesk CRM
        &lt;/Heading>
        &lt;Text variant="p" className="text-gray-600">
          Manage your customer relationships and track sales opportunities
        &lt;/Text>
      &lt;/div>

      {/* Key Metrics - Simplified for HomePage */}
      &lt;div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        &lt;motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-primary"
        >
          &lt;div className="flex items-center justify-between">
            &lt;div>
              &lt;Text variant="p" className="text-sm font-medium text-gray-600">Total Contacts&lt;/Text>
              &lt;Heading level={2} className="text-2xl font-bold text-gray-900">{recentContacts.length}&lt;/Heading>
            &lt;/div>
            &lt;div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              &lt;ApperIcon name="Users" className="w-6 h-6 text-primary" />
            &lt;/div>
          &lt;/div>
        &lt;/motion.div>

        &lt;motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-accent"
        >
          &lt;div className="flex items-center justify-between">
            &lt;div>
              &lt;Text variant="p" className="text-sm font-medium text-gray-600">Active Deals&lt;/Text>
              &lt;Heading level={2} className="text-2xl font-bold text-gray-900">{activeDeals.length}&lt;/Heading>
            &lt;/div>
            &lt;div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              &lt;ApperIcon name="Target" className="w-6 h-6 text-accent" />
            &lt;/div>
          &lt;/div>
        &lt;/motion.div>

        &lt;motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-secondary"
        >
          &lt;div className="flex items-center justify-between">
            &lt;div>
              &lt;Text variant="p" className="text-sm font-medium text-gray-600">Pipeline Value&lt;/Text>
              &lt;Heading level={2} className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}&lt;/Heading>
            &lt;/div>
            &lt;div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              &lt;ApperIcon name="DollarSign" className="w-6 h-6 text-secondary" />
            &lt;/div>
          &lt;/div>
        &lt;/motion.div>
      &lt;/div>

      {/* Main Content */}
      &lt;div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        &lt;RecentContactsList contacts={recentContacts} />
        &lt;ActiveDealsList deals={activeDeals} />
      &lt;/div>

      {/* Quick Actions */}
      &lt;QuickActions delay={0.7} />
    &lt;/div>
  );
}

export default HomePage;
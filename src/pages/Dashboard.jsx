import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import contactService from '../services/api/contactService';
import dealService from '../services/api/dealService';
import activityService from '../services/api/activityService';

function Dashboard() {
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [contactsData, dealsData, activitiesData] = await Promise.all([
          contactService.getAll(),
          dealService.getAll(),
          activityService.getAll()
        ]);
        setContacts(contactsData);
        setDeals(dealsData);
        setActivities(activitiesData);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate metrics
  const totalContacts = contacts.length;
  const activeDeals = deals.filter(deal => !['won', 'lost'].includes(deal.stage?.toLowerCase() || ''));
  const wonDeals = deals.filter(deal => deal.stage?.toLowerCase() === 'won');
  const totalRevenue = activeDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
  const closedRevenue = wonDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);

  // Chart data for deals by stage
  const dealStages = deals.reduce((acc, deal) => {
    const stage = deal.stage || 'Unknown';
    acc[stage] = (acc[stage] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    series: Object.values(dealStages),
    options: {
      chart: {
        type: 'donut',
        fontFamily: 'Inter, sans-serif'
      },
      labels: Object.keys(dealStages),
      colors: ['#5B21B6', '#7C3AED', '#10B981', '#F59E0B', '#EF4444'],
      legend: {
        position: 'bottom'
      },
      plotOptions: {
        pie: {
          donut: {
            size: '60%'
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm h-96">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm h-96">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your CRM performance and key metrics</p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-primary"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Contacts</p>
              <p className="text-2xl font-bold text-gray-900">{totalContacts}</p>
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-info"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Closed Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${closedRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-info" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deal Pipeline Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Deals by Stage</h2>
          {Object.keys(dealStages).length > 0 ? (
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="donut"
              height={300}
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <ApperIcon name="PieChart" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>No deals to display</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
          {activities.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <ApperIcon name="Clock" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>No activities yet</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {activities
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 10)
                .map((activity, index) => {
                  const contact = contacts.find(c => c.id === activity.contactId);
                  const activityIcons = {
                    email: 'Mail',
                    call: 'Phone',
                    meeting: 'Calendar',
                    note: 'FileText'
                  };
                  
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <ApperIcon 
                          name={activityIcons[activity.type] || 'Activity'} 
                          className="w-4 h-4 text-primary" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.subject || `${activity.type} activity`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {contact?.name || 'Unknown contact'} • {new Date(activity.date).toLocaleDateString()}
                        </p>
                        {activity.description && (
                          <p className="text-xs text-gray-400 mt-1 truncate">
                            {activity.description}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import contactService from '@/services/api/contactService';
import dealService from '@/services/api/dealService';
import activityService from '@/services/api/activityService';
import DashboardMetrics from '@/components/organisms/DashboardMetrics';
import RecentActivityFeed from '@/components/organisms/RecentActivityFeed';
import ErrorState from '@/components/molecules/ErrorState';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';

function DashboardPage() {
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
      colors: ['#5B21B6', '#7C3AED', '#10B981', '#F59E0B', '#EF4444'], // Primary, Secondary, Accent, Warning, Danger (simplified mapping)
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
      &lt;div className="p-6 max-w-7xl mx-auto">
        &lt;div className="animate-pulse">
          &lt;div className="h-8 bg-gray-200 rounded w-1/4 mb-8">&lt;/div>
          
          &lt;div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              &lt;div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                &lt;div className="h-4 bg-gray-200 rounded w-1/2 mb-2">&lt;/div>
                &lt;div className="h-8 bg-gray-200 rounded w-3/4">&lt;/div>
              &lt;/div>
            ))}
          &lt;/div>

          &lt;div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            &lt;div className="bg-white rounded-lg p-6 shadow-sm h-96">
              &lt;div className="h-6 bg-gray-200 rounded w-1/3 mb-4">&lt;/div>
              &lt;div className="h-64 bg-gray-200 rounded">&lt;/div>
            &lt;/div>
            &lt;div className="bg-white rounded-lg p-6 shadow-sm h-96">
              &lt;div className="h-6 bg-gray-200 rounded w-1/3 mb-4">&lt;/div>
              &lt;div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  &lt;div key={i} className="h-12 bg-gray-200 rounded">&lt;/div>
                ))}
              &lt;/div>
            &lt;/div>
          &lt;/div>
        &lt;/div>
      &lt;/div>
    );
  }

  if (error) {
    return (
      &lt;ErrorState
        title="Error Loading Dashboard"
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    &lt;div className="p-6 max-w-7xl mx-auto space-y-6">
      &lt;DashboardMetrics
        totalContacts={totalContacts}
        activeDealsCount={activeDeals.length}
        totalRevenue={totalRevenue}
        closedRevenue={closedRevenue}
      />

      {/* Charts and Lists */}
      &lt;div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deal Pipeline Chart */}
        &lt;motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          &lt;Heading level={2} className="text-lg font-semibold text-gray-900 mb-4">Deals by Stage&lt;/Heading>
          {Object.keys(dealStages).length > 0 ? (
            &lt;Chart
              options={chartData.options}
              series={chartData.series}
              type="donut"
              height={300}
            />
          ) : (
            &lt;div className="h-64 flex items-center justify-center text-gray-500">
              &lt;div className="text-center">
                &lt;ApperIcon name="PieChart" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                &lt;Text variant="p">No deals to display&lt;/Text>
              &lt;/div>
            &lt;/div>
          )}
        &lt;/motion.div>

        &lt;RecentActivityFeed activities={activities} contacts={contacts} />
      &lt;/div>
    &lt;/div>
  );
}

export default DashboardPage;
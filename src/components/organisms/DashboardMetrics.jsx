import MetricCard from '@/components/molecules/MetricCard';
import { motion } from 'framer-motion';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';

const DashboardMetrics = ({ totalContacts, activeDealsCount, totalRevenue, closedRevenue }) => {
  return (
    &lt;>
      &lt;motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        &lt;Heading level={1} className="text-3xl font-bold text-gray-900 mb-2">Dashboard&lt;/Heading>
        &lt;Text variant="p" className="text-gray-600">Overview of your CRM performance and key metrics&lt;/Text>
      &lt;/motion.div>

      &lt;div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        &lt;MetricCard
          title="Total Contacts"
          value={totalContacts}
          icon="Users"
          iconColorClass="bg-primary/10"
          borderColorClass="border-primary"
          delay={0.1}
        />
        &lt;MetricCard
          title="Active Deals"
          value={activeDealsCount}
          icon="Target"
          iconColorClass="bg-accent/10"
          borderColorClass="border-accent"
          delay={0.2}
        />
        &lt;MetricCard
          title="Pipeline Value"
          value={`$${totalRevenue.toLocaleString()}`}
          icon="DollarSign"
          iconColorClass="bg-secondary/10"
          borderColorClass="border-secondary"
          delay={0.3}
        />
        &lt;MetricCard
          title="Closed Revenue"
          value={`$${closedRevenue.toLocaleString()}`}
          icon="TrendingUp"
          iconColorClass="bg-info/10"
          borderColorClass="border-info"
          delay={0.4}
        />
      &lt;/div>
    &lt;/>
  );
};

export default DashboardMetrics;
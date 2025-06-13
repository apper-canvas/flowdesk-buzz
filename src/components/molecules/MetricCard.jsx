import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Heading from '@/components/atoms/Heading';

const MetricCard = ({ title, value, icon, iconColorClass, borderColorClass, delay }) => {
  return (
    &lt;motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-white rounded-lg p-6 shadow-sm border-l-4 ${borderColorClass}`}
    >
      &lt;div className="flex items-center justify-between">
        &lt;div>
          &lt;Text variant="p" className="text-sm font-medium text-gray-600">{title}&lt;/Text>
          &lt;Heading level={2} className="text-2xl font-bold text-gray-900">{value}&lt;/Heading>
        &lt;/div>
        &lt;div className={`w-12 h-12 ${iconColorClass} rounded-lg flex items-center justify-center`}>
          &lt;ApperIcon name={icon} className="w-6 h-6 text-current" />
        &lt;/div>
      &lt;/div>
    &lt;/motion.div>
  );
};

export default MetricCard;
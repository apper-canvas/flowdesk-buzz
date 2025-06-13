import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const ActiveDealsList = ({ deals }) => {
  const navigate = useNavigate();

  return (
    &lt;motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-lg p-6 shadow-sm"
    >
      &lt;div className="flex items-center justify-between mb-4">
        &lt;Heading level={2} className="text-lg font-semibold text-gray-900">Active Deals&lt;/Heading>
        &lt;Button
          variant="ghost"
          className="text-sm text-primary hover:text-primary/80 font-medium"
          onClick={() => navigate('/deals')}
        >
          View Pipeline
        &lt;/Button>
      &lt;/div>

      {deals.length === 0 ? (
        &lt;div className="text-center py-8">
          &lt;ApperIcon name="Target" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          &lt;Text variant="p" className="text-gray-500 mb-3">No active deals&lt;/Text>
          &lt;Button variant="secondary" onClick={() => navigate('/deals')}>
            Create First Deal
          &lt;/Button>
        &lt;/div>
      ) : (
        &lt;div className="space-y-3">
          {deals.map((deal, index) => (
            &lt;motion.div
              key={deal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => navigate('/deals')}
            >
              &lt;div className="flex-1 min-w-0">
                &lt;Text variant="p" className="text-sm font-medium text-gray-900 truncate">
                  {deal.title || 'Untitled Deal'}
                &lt;/Text>
                &lt;Text variant="span" className="text-xs text-gray-500">
                  {deal.stage || 'No stage'} • {deal.probability || 0}% probability
                &lt;/Text>
              &lt;/div>
              &lt;div className="text-right">
                &lt;Text variant="p" className="text-sm font-semibold text-accent">
                  ${(deal.value || 0).toLocaleString()}
                &lt;/Text>
                &lt;Text variant="span" className="text-xs text-gray-400">
                  {deal.expectedClose ? new Date(deal.expectedClose).toLocaleDateString() : 'No date'}
                &lt;/Text>
              &lt;/div>
            &lt;/motion.div>
          ))}
        &lt;/div>
      )}
    &lt;/motion.div>
  );
};

export default ActiveDealsList;
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';

const QuickActions = ({ delay }) => {
  const navigate = useNavigate();

  return (
    &lt;motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white"
    >
      &lt;Heading level={2} className="text-xl font-semibold mb-4">Quick Actions&lt;/Heading>
      &lt;div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        &lt;Button
          variant="ghost"
          className="flex items-center space-x-3 p-4 bg-white/10 rounded-lg hover:bg-white/20"
          onClick={() => navigate('/contacts')}
        >
          &lt;ApperIcon name="UserPlus" className="w-6 h-6" />
          &lt;span className="font-medium">Add Contact&lt;/span>
        &lt;/Button>
        &lt;Button
          variant="ghost"
          className="flex items-center space-x-3 p-4 bg-white/10 rounded-lg hover:bg-white/20"
          onClick={() => navigate('/deals')}
        >
          &lt;ApperIcon name="Plus" className="w-6 h-6" />
          &lt;span className="font-medium">Create Deal&lt;/span>
        &lt;/Button>
        &lt;Button
          variant="ghost"
          className="flex items-center space-x-3 p-4 bg-white/10 rounded-lg hover:bg-white/20"
          onClick={() => navigate('/activities')}
        >
          &lt;ApperIcon name="Calendar" className="w-6 h-6" />
          &lt;span className="font-medium">Log Activity&lt;/span>
        &lt;/Button>
      &lt;/div>
    &lt;/motion.div>
  );
};

export default QuickActions;
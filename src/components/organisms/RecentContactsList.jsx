import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const RecentContactsList = ({ contacts }) => {
  const navigate = useNavigate();

  return (
    &lt;motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-lg p-6 shadow-sm"
    >
      &lt;div className="flex items-center justify-between mb-4">
        &lt;Heading level={2} className="text-lg font-semibold text-gray-900">Recent Contacts&lt;/Heading>
        &lt;Button
          variant="ghost"
          className="text-sm text-primary hover:text-primary/80 font-medium"
          onClick={() => navigate('/contacts')}
        >
          View All
        &lt;/Button>
      &lt;/div>

      {contacts.length === 0 ? (
        &lt;div className="text-center py-8">
          &lt;ApperIcon name="Users" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          &lt;Text variant="p" className="text-gray-500 mb-3">No contacts yet&lt;/Text>
          &lt;Button variant="primary" onClick={() => navigate('/contacts')}>
            Add First Contact
          &lt;/Button>
        &lt;/div>
      ) : (
        &lt;div className="space-y-3">
          {contacts.map((contact, index) => (
            &lt;motion.div
              key={contact.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => navigate('/contacts')}
            >
              &lt;div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                &lt;span className="text-sm font-medium text-primary">
                  {contact.name?.charAt(0)?.toUpperCase() || 'N'}
                &lt;/span>
              &lt;/div>
              &lt;div className="flex-1 min-w-0">
                &lt;Text variant="p" className="text-sm font-medium text-gray-900 truncate">
                  {contact.name || 'Unknown'}
                &lt;/Text>
                &lt;Text variant="span" className="text-xs text-gray-500 truncate">
                  {contact.company || contact.email || 'No details'}
                &lt;/Text>
              &lt;/div>
              &lt;div className="text-xs text-gray-400">
                {new Date(contact.createdAt).toLocaleDateString()}
              &lt;/div>
            &lt;/motion.div>
          ))}
        &lt;/div>
      )}
    &lt;/motion.div>
  );
};

export default RecentContactsList;
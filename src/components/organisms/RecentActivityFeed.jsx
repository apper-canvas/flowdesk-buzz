import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';

const RecentActivityFeed = ({ activities, contacts }) => {
  const activityIcons = {
    email: 'Mail',
    call: 'Phone',
    meeting: 'Calendar',
    note: 'FileText'
  };

  return (
    &lt;motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white rounded-lg p-6 shadow-sm"
    >
      &lt;Heading level={2} className="text-lg font-semibold text-gray-900 mb-4">Recent Activities&lt;/Heading>
      {activities.length === 0 ? (
        &lt;div className="h-64 flex items-center justify-center text-gray-500">
          &lt;div className="text-center">
            &lt;ApperIcon name="Clock" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            &lt;Text variant="p">No activities yet&lt;/Text>
          &lt;/div>
        &lt;/div>
      ) : (
        &lt;div className="space-y-4 max-h-80 overflow-y-auto">
          {activities
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10)
            .map((activity, index) => {
              const contact = contacts.find(c => c.id === activity.contactId);
              
              return (
                &lt;motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
                >
                  &lt;div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    &lt;ApperIcon 
                      name={activityIcons[activity.type] || 'Activity'} 
                      className="w-4 h-4 text-primary" 
                    />
                  &lt;/div>
                  &lt;div className="flex-1 min-w-0">
                    &lt;Text variant="p" className="text-sm font-medium text-gray-900 truncate">
                      {activity.subject || `${activity.type} activity`}
                    &lt;/Text>
                    &lt;Text variant="span" className="text-xs text-gray-500">
                      {contact?.name || 'Unknown contact'} • {new Date(activity.date).toLocaleDateString()}
                    &lt;/Text>
                    {activity.description && (
                      &lt;Text variant="p" className="text-xs text-gray-400 mt-1 truncate">
                        {activity.description}
                      &lt;/Text>
                    )}
                  &lt;/div>
                &lt;/motion.div>
              );
            })}
        &lt;/div>
      )}
    &lt;/motion.div>
  );
};

export default RecentActivityFeed;
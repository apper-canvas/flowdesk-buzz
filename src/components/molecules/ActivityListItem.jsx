import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const activityTypeMapping = {
  call: { icon: 'Phone', color: 'bg-blue-500' },
  email: { icon: 'Mail', color: 'bg-green-500' },
  meeting: { icon: 'Calendar', color: 'bg-purple-500' },
  note: { icon: 'FileText', color: 'bg-gray-500' },
};

const ActivityListItem = ({ activity, contact, deal, index, onEdit, onDelete }) => {
  const typeInfo = activityTypeMapping[activity.type] || activityTypeMapping.note;

  return (
    &lt;motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-transparent hover:border-primary"
      onClick={() => onEdit(activity)}
    >
      &lt;div className="flex items-start space-x-4">
        &lt;div className={`w-12 h-12 ${typeInfo.color} rounded-full flex items-center justify-center`}>
          &lt;ApperIcon 
            name={typeInfo.icon} 
            className="w-6 h-6 text-white" 
          />
        &lt;/div>
        
        &lt;div className="flex-1 min-w-0">
          &lt;div className="flex items-start justify-between">
            &lt;div className="flex-1 min-w-0">
              &lt;Heading level={3} className="text-lg font-semibold text-gray-900 mb-1">
                {activity.subject || 'No subject'}
              &lt;/Heading>
              &lt;div className="flex flex-wrap items-center space-x-4 text-sm text-gray-500 mb-2">
                &lt;Text variant="span" className="capitalize">{activity.type}&lt;/Text>
                {contact && (
                  &lt;Text variant="span" className="flex items-center space-x-1">
                    &lt;ApperIcon name="User" className="w-4 h-4" />
                    &lt;span>{contact.name}&lt;/span>
                  &lt;/Text>
                )}
                {deal && (
                  &lt;Text variant="span" className="flex items-center space-x-1">
                    &lt;ApperIcon name="Target" className="w-4 h-4" />
                    &lt;span>{deal.title}&lt;/span>
                  &lt;/Text>
                )}
                &lt;Text variant="span" className="flex items-center space-x-1">
                  &lt;ApperIcon name="Clock" className="w-4 h-4" />
                  &lt;span>
                    {format(new Date(activity.date), 'MMM d, yyyy h:mm a')}
                  &lt;/span>
                &lt;/Text>
                {activity.duration > 0 && (
                  &lt;Text variant="span">{activity.duration} min&lt;/Text>
                )}
              &lt;/div>
              {activity.description && (
                &lt;Text variant="p" className="text-gray-600 text-sm line-clamp-2">
                  {activity.description}
                &lt;/Text>
              )}
            &lt;/div>
            
            &lt;Button
              variant="ghost"
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(activity);
              }}
            >
              &lt;ApperIcon name="Trash2" className="w-4 h-4" />
            &lt;/Button>
          &lt;/div>
        &lt;/div>
      &lt;/div>
    &lt;/motion.div>
  );
};

export default ActivityListItem;
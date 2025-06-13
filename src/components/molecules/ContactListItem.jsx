import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Pill from '@/components/atoms/Pill';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';

const ContactListItem = ({ contact, index, onEdit, onDelete }) => {
  return (
    &lt;motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-transparent hover:border-primary"
      onClick={() => onEdit(contact)}
    >
      &lt;div className="flex items-start justify-between">
        &lt;div className="flex items-start space-x-4">
          &lt;div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            &lt;span className="text-lg font-semibold text-primary">
              {contact.name?.charAt(0)?.toUpperCase() || 'N'}
            &lt;/span>
          &lt;/div>
          &lt;div className="flex-1 min-w-0">
            &lt;Heading level={3} className="text-lg font-semibold text-gray-900">
              {contact.name || 'Unknown'}
            &lt;/Heading>
            {contact.position && contact.company && (
              &lt;p className="text-sm text-gray-600">
                {contact.position} at {contact.company}
              &lt;/p>
            )}
            &lt;div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              {contact.email && (
                &lt;div className="flex items-center space-x-1">
                  &lt;ApperIcon name="Mail" className="w-4 h-4" />
                  &lt;span>{contact.email}&lt;/span>
                &lt;/div>
              )}
              {contact.phone && (
                &lt;div className="flex items-center space-x-1">
                  &lt;ApperIcon name="Phone" className="w-4 h-4" />
                  &lt;span>{contact.phone}&lt;/span>
                &lt;/div>
              )}
            &lt;/div>
            {contact.tags && contact.tags.length > 0 && (
              &lt;div className="flex flex-wrap gap-2 mt-3">
                {contact.tags.map(tag => (
                  &lt;Pill key={tag}>{tag}&lt;/Pill>
                ))}
              &lt;/div>
            )}
          &lt;/div>
        &lt;/div>
        &lt;Button
          variant="ghost"
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(contact);
          }}
        >
          &lt;ApperIcon name="Trash2" className="w-4 h-4" />
        &lt;/Button>
      &lt;/div>
    &lt;/motion.div>
  );
};

export default ContactListItem;
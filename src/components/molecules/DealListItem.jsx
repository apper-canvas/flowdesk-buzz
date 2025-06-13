import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';

const DealListItem = ({ deal, contact, dealIndex, onEdit, onDelete, onMoveStage, isFirstStage, isLastStage }) => {
  return (
    &lt;motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: dealIndex * 0.05 }}
      className="bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors border-l-4 border-primary/20 hover:border-primary"
      onClick={() => onEdit(deal)}
    >
      &lt;div className="flex items-start justify-between mb-2">
        &lt;Heading level={4} className="font-medium text-gray-900 text-sm truncate flex-1">
          {deal.title || 'Untitled Deal'}
        &lt;/Heading>
        &lt;Button
          variant="ghost"
          className="p-1 text-gray-400 hover:text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(deal);
          }}
        >
          &lt;ApperIcon name="X" className="w-3 h-3" />
        &lt;/Button>
      &lt;/div>
      
      &lt;div className="space-y-1 text-xs text-gray-600">
        &lt;p className="font-semibold text-accent">
          ${(deal.value || 0).toLocaleString()}
        &lt;/p>
        {contact && (
          &lt;p className="truncate">{contact.name}&lt;/p>
        )}
        &lt;p>{deal.probability || 0}% probability&lt;/p>
        {deal.expectedClose && (
          &lt;p className="text-gray-500">
            Due: {new Date(deal.expectedClose).toLocaleDateString()}
          &lt;/p>
        )}
      &lt;/div>

      {/* Stage Movement Buttons */}
      &lt;div className="flex justify-between mt-3 pt-2 border-t border-gray-200">
        {!isFirstStage && (
          &lt;Button
            variant="ghost"
            className="p-1 text-gray-400 hover:text-primary"
            onClick={(e) => {
              e.stopPropagation();
              onMoveStage(deal.id, 'backward');
            }}
            title="Move backward"
          >
            &lt;ApperIcon name="ChevronLeft" className="w-4 h-4" />
          &lt;/Button>
        )}
        &lt;div className="flex-1">&lt;/div>
        {!isLastStage && (
          &lt;Button
            variant="ghost"
            className="p-1 text-gray-400 hover:text-primary"
            onClick={(e) => {
              e.stopPropagation();
              onMoveStage(deal.id, 'forward');
            }}
            title="Move forward"
          >
            &lt;ApperIcon name="ChevronRight" className="w-4 h-4" />
          &lt;/Button>
        )}
      &lt;/div>
    &lt;/motion.div>
  );
};

export default DealListItem;
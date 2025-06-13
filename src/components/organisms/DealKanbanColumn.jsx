import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import DealListItem from '@/components/molecules/DealListItem';

const DealKanbanColumn = ({ stage, deals, contacts, stageIndex, totalStages, onEditDeal, onDeleteDeal, onMoveDealStage }) => {
  return (
    &lt;motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: stageIndex * 0.1 }}
      className="bg-white rounded-lg shadow-sm"
    >
      &lt;div className={`${stage.color} text-white p-4 rounded-t-lg`}>
        &lt;Heading level={3} className="font-semibold text-center">{stage.name}&lt;/Heading>
        &lt;Text variant="p" className="text-center text-sm opacity-90">
          {deals?.length || 0} deals
        &lt;/Text>
      &lt;/div>
      
      &lt;div className="p-4 space-y-3 min-h-[400px]">
        {deals?.length === 0 ? (
          &lt;div className="text-center text-gray-400 py-8">
            &lt;ApperIcon name="Target" className="w-8 h-8 mx-auto mb-2 opacity-50" />
            &lt;Text variant="p" className="text-sm">No deals&lt;/Text>
          &lt;/div>
        ) : (
          deals?.map((deal, dealIndex) => {
            const contact = contacts.find(c => c.id === deal.contactId);
            
            return (
              &lt;DealListItem
                key={deal.id}
                deal={deal}
                contact={contact}
                dealIndex={dealIndex}
                onEdit={onEditDeal}
                onDelete={onDeleteDeal}
                onMoveStage={(dealId, direction) => onMoveDealStage(dealId, direction, stageIndex)}
                isFirstStage={stageIndex === 0}
                isLastStage={stageIndex === totalStages - 1}
              />
            );
          })
        )}
      &lt;/div>
    &lt;/motion.div>
  );
};

export default DealKanbanColumn;
import DealKanbanColumn from '@/components/organisms/DealKanbanColumn';

const DealKanbanBoard = ({ dealsByStage, contacts, stages, onEditDeal, onDeleteDeal, onMoveDealStage }) => {
  return (
    &lt;div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {stages.map((stage, stageIndex) => (
        &lt;DealKanbanColumn
          key={stage.id}
          stage={stage}
          deals={dealsByStage[stage.id]}
          contacts={contacts}
          stageIndex={stageIndex}
          totalStages={stages.length}
          onEditDeal={onEditDeal}
          onDeleteDeal={onDeleteDeal}
          onMoveDealStage={onMoveDealStage}
        />
      ))}
    &lt;/div>
  );
};

export default DealKanbanBoard;
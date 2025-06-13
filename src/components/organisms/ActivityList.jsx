import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import ActivityListItem from '@/components/molecules/ActivityListItem';
import EmptyState from '@/components/molecules/EmptyState';

const ActivityList = ({
  activities,
  filteredActivities,
  contacts,
  deals,
  filterType,
  setFilterType,
  filterContact,
  setFilterContact,
  activityTypes,
  openCreateForm,
  openEditForm,
  handleDelete
}) => {
  // Sort activities by date (newest first)
  const sortedActivities = filteredActivities.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    &lt;div>
      {/* Filters */}
      &lt;div className="bg-white rounded-lg p-4 shadow-sm mb-6">
        &lt;div className="flex flex-col md:flex-row gap-4">
          &lt;div className="w-full md:w-48">
            &lt;Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              &lt;option value="">All Types&lt;/option>
              {activityTypes.map(type => (
                &lt;option key={type.id} value={type.id}>{type.name}&lt;/option>
              ))}
            &lt;/Select>
          &lt;/div>
          &lt;div className="w-full md:w-64">
            &lt;Select
              value={filterContact}
              onChange={(e) => setFilterContact(e.target.value)}
            >
              &lt;option value="">All Contacts&lt;/option>
              {contacts.map(contact => (
                &lt;option key={contact.id} value={contact.id}>{contact.name}&lt;/option>
              ))}
            &lt;/Select>
          &lt;/div>
        &lt;/div>
      &lt;/div>

      {/* Activities Timeline */}
      &lt;div className="space-y-4">
        {sortedActivities.length === 0 ? (
          &lt;EmptyState
            icon="Clock"
            title={activities.length === 0 ? 'No activities yet' : 'No activities match your filters'}
            description={
              activities.length === 0 
                ? 'Start logging your customer interactions'
                : 'Try adjusting your filters'
            }
            buttonText="Log First Activity"
            onButtonClick={activities.length === 0 ? openCreateForm : null}
            showButton={activities.length === 0}
          />
        ) : (
          sortedActivities.map((activity, index) => {
            const contact = contacts.find(c => c.id === activity.contactId);
            const deal = deals.find(d => d.id === activity.dealId);
            
            return (
              &lt;ActivityListItem
                key={activity.id}
                activity={activity}
                contact={contact}
                deal={deal}
                index={index}
                onEdit={openEditForm}
                onDelete={handleDelete}
              />
            );
          })
        )}
      &lt;/div>
    &lt;/div>
  );
};

export default ActivityList;
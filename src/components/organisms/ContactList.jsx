import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import ContactListItem from '@/components/molecules/ContactListItem';
import EmptyState from '@/components/molecules/EmptyState';

const ContactList = ({
  contacts,
  filteredContacts,
  allTags,
  searchTerm,
  setSearchTerm,
  filterTag,
  setFilterTag,
  openCreateForm,
  openEditForm,
  handleDelete
}) => {
  return (
    &lt;div className="xl:col-span-2">
      &lt;div className="bg-white rounded-lg p-4 shadow-sm mb-6">
        &lt;div className="flex flex-col md:flex-row gap-4">
          &lt;div className="flex-1">
            &lt;div className="relative">
              &lt;ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              &lt;Input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4"
              />
            &lt;/div>
          &lt;/div>
          &lt;div className="w-full md:w-48">
            &lt;Select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
            >
              &lt;option value="">All Tags&lt;/option>
              {allTags.map(tag => (
                &lt;option key={tag} value={tag}>{tag}&lt;/option>
              ))}
            &lt;/Select>
          &lt;/div>
        &lt;/div>
      &lt;/div>

      {filteredContacts.length === 0 ? (
        &lt;EmptyState
          icon="Users"
          title={contacts.length === 0 ? 'No contacts yet' : 'No contacts match your search'}
          description={
            contacts.length === 0 
              ? 'Get started by adding your first contact'
              : 'Try adjusting your search or filters'
          }
          buttonText="Add First Contact"
          onButtonClick={contacts.length === 0 ? openCreateForm : null}
          showButton={contacts.length === 0}
        />
      ) : (
        &lt;div className="space-y-4">
          {filteredContacts.map((contact, index) => (
            &lt;ContactListItem
              key={contact.id}
              contact={contact}
              index={index}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
          ))}
        &lt;/div>
      )}
    &lt;/div>
  );
};

export default ContactList;
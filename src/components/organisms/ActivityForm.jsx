import { AnimatePresence, motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Heading from '@/components/atoms/Heading';

const ActivityForm = ({
  selectedActivity,
  isCreating,
  formData,
  setFormData,
  handleSubmit,
  closeForm,
  contacts,
  deals,
  activityTypes
}) => {
  return (
    &lt;AnimatePresence>
      {(isCreating || selectedActivity) && (
        &lt;>
          &lt;motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeForm}
          />
          &lt;motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            &lt;div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              &lt;div className="flex items-center justify-between mb-6">
                &lt;Heading level={2} className="text-lg font-semibold text-gray-900">
                  {isCreating ? 'Log Activity' : 'Edit Activity'}
                &lt;/Heading>
                &lt;Button
                  variant="ghost"
                  onClick={closeForm}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  &lt;ApperIcon name="X" className="w-5 h-5" />
                &lt;/Button>
              &lt;/div>

              &lt;form onSubmit={handleSubmit} className="space-y-4">
                &lt;FormField
                  label="Type"
                  id="type"
                  type="select"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                >
                  {activityTypes.map(type => (
                    &lt;option key={type.id} value={type.id}>{type.name}&lt;/option>
                  ))}
                &lt;/FormField>
                &lt;FormField
                  label="Subject"
                  id="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                />
                &lt;FormField
                  label="Contact"
                  id="contactId"
                  type="select"
                  value={formData.contactId}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactId: e.target.value }))}
                >
                  &lt;option value="">Select contact...&lt;/option>
                  {contacts.map(contact => (
                    &lt;option key={contact.id} value={contact.id}>{contact.name}&lt;/option>
                  ))}
                &lt;/FormField>
                &lt;FormField
                  label="Related Deal"
                  id="dealId"
                  type="select"
                  value={formData.dealId}
                  onChange={(e) => setFormData(prev => ({ ...prev, dealId: e.target.value }))}
                >
                  &lt;option value="">Select deal...&lt;/option>
                  {deals.map(deal => (
                    &lt;option key={deal.id} value={deal.id}>{deal.title}&lt;/option>
                  ))}
                &lt;/FormField>
                &lt;FormField
                  label="Date & Time"
                  id="date"
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
                &lt;FormField
                  label="Duration (minutes)"
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  min="0"
                />
                &lt;FormField
                  label="Description"
                  id="description"
                  type="textarea"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
                &lt;div className="flex space-x-3 pt-4">
                  &lt;Button type="submit" variant="primary" className="flex-1">
                    {isCreating ? 'Log Activity' : 'Update Activity'}
                  &lt;/Button>
                  &lt;Button type="button" variant="outline" onClick={closeForm}>
                    Cancel
                  &lt;/Button>
                &lt;/div>
              &lt;/form>
            &lt;/div>
          &lt;/motion.div>
        &lt;/>
      )}
    &lt;/AnimatePresence>
  );
};

export default ActivityForm;
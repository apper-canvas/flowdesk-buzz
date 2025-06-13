import { AnimatePresence, motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Heading from '@/components/atoms/Heading';

const DealForm = ({
  selectedDeal,
  isCreating,
  formData,
  setFormData,
  handleSubmit,
  closeForm,
  contacts,
  stages
}) => {
  return (
    &lt;AnimatePresence>
      {(isCreating || selectedDeal) && (
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
                  {isCreating ? 'Create Deal' : 'Edit Deal'}
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
                  label="Deal Title"
                  id="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
                &lt;FormField
                  label="Value ($)"
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  min="0"
                  step="0.01"
                />
                &lt;FormField
                  label="Stage"
                  id="stage"
                  type="select"
                  value={formData.stage}
                  onChange={(e) => setFormData(prev => ({ ...prev, stage: e.target.value }))}
                >
                  {stages.map(stage => (
                    &lt;option key={stage.id} value={stage.id}>
                      {stage.name}
                    &lt;/option>
                  ))}
                &lt;/FormField>
                &lt;FormField
                  label="Probability (%)"
                  id="probability"
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={formData.probability}
                  onChange={(e) => setFormData(prev => ({ ...prev, probability: parseInt(e.target.value) }))}
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
                    &lt;option key={contact.id} value={contact.id}>
                      {contact.name}
                    &lt;/option>
                  ))}
                &lt;/FormField>
                &lt;FormField
                  label="Expected Close Date"
                  id="expectedClose"
                  type="date"
                  value={formData.expectedClose}
                  onChange={(e) => setFormData(prev => ({ ...prev, expectedClose: e.target.value }))}
                />
                &lt;FormField
                  label="Notes"
                  id="notes"
                  type="textarea"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
                &lt;div className="flex space-x-3 pt-4">
                  &lt;Button type="submit" variant="primary" className="flex-1">
                    {isCreating ? 'Create Deal' : 'Update Deal'}
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

export default DealForm;
import { AnimatePresence, motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Heading from '@/components/atoms/Heading';

const ContactForm = ({
  selectedContact,
  isCreating,
  formData,
  setFormData,
  handleSubmit,
  closeForm
}) => {
  return (
    &lt;AnimatePresence mode="wait">
      {(isCreating || selectedContact) && (
        &lt;motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="bg-white rounded-lg p-6 shadow-sm sticky top-6"
        >
          &lt;div className="flex items-center justify-between mb-6">
            &lt;Heading level={2} className="text-lg font-semibold text-gray-900">
              {isCreating ? 'Add Contact' : 'Edit Contact'}
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
              label="Name"
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
            &lt;FormField
              label="Email"
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
            &lt;FormField
              label="Phone"
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
            &lt;FormField
              label="Company"
              id="company"
              type="text"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
            />
            &lt;FormField
              label="Position"
              id="position"
              type="text"
              value={formData.position}
              onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
            />
            {/* Tags input would be more complex, keeping it as is or simplifying */}
            &lt;div className="flex space-x-3 pt-4">
              &lt;Button type="submit" variant="primary" className="flex-1">
                {isCreating ? 'Create Contact' : 'Update Contact'}
              &lt;/Button>
              &lt;Button type="button" variant="outline" onClick={closeForm}>
                Cancel
              &lt;/Button>
            &lt;/div>
          &lt;/form>
        &lt;/motion.div>
      )}
    &lt;/AnimatePresence>
  );
};

export default ContactForm;
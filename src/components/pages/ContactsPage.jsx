import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import contactService from '@/services/api/contactService';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import ErrorState from '@/components/molecules/ErrorState';
import ContactList from '@/components/organisms/ContactList';
import ContactForm from '@/components/organisms/ContactForm';

function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    tags: []
  });

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      setError(err.message || 'Failed to load contacts');
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      if (selectedContact) {
        const updated = await contactService.update(selectedContact.id, formData);
        setContacts(prev => prev.map(c => c.id === selectedContact.id ? updated : c));
        toast.success('Contact updated successfully');
      } else {
        const created = await contactService.create(formData);
        setContacts(prev => [created, ...prev]);
        toast.success('Contact created successfully');
        setIsCreating(false);
      }
      
      setFormData({ name: '', email: '', phone: '', company: '', position: '', tags: [] });
      setSelectedContact(null);
    } catch (err) {
      toast.error(err.message || 'Failed to save contact');
    }
  };

  const handleDelete = async (contact) => {
    if (!window.confirm(`Are you sure you want to delete ${contact.name}?`)) return;
    
    try {
      await contactService.delete(contact.id);
      setContacts(prev => prev.filter(c => c.id !== contact.id));
      setSelectedContact(null);
      toast.success('Contact deleted successfully');
    } catch (err) {
      toast.error('Failed to delete contact');
    }
  };

  const openEditForm = (contact) => {
    setSelectedContact(contact);
    setFormData({
      name: contact.name || '',
      email: contact.email || '',
      phone: contact.phone || '',
      company: contact.company || '',
      position: contact.position || '',
      tags: contact.tags || []
    });
    setIsCreating(false);
  };

  const openCreateForm = () => {
    setIsCreating(true);
    setSelectedContact(null);
    setFormData({ name: '', email: '', phone: '', company: '', position: '', tags: [] });
  };

  const closeForm = () => {
    setIsCreating(false);
    setSelectedContact(null);
    setFormData({ name: '', email: '', phone: '', company: '', position: '', tags: [] });
  };

  // Filter contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = !searchTerm || 
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = !filterTag || contact.tags?.includes(filterTag);
    
    return matchesSearch && matchesTag;
  });

  // Get all unique tags
  const allTags = [...new Set(contacts.flatMap(c => c.tags || []))];

  if (loading) {
    return (
      &lt;div className="p-6 max-w-7xl mx-auto">
        &lt;div className="animate-pulse">
          &lt;div className="h-8 bg-gray-200 rounded w-1/4 mb-8">&lt;/div>
          &lt;div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            &lt;div className="lg:col-span-2 space-y-4">
              {[...Array(5)].map((_, i) => (
                &lt;div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  &lt;div className="h-4 bg-gray-200 rounded w-1/3 mb-2">&lt;/div>
                  &lt;div className="h-4 bg-gray-200 rounded w-1/2">&lt;/div>
                &lt;/div>
              ))}
            &lt;/div>
            &lt;div className="bg-white rounded-lg p-6 shadow-sm h-96">
              &lt;div className="h-6 bg-gray-200 rounded w-1/2 mb-4">&lt;/div>
              &lt;div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  &lt;div key={i} className="h-10 bg-gray-200 rounded">&lt;/div>
                ))}
              &lt;/div>
            &lt;/div>
          &lt;/div>
        &lt;/div>
      &lt;/div>
    );
  }

  if (error) {
    return (
      &lt;ErrorState
        title="Error Loading Contacts"
        message={error}
        onRetry={loadContacts}
      />
    );
  }

  return (
    &lt;div className="p-6 max-w-7xl mx-auto">
      &lt;div className="flex items-center justify-between mb-6">
        &lt;div>
          &lt;Heading level={1} className="text-3xl font-bold text-gray-900 mb-2">Contacts&lt;/Heading>
          &lt;Text variant="p" className="text-gray-600">Manage your customer relationships&lt;/Text>
        &lt;/div>
        &lt;Button variant="primary" onClick={openCreateForm} className="space-x-2">
          &lt;ApperIcon name="Plus" className="w-5 h-5" />
          &lt;span>Add Contact&lt;/span>
        &lt;/Button>
      &lt;/div>

      &lt;div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        &lt;ContactList
          contacts={contacts}
          filteredContacts={filteredContacts}
          allTags={allTags}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterTag={filterTag}
          setFilterTag={setFilterTag}
          openCreateForm={openCreateForm}
          openEditForm={openEditForm}
          handleDelete={handleDelete}
        />

        &lt;div className="xl:col-span-1">
          &lt;ContactForm
            selectedContact={selectedContact}
            isCreating={isCreating}
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            closeForm={closeForm}
          />
        &lt;/div>
      &lt;/div>
    &lt;/div>
  );
}

export default ContactsPage;
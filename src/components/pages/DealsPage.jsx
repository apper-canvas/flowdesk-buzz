import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import dealService from '@/services/api/dealService';
import contactService from '@/services/api/contactService';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import ErrorState from '@/components/molecules/ErrorState';
import DealKanbanBoard from '@/components/organisms/DealKanbanBoard';
import DealForm from '@/components/organisms/DealForm';

function DealsPage() {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    stage: 'lead',
    probability: 10,
    contactId: '',
    expectedClose: '',
    notes: ''
  });

  const stages = [
    { id: 'lead', name: 'Lead', color: 'bg-gray-500' },
    { id: 'qualified', name: 'Qualified', color: 'bg-blue-500' },
    { id: 'proposal', name: 'Proposal', color: 'bg-yellow-500' },
    { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-500' },
    { id: 'won', name: 'Won', color: 'bg-green-500' },
    { id: 'lost', name: 'Lost', color: 'bg-red-500' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message || 'Failed to load deals');
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Deal title is required');
      return;
    }

    const dealData = {
      ...formData,
      value: parseFloat(formData.value) || 0,
      probability: parseInt(formData.probability) || 0
    };

    try {
      if (selectedDeal) {
        const updated = await dealService.update(selectedDeal.id, dealData);
        setDeals(prev => prev.map(d => d.id === selectedDeal.id ? updated : d));
        toast.success('Deal updated successfully');
      } else {
        const created = await dealService.create(dealData);
        setDeals(prev => [created, ...prev]);
        toast.success('Deal created successfully');
        setIsCreating(false);
      }
      
      setFormData({
        title: '',
        value: '',
        stage: 'lead',
        probability: 10,
        contactId: '',
        expectedClose: '',
        notes: ''
      });
      setSelectedDeal(null);
    } catch (err) {
      toast.error(err.message || 'Failed to save deal');
    }
  };

  const handleDelete = async (deal) => {
    if (!window.confirm(`Are you sure you want to delete "${deal.title}"?`)) return;
    
    try {
      await dealService.delete(deal.id);
      setDeals(prev => prev.filter(d => d.id !== deal.id));
      setSelectedDeal(null);
      toast.success('Deal deleted successfully');
    } catch (err) {
      toast.error('Failed to delete deal');
    }
  };

  const moveToStage = async (dealId, direction, currentStageIndex) => {
    try {
      const deal = deals.find(d => d.id === dealId);
      if (!deal) return;

      let newStageId;
      if (direction === 'forward') {
        newStageId = stages[currentStageIndex + 1]?.id;
      } else {
        newStageId = stages[currentStageIndex - 1]?.id;
      }
      if (!newStageId) return;

      const updated = await dealService.update(dealId, { ...deal, stage: newStageId });
      setDeals(prev => prev.map(d => d.id === dealId ? updated : d));
      toast.success(`Deal moved to ${stages.find(s => s.id === newStageId)?.name}`);
    } catch (err) {
      toast.error('Failed to update deal');
    }
  };

  const openEditForm = (deal) => {
    setSelectedDeal(deal);
    setFormData({
      title: deal.title || '',
      value: deal.value?.toString() || '',
      stage: deal.stage || 'lead',
      probability: deal.probability || 10,
      contactId: deal.contactId || '',
      expectedClose: deal.expectedClose ? new Date(deal.expectedClose).toISOString().split('T')[0] : '',
      notes: deal.notes || ''
    });
    setIsCreating(false);
  };

  const openCreateForm = () => {
    setIsCreating(true);
    setSelectedDeal(null);
    setFormData({
      title: '',
      value: '',
      stage: 'lead',
      probability: 10,
      contactId: '',
      expectedClose: '',
      notes: ''
    });
  };

  const closeForm = () => {
    setIsCreating(false);
    setSelectedDeal(null);
    setFormData({
      title: '',
      value: '',
      stage: 'lead',
      probability: 10,
      contactId: '',
      expectedClose: '',
      notes: ''
    });
  };

  // Group deals by stage
  const dealsByStage = stages.reduce((acc, stage) => {
    acc[stage.id] = deals.filter(deal => deal.stage === stage.id);
    return acc;
  }, {});

  if (loading) {
    return (
      &lt;div className="p-6 max-w-7xl mx-auto">
        &lt;div className="animate-pulse">
          &lt;div className="h-8 bg-gray-200 rounded w-1/4 mb-8">&lt;/div>
          &lt;div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              &lt;div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                &lt;div className="h-6 bg-gray-200 rounded mb-4">&lt;/div>
                &lt;div className="space-y-3">
                  {[...Array(2)].map((_, j) => (
                    &lt;div key={j} className="h-20 bg-gray-200 rounded">&lt;/div>
                  ))}
                &lt;/div>
              &lt;/div>
            ))}
          &lt;/div>
        &lt;/div>
      &lt;/div>
    );
  }

  if (error) {
    return (
      &lt;ErrorState
        title="Error Loading Deals"
        message={error}
        onRetry={loadData}
      />
    );
  }

  return (
    &lt;div className="p-6 max-w-7xl mx-auto">
      &lt;div className="flex items-center justify-between mb-6">
        &lt;div>
          &lt;Heading level={1} className="text-3xl font-bold text-gray-900 mb-2">Deals Pipeline&lt;/Heading>
          &lt;Text variant="p" className="text-gray-600">Track your sales opportunities&lt;/Text>
        &lt;/div>
        &lt;Button variant="primary" onClick={openCreateForm} className="space-x-2">
          &lt;ApperIcon name="Plus" className="w-5 h-5" />
          &lt;span>Add Deal&lt;/span>
        &lt;/Button>
      &lt;/div>

      &lt;DealKanbanBoard
        dealsByStage={dealsByStage}
        contacts={contacts}
        stages={stages}
        onEditDeal={openEditForm}
        onDeleteDeal={handleDelete}
        onMoveDealStage={moveToStage}
      />

      &lt;DealForm
        selectedDeal={selectedDeal}
        isCreating={isCreating}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        closeForm={closeForm}
        contacts={contacts}
        stages={stages}
      />
    &lt;/div>
  );
}

export default DealsPage;
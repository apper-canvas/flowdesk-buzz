import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import dealService from '../services/api/dealService';
import contactService from '../services/api/contactService';

function Deals() {
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

  const moveToStage = async (dealId, newStage) => {
    try {
      const deal = deals.find(d => d.id === dealId);
      const updated = await dealService.update(dealId, { ...deal, stage: newStage });
      setDeals(prev => prev.map(d => d.id === dealId ? updated : d));
      toast.success(`Deal moved to ${stages.find(s => s.id === newStage)?.name}`);
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
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                  {[...Array(2)].map((_, j) => (
                    <div key={j} className="h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg p-12 text-center shadow-sm">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Deals</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Deals Pipeline</h1>
          <p className="text-gray-600">Track your sales opportunities</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          <span>Add Deal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {stages.map((stage, stageIndex) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stageIndex * 0.1 }}
            className="bg-white rounded-lg shadow-sm"
          >
            <div className={`${stage.color} text-white p-4 rounded-t-lg`}>
              <h3 className="font-semibold text-center">{stage.name}</h3>
              <p className="text-center text-sm opacity-90">
                {dealsByStage[stage.id]?.length || 0} deals
              </p>
            </div>
            
            <div className="p-4 space-y-3 min-h-[400px]">
              {dealsByStage[stage.id]?.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <ApperIcon name="Target" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No deals</p>
                </div>
              ) : (
                dealsByStage[stage.id]?.map((deal, dealIndex) => {
                  const contact = contacts.find(c => c.id === deal.contactId);
                  
                  return (
                    <motion.div
                      key={deal.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: dealIndex * 0.05 }}
                      className="bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors border-l-4 border-primary/20 hover:border-primary"
                      onClick={() => openEditForm(deal)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm truncate flex-1">
                          {deal.title || 'Untitled Deal'}
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(deal);
                          }}
                          className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                        >
                          <ApperIcon name="X" className="w-3 h-3" />
                        </button>
                      </div>
                      
                      <div className="space-y-1 text-xs text-gray-600">
                        <p className="font-semibold text-accent">
                          ${(deal.value || 0).toLocaleString()}
                        </p>
                        {contact && (
                          <p className="truncate">{contact.name}</p>
                        )}
                        <p>{deal.probability || 0}% probability</p>
                        {deal.expectedClose && (
                          <p className="text-gray-500">
                            Due: {new Date(deal.expectedClose).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      {/* Stage Movement Buttons */}
                      <div className="flex justify-between mt-3 pt-2 border-t border-gray-200">
                        {stageIndex > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveToStage(deal.id, stages[stageIndex - 1].id);
                            }}
                            className="p-1 text-gray-400 hover:text-primary rounded transition-colors"
                            title="Move backward"
                          >
                            <ApperIcon name="ChevronLeft" className="w-4 h-4" />
                          </button>
                        )}
                        <div className="flex-1"></div>
                        {stageIndex < stages.length - 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveToStage(deal.id, stages[stageIndex + 1].id);
                            }}
                            className="p-1 text-gray-400 hover:text-primary rounded transition-colors"
                            title="Move forward"
                          >
                            <ApperIcon name="ChevronRight" className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Deal Form Modal */}
      <AnimatePresence>
        {(isCreating || selectedDeal) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={closeForm}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {isCreating ? 'Create Deal' : 'Edit Deal'}
                  </h2>
                  <button
                    onClick={closeForm}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deal Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Value ($)
                    </label>
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stage
                    </label>
                    <select
                      value={formData.stage}
                      onChange={(e) => setFormData(prev => ({ ...prev, stage: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {stages.map(stage => (
                        <option key={stage.id} value={stage.id}>
                          {stage.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Probability (%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="10"
                      value={formData.probability}
                      onChange={(e) => setFormData(prev => ({ ...prev, probability: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-gray-600 mt-1">
                      {formData.probability}%
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact
                    </label>
                    <select
                      value={formData.contactId}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select contact...</option>
                      {contacts.map(contact => (
                        <option key={contact.id} value={contact.id}>
                          {contact.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Close Date
                    </label>
                    <input
                      type="date"
                      value={formData.expectedClose}
                      onChange={(e) => setFormData(prev => ({ ...prev, expectedClose: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      {isCreating ? 'Create Deal' : 'Update Deal'}
                    </button>
                    <button
                      type="button"
                      onClick={closeForm}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Deals;
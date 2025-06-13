import deals from '../mockData/deals.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let dealsData = [...deals];

const dealService = {
  async getAll() {
    await delay(300);
    return [...dealsData];
  },

  async getById(id) {
    await delay(200);
    const deal = dealsData.find(d => d.id === id);
    if (!deal) {
      throw new Error('Deal not found');
    }
    return { ...deal };
  },

  async create(dealData) {
    await delay(400);
    const newDeal = {
      ...dealData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    dealsData.unshift(newDeal);
    return { ...newDeal };
  },

  async update(id, dealData) {
    await delay(300);
    const index = dealsData.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error('Deal not found');
    }
    
    const updatedDeal = {
      ...dealsData[index],
      ...dealData
    };
    dealsData[index] = updatedDeal;
    return { ...updatedDeal };
  },

  async delete(id) {
    await delay(200);
    const index = dealsData.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error('Deal not found');
    }
    
    dealsData.splice(index, 1);
    return true;
  }
};

export default dealService;
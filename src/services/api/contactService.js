import contacts from '../mockData/contacts.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let contactsData = [...contacts];

const contactService = {
  async getAll() {
    await delay(300);
    return [...contactsData];
  },

  async getById(id) {
    await delay(200);
    const contact = contactsData.find(c => c.id === id);
    if (!contact) {
      throw new Error('Contact not found');
    }
    return { ...contact };
  },

  async create(contactData) {
    await delay(400);
    const newContact = {
      ...contactData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };
    contactsData.unshift(newContact);
    return { ...newContact };
  },

  async update(id, contactData) {
    await delay(300);
    const index = contactsData.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Contact not found');
    }
    
    const updatedContact = {
      ...contactsData[index],
      ...contactData,
      lastActivity: new Date().toISOString()
    };
    contactsData[index] = updatedContact;
    return { ...updatedContact };
  },

  async delete(id) {
    await delay(200);
    const index = contactsData.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Contact not found');
    }
    
    contactsData.splice(index, 1);
    return true;
  }
};

export default contactService;
import activities from '../mockData/activities.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let activitiesData = [...activities];

const activityService = {
  async getAll() {
    await delay(300);
    return [...activitiesData];
  },

  async getById(id) {
    await delay(200);
    const activity = activitiesData.find(a => a.id === id);
    if (!activity) {
      throw new Error('Activity not found');
    }
    return { ...activity };
  },

  async create(activityData) {
    await delay(400);
    const newActivity = {
      ...activityData,
      id: Date.now().toString(),
      date: activityData.date || new Date().toISOString()
    };
    activitiesData.unshift(newActivity);
    return { ...newActivity };
  },

  async update(id, activityData) {
    await delay(300);
    const index = activitiesData.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Activity not found');
    }
    
    const updatedActivity = {
      ...activitiesData[index],
      ...activityData
    };
    activitiesData[index] = updatedActivity;
    return { ...updatedActivity };
  },

  async delete(id) {
    await delay(200);
    const index = activitiesData.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Activity not found');
    }
    
    activitiesData.splice(index, 1);
    return true;
  }
};

export default activityService;
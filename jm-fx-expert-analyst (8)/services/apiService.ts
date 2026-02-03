
import { Member } from '../components/GroupManager';
import { ForexAnalysis, UserSubscription } from '../types';

const STORAGE_KEYS = {
  MEMBERS: 'jm_fx_cloud_members',
  HISTORY: 'jm_fx_cloud_history',
  SETTINGS: 'jm_fx_cloud_settings',
  SUBSCRIPTIONS: 'jm_fx_cloud_subs',
  PAYMENT_INFO: 'jm_fx_payment_info'
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const ADMIN_EMAIL = 'admin@jmfx.com'; 

export const apiService = {
  async getMembers(): Promise<Member[]> {
    await delay(500);
    const data = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    return data ? JSON.parse(data) : [];
  },

  async saveMember(member: Member): Promise<void> {
    const members = await this.getMembers();
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify([member, ...members]));
  },

  async bulkAddMembers(count: number): Promise<number> {
    await delay(1000);
    const currentTotal = parseInt(localStorage.getItem('jm_fx_total_count') || '10540');
    const newTotal = currentTotal + count;
    localStorage.setItem('jm_fx_total_count', newTotal.toString());
    return newTotal;
  },

  async checkServerStatus(): Promise<boolean> {
    return true;
  },

  async saveAnalysis(analysis: ForexAnalysis): Promise<void> {
    const historyData = localStorage.getItem(STORAGE_KEYS.HISTORY);
    const history = historyData ? JSON.parse(historyData) : [];
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([analysis, ...history]));
  },

  // Payment Info Management
  async getPaymentInfo(): Promise<{ number: string, name: string }> {
    await delay(300);
    const data = localStorage.getItem(STORAGE_KEYS.PAYMENT_INFO);
    return data ? JSON.parse(data) : { number: '07XX XXX XXX', name: 'JM EXPERT ANALYST' };
  },

  async updatePaymentInfo(number: string, name: string): Promise<void> {
    await delay(800);
    localStorage.setItem(STORAGE_KEYS.PAYMENT_INFO, JSON.stringify({ number, name }));
  },

  // Subscription & Admin Management
  async getSubscription(email: string): Promise<UserSubscription> {
    await delay(400);
    if (email === ADMIN_EMAIL) {
      return { email, isPaid: true, isPending: false, plan: 'Lifetime', isAdmin: true };
    }
    
    const subsData = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
    let subs: UserSubscription[] = subsData ? JSON.parse(subsData) : [];
    const userSub = subs.find(s => s.email === email);
    
    if (userSub && userSub.isPaid && userSub.expiryDate) {
      const now = new Date();
      const expiry = new Date(userSub.expiryDate);
      if (now > expiry) {
        userSub.isPaid = false;
        userSub.plan = 'None';
        localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subs));
      }
    }
    
    return userSub || { email, isPaid: false, isPending: false, plan: 'None' };
  },

  async getAllSubscriptions(): Promise<UserSubscription[]> {
    await delay(800);
    const subsData = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
    return subsData ? JSON.parse(subsData) : [];
  },

  async requestActivation(email: string): Promise<void> {
    await delay(1500);
    const subsData = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
    let subs: UserSubscription[] = subsData ? JSON.parse(subsData) : [];
    
    const newSub: UserSubscription = {
      email,
      isPaid: false,
      isPending: true,
      plan: 'Monthly'
    };
    
    subs = subs.filter(s => s.email !== email);
    subs.push(newSub);
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subs));
  },

  async adminApproveUser(email: string): Promise<void> {
    await delay(1000);
    const subsData = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
    let subs: UserSubscription[] = subsData ? JSON.parse(subsData) : [];
    
    const userIndex = subs.findIndex(s => s.email === email);
    if (userIndex !== -1) {
      subs[userIndex].isPaid = true;
      subs[userIndex].isPending = false;
      subs[userIndex].expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subs));
    }
  },

  async adminRejectUser(email: string): Promise<void> {
    await delay(800);
    const subsData = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
    let subs: UserSubscription[] = subsData ? JSON.parse(subsData) : [];
    subs = subs.filter(s => s.email !== email);
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subs));
  }
};

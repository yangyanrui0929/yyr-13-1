const STORAGE_KEY = 'conch-language-academy';
const STORAGE_VERSION = 1;

interface StorageData {
  version: number;
  data: Record<string, unknown>;
  timestamp: string;
}

export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    const existingData = localStorage.getItem(STORAGE_KEY);
    let storageData: StorageData;
    
    if (existingData) {
      storageData = JSON.parse(existingData);
    } else {
      storageData = {
        version: STORAGE_VERSION,
        data: {},
        timestamp: new Date().toISOString(),
      };
    }
    
    storageData.data[key] = value;
    storageData.timestamp = new Date().toISOString();
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const existingData = localStorage.getItem(STORAGE_KEY);
    if (!existingData) return defaultValue;
    
    const storageData: StorageData = JSON.parse(existingData);
    
    if (storageData.version !== STORAGE_VERSION) {
      console.warn('Storage version mismatch, migrating data...');
      return defaultValue;
    }
    
    const value = storageData.data[key];
    return value !== undefined ? (value as T) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

export const removeFromStorage = (key: string): void => {
  try {
    const existingData = localStorage.getItem(STORAGE_KEY);
    if (!existingData) return;
    
    const storageData: StorageData = JSON.parse(existingData);
    delete storageData.data[key];
    storageData.timestamp = new Date().toISOString();
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

export const clearAllStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

export const exportAllData = (): string | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data;
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
};

export const importData = (jsonString: string): boolean => {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.version && parsed.data) {
      localStorage.setItem(STORAGE_KEY, jsonString);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 7) return `${diffDays}天前`;
  
  return formatDate(dateString);
};

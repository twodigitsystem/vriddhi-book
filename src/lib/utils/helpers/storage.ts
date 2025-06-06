export const localStorageHelper = {
  set: (key: string, value: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  },
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  },
};

export const sessionStorageHelper = {
  set: (key: string, value: unknown) => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to sessionStorage:", error);
    }
  },
  get: <T>(key: string): T | null => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error reading from sessionStorage:", error);
      return null;
    }
  },
};

export const clearStorage = (storageType: "local" | "session") => {
  try {
    if (storageType === "local") {
      localStorage.clear();
    } else if (storageType === "session") {
      sessionStorage.clear();
    }
  } catch (error) {
    console.error(`Error clearing ${storageType}Storage:`, error);
  }
};

export const removeItem = (storageType: "local" | "session", key: string) => {
  try {
    if (storageType === "local") {
      localStorage.removeItem(key);
    } else if (storageType === "session") {
      sessionStorage.removeItem(key);
    }
  } catch (error) {
    console.error(`Error removing item from ${storageType}Storage:`, error);
  }
};

export const getItem = <T>(
  storageType: "local" | "session",
  key: string
): T | null => {
  try {
    if (storageType === "local") {
      return localStorageHelper.get<T>(key);
    } else if (storageType === "session") {
      return sessionStorageHelper.get<T>(key);
    }
    return null;
  } catch (error) {
    console.error(`Error getting item from ${storageType}Storage:`, error);
    return null;
  }
};

export const setItem = (
  storageType: "local" | "session",
  key: string,
  value: unknown
) => {
  try {
    if (storageType === "local") {
      localStorageHelper.set(key, value);
    } else if (storageType === "session") {
      sessionStorageHelper.set(key, value);
    }
  } catch (error) {
    console.error(`Error setting item in ${storageType}Storage:`, error);
  }
};

export const isStorageAvailable = (
  storageType: "local" | "session"
): boolean => {
  try {
    const testKey = "__storage_test__";
    if (storageType === "local") {
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
    } else if (storageType === "session") {
      sessionStorage.setItem(testKey, "test");
      sessionStorage.removeItem(testKey);
    }
    return true;
  } catch (error) {
    return false;
  }
};

export const getStorageKeys = (storageType: "local" | "session"): string[] => {
  try {
    if (storageType === "local") {
      return Object.keys(localStorage);
    } else if (storageType === "session") {
      return Object.keys(sessionStorage);
    }
    return [];
  } catch (error) {
    console.error(`Error getting keys from ${storageType}Storage:`, error);
    return [];
  }
};

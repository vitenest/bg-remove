const LIMITS = {
  image: {
    max: 25,
    windowMs: 15 * 60 * 1000 // 15 minutes
  },
  video: {
    max: 3,
    windowMs: 60 * 60 * 1000 // 60 minutes
  }
};

function getUsageHistory(type) {
  const history = localStorage.getItem(`usage_history_${type}`);
  if (!history) return [];
  try {
    return JSON.parse(history);
  } catch (e) {
    return [];
  }
}

function saveUsageHistory(type, history) {
  localStorage.setItem(`usage_history_${type}`, JSON.stringify(history));
}

function cleanupHistory(type) {
  const history = getUsageHistory(type);
  const now = Date.now();
  const limit = LIMITS[type];
  
  // Filter out timestamps that are older than the window
  const validHistory = history.filter(time => now - time < limit.windowMs);
  if (history.length !== validHistory.length) {
    saveUsageHistory(type, validHistory);
  }
  return validHistory;
}

export function canProcess(type) {
  const validHistory = cleanupHistory(type);
  const limit = LIMITS[type];
  return validHistory.length < limit.max;
}

export function getWaitTimeMs(type) {
  const validHistory = cleanupHistory(type);
  const limit = LIMITS[type];
  
  if (validHistory.length < limit.max) {
    return 0; // No wait time
  }
  
  // The user has to wait until the oldest timestamp falls out of the window
  const oldestTime = validHistory[0];
  const timeToWait = (oldestTime + limit.windowMs) - Date.now();
  return Math.max(0, timeToWait);
}

export function recordUsage(type) {
  const history = cleanupHistory(type);
  history.push(Date.now());
  saveUsageHistory(type, history);
}

// Utility to format ms into human-readable string (e.g., "14 minutes and 30 seconds")
export function formatWaitTime(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  if (minutes > 0 && seconds > 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} and ${seconds} second${seconds !== 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
}

export function getBrowserInfo() {
  const ua = navigator.userAgent;
  let browser = "Unknown Browser";
  let os = "Unknown OS";

  // Detect OS
  if (ua.indexOf("Win") !== -1) os = "Windows";
  else if (ua.indexOf("Mac") !== -1) os = "MacOS";
  else if (ua.indexOf("Linux") !== -1) os = "Linux";
  else if (ua.indexOf("Android") !== -1) os = "Android";
  else if (ua.indexOf("like Mac") !== -1) os = "iOS";

  // Detect Browser
  if (ua.indexOf("Firefox") !== -1) browser = "Firefox";
  else if (ua.indexOf("SamsungBrowser") !== -1) browser = "Samsung Browser";
  else if (ua.indexOf("Opera") !== -1 || ua.indexOf("OPR") !== -1) browser = "Opera";
  else if (ua.indexOf("Trident") !== -1) browser = "Internet Explorer";
  else if (ua.indexOf("Edge") !== -1 || ua.indexOf("Edg") !== -1) browser = "Edge";
  else if (ua.indexOf("Chrome") !== -1) browser = "Chrome";
  else if (ua.indexOf("Safari") !== -1) browser = "Safari";

  return { browser, os };
}

// Helper to manage a simple cookie
export function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

export function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function getPersonalizedGreeting() {
  const visits = getCookie("visits") || 0;
  
  const currentVisits = parseInt(visits) + 1;
  setCookie("visits", currentVisits, 30); // Save for 30 days

  if (currentVisits === 1) {
    return `Welcome! Experience ultra-fast, professional-grade background removal directly in your browser.`;
  } else {
    return `Welcome back! Ready to instantly transform more of your images and videos?`;
  }
}

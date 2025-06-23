import Cookies from "js-cookie";

// utils/timeFormatter.ts
export const formatTime = (): string => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}:${minutesStr} ${ampm}`;
};

// format date
export function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

// set token
export function setTokenCookie(token: string) {
  try {
    console.log('Setting token cookie');
    const oneYear = 365;
    Cookies.set("token", token, {
      expires: oneYear,
      sameSite: "strict",
      secure: window.location.protocol === 'https:',
      path: '/'
    });
    console.log('Token cookie set successfully');
  } catch (error) {
    console.error('Error setting token cookie:', error);
  }
}

// get token
export function getTokenCookie() {
  try {
    const token = Cookies.get("token");
    if (!token) {
      console.warn('No token found in cookies');
      return null;
    }
    return token;
  } catch (error) {
    console.error('Error getting token cookie:', error);
    return null;
  }
}

// remove token
export function removeTokenCookie() {
  try {
    console.log('Removing token cookie');
    Cookies.remove("token", { path: '/' });
    console.log('Token cookie removed successfully');
  } catch (error) {
    console.error('Error removing token cookie:', error);
  }
}

// comprehensive logout cleanup
export function clearAllLocalData() {
  try {
    // Clear token cookie
    removeTokenCookie();
    
    // Clear all cookies
    const allCookies = Object.keys(Cookies.get());
    console.log("Found cookies:", allCookies);
    allCookies.forEach(cookieName => {
      Cookies.remove(cookieName);
    });
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      const localStorageKeys = Object.keys(localStorage);
      localStorage.clear();
    }
    
    // Clear sessionStorage
    if (typeof window !== 'undefined') {
      const sessionStorageKeys = Object.keys(sessionStorage);
      sessionStorage.clear();
    }
    
    // Clear Redux persist storage
    if (typeof window !== 'undefined') {
      // Clear specific Redux persist keys
      const keysToRemove = ['persist:auth'];
      keysToRemove.forEach(key => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
        }
      });
    }
    
  } catch (error) {
    console.error("Error clearing local data:", error);
  }
}

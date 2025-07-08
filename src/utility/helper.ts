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
    console.log("Setting token cookie with value:", token ? "present" : "missing");
    Cookies.set("token", token, {
      expires: 1,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production", // Only secure in production
    });
    console.log("Token cookie set successfully");
    
    // Verify the cookie was set
    const verifyToken = Cookies.get("token");
    console.log("Verified token cookie:", verifyToken ? "present" : "missing");
  } catch (error) {
    console.error("Error setting token cookie:", error);
  }
}

// get token
export function getTokenCookie() {
  const token = Cookies.get("token");
  return token;
}

// remove token
export function removeTokenCookie() {
  Cookies.remove("token");
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

export function toSentenceCase(str: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function buildBlogFormData(data: any, status: string) {
  const formData = new FormData();
  formData.append('title', data.title || '');
  formData.append('content', JSON.stringify(data.content || ''));
  formData.append('status', status);
  formData.append('url', data.url || '');
  formData.append('slug', data.coverPageUrl || '');
  formData.append('blogId', data.blogId || '');

  ['categories', 'tags'].forEach(field => {
    (data[field] || []).forEach((item: string, idx: number) => {
      formData.append(`${field}[${idx}]`, item);
    });
  });

  if (data.coverPage && data.coverPage[0]) {
    formData.append('coverPage', data.coverPage[0]);
  }

  return formData;
}

export function addToList(list: string[], value: string): string[] {
  value = value.trim();
  if (!value || list.includes(value)) return list;
  return [...list, value];
}

export function removeFromList(list: string[], value: string): string[] {
  return list.filter(item => item !== value);
}

export function handleFileInput(e: React.ChangeEvent<HTMLInputElement>, setSelectedFile: (file: File | null) => void, setValue: (name: string, value: any, options?: any) => void, setFilePreview: (url: string | null) => void) {
  const file = e.target.files && e.target.files[0];
  if (file) {
    setSelectedFile(file);
    setValue('coverPage', [file]); // FIX: set to File object, not file name
    const url = URL.createObjectURL(file);
    setFilePreview(url);
  } else {
    setSelectedFile(null);
    setValue('coverPage', []);
    setFilePreview(null);
  }
}

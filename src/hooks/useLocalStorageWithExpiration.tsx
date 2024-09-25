import { useEffect, useState } from "react";

const useLocalStorageWithExpiration = (
  key,
  initialValue,
  daysUntilExpiration,
) => {
  const [storedValue, setStoredValue] = useState(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item).data : initialValue;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const storedData = JSON.parse(localStorage.getItem(key));

      // Check if data exists and if it has expired
      if (storedData && new Date(storedData.expires) < new Date()) {
        localStorage.removeItem(key);
        setStoredValue(initialValue);
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [key, initialValue]);

  const setValue = (newObject) => {
    const storedData = JSON.parse(localStorage.getItem(key)) || { data: [] };

    // Add the new object to the array (no merging, just pushing)
    const updatedData = [...storedData.data, newObject];

    // Set the new expiration time in days
    const newValue = {
      data: updatedData,
      expires: new Date(Date.now() + daysUntilExpiration * 24 * 60 * 60 * 1000), // Convert days to milliseconds
    };

    // Update state and local storage
    setStoredValue(updatedData);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  const deleteValue = (id) => {
    const storedData = JSON.parse(localStorage.getItem(key)) || { data: [] };
    const updatedData = storedData.data.filter((item) => item.id !== id);

    // Set the new expiration time
    const newValue = {
      data: updatedData,
      expires: new Date(Date.now() + daysUntilExpiration * 24 * 60 * 60 * 1000),
    };

    // Update state and local storage
    setStoredValue(updatedData);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [storedValue, setValue, deleteValue];
};

export default useLocalStorageWithExpiration;

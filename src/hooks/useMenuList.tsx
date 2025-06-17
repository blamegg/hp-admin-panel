import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import { AppDispatch, RootState } from '@/redux/store';
import { getMenuList } from '@/redux/slice/menuList';

/**
 * Custom hook to manage menu list loading with conditional logic
 * 
 * This hook ensures that:
 * 1. Menu list API is only called when user is logged in
 * 2. Menu list is only loaded on specific pages that need it
 * 3. Menu list is cached for 5 minutes to avoid unnecessary API calls
 * 4. Menu list is automatically refreshed when cache expires
 * 
 * @returns {Object} Object containing menu list data and loading states
 */
export const useMenuList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  
  // Get authentication state from Redux
  const { user } = useSelector((state: RootState) => state.authReducer);
  const { menuList, menuListStatus, lastFetched } = useSelector((state: RootState) => state.menu);
  const isLoggedIn = !!user;
  
  // Define pages that require menu list data
  // This prevents unnecessary API calls on pages that don't need menu data
  const pagesNeedingMenuList = ['/users', '/roles', '/permissions', '/dashboard'];
  const shouldLoadMenuList = isLoggedIn && pagesNeedingMenuList.some(page => pathname.includes(page));
  
  // Implement caching logic - cache expires after 5 minutes
  const cacheExpired = lastFetched ? (Date.now() - lastFetched) > (5 * 60 * 1000) : true;
  const shouldFetchMenuList = shouldLoadMenuList && (menuListStatus === "idle" || cacheExpired);

  // Fetch menu list when conditions are met
  useEffect(() => {
    if (shouldFetchMenuList) {
      console.log('Loading menu list for page:', pathname);
      dispatch(getMenuList());
    }
  }, [shouldFetchMenuList, dispatch]);

  return {
    menuList,
    menuListStatus,
    isLoggedIn,
    shouldLoadMenuList,
    isLoading: menuListStatus === "loading",
  };
}; 
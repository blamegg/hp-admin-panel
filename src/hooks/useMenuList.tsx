import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import { AppDispatch, RootState } from '@/redux/store';
import { getMenuList } from '@/redux/slice/menuList';

/**
 * Custom hook to manage dynamic menu list loading
 * 
 * This hook ensures that:
 * 1. Dynamic menu list API is called when user is logged in
 * 2. Menu list is cached for 5 minutes to avoid unnecessary API calls
 * 3. Menu list is automatically refreshed when cache expires
 * 4. Uses role-based menu endpoint (/api/v1/menus/role)
 * 
 * @returns {Object} Object containing menu list data and loading states
 */
export const useMenuList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const hasFetchedRef = useRef(false);
  
  // Get authentication state from Redux
  const user = useSelector((state: RootState) => state.authReducer.user);
  const menuList = useSelector((state: RootState) => state.menu.menuList);
  const menuListStatus = useSelector((state: RootState) => state.menu.menuListStatus);
  const lastFetched = useSelector((state: RootState) => state.menu.lastFetched);
  
  const isLoggedIn = !!user;
  
  // Load menu list on all pages when user is logged in
  const shouldLoadMenuList = isLoggedIn;
  
  // Implement caching logic - cache expires after 5 minutes
  const cacheExpired = lastFetched ? (Date.now() - lastFetched) > (5 * 60 * 1000) : true;
  const shouldFetchMenuList = shouldLoadMenuList && (menuListStatus === "idle" || cacheExpired);

  // Fetch dynamic menu list when conditions are met
  useEffect(() => {
    if (shouldFetchMenuList && !hasFetchedRef.current) {
      console.log('🔄 useMenuList: Fetching menu list');
      hasFetchedRef.current = true;
      dispatch(getMenuList());
    }
  }, [shouldFetchMenuList, dispatch]);

  // Reset the ref when user changes
  useEffect(() => {
    hasFetchedRef.current = false;
  }, [user]);

  return {
    menuList,
    menuListStatus,
    isLoggedIn,
    shouldLoadMenuList,
    isLoading: menuListStatus === "loading",
  };
}; 
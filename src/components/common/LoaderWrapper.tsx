import Loader from './Loader';
import React from 'react';

const LoaderWrapper = ({ loading, children }: { loading: boolean, children: React.ReactNode }) => {
  if (loading) return <Loader />;
  return <>{children}</>;
};

export default LoaderWrapper; 
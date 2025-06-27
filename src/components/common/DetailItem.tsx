import React from 'react';

interface DetailItemProps {
  label: string;
  value: string | number | undefined | null;
  valueClassName?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value, valueClassName }) => {
  // Styles that will ALWAYS be applied for structure and spacing
  const structuralClasses = 'px-2 rounded-md shadow-sm py-1 mt-1';
  
  // Default cosmetic styles, used only if no custom class is provided
  const defaultCosmeticClasses = 'bg-white border border-blue-200';

  const finalClasses = `${structuralClasses} ${valueClassName || defaultCosmeticClasses}`;

  return (
    <div>
      <span className="font-medium text-gray-600 ">{label}</span>
      <p className={finalClasses}>
        {value || 'N/A'}
      </p>
    </div>
  );
};

export default DetailItem; 
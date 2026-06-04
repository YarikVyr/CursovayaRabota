import React from 'react';
import s from './Scrollbar.module.scss';

export default function Scrollbar({ children, className, maxWeight }) {
  const combinedClasses = `${s.scrollContainer} ${className || ''}`.trim();

  return (
    <div 
      className={combinedClasses} 
      style={maxWeight ? { maxHeight: maxWeight } : {}}
    >
      {children}
    </div>
  );
}
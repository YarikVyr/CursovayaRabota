// Основные настройки кнопки

import React from 'react';
import s from './Button.module.scss';

export const Button = ({  children, variant = 'primary', className, width, height, radius, ...props }) => {

  const customStyles = {
    '--btn-width': width,
    '--btn-height': height,
    '--btn-radius': radius,
  };

return (
    <button 
      className={`${s.button} ${s[variant]} ${className || ''}`} 
      style={customStyles}
      {...props}
    >
      {children}
    </button>
  );
};
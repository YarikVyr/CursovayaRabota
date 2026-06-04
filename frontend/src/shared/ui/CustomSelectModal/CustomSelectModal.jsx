import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './CustomSelectModal.module.scss';

export const CustomSelectModal = ({ value, onChange, options, placeholder, disabled, className, onFocus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    if (onChange) onChange({ target: { value: optionValue } });
    setIsOpen(false); 
  };

  const selectedOption = options.find(opt => opt.id === value);

  return (
    <div 
      ref={containerRef} 
      className={`${styles.selectContainer} ${isOpen ? styles.isOpen : ''} ${disabled ? styles.disabled : ''} ${className || ''}`}
    >
      <div 
        className={styles.selectHeader} 
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            // Если селект открывают, вызываем onFocus, чтобы сбросить красную рамку
            if (!isOpen && onFocus) onFocus();
          }
        }}
      >
        <span className={value ? styles.selectedValue : styles.placeholder}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <ChevronDown className={styles.arrow} />
      </div>

      {isOpen && (
        <div className={styles.optionsList}>
          {options.map((option) => (
            <div 
              key={option.id} 
              className={`${styles.option} ${option.id === value ? styles.selected : ''}`}
              onClick={() => handleSelect(option.id)}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
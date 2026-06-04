import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './CustomSelectTab.module.scss'; 

export const CustomSelectTab = ({ 
  value, 
  onChange, 
  options, 
  placeholder, 
  disabled, 
  className
}) => {
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
    if (onChange) {
      onChange({ target: { value: optionValue } });
    }
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.id === value);

  return (
    <div 
      ref={containerRef} 
      className={`
        ${styles.selectContainer} 
        ${isOpen ? styles.isOpen : ''} 
        ${value ? styles.hasValue : styles.isEmpty}
        ${disabled ? styles.disabled : ''}
        ${className || ''}
      `.trim()}
    >
      <div 
        className={styles.selectHeader} 
        onClick={() => !disabled && setIsOpen(!isOpen)} 
      >
        <span className={value ? styles.selectedValue : styles.placeholder}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <ChevronDown className={styles.arrow} />
      </div>

        {isOpen && (
          <div 
            className={styles.optionsList} 
            onClick={(e) => e.stopPropagation()} 
          >
            {options.map((opt) => (
              <div 
                key={opt.id} 
                className={styles.option}
                onClick={() => handleSelect(opt)}
              >
                {opt.name}
              </div>
            ))}
          </div>
        )}
    </div>
  );
};
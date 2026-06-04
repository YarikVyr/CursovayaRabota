import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './CustomSelect.module.scss';

export const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  error,
  className,
  absoluteMode = false,
  variant = 'default'
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

  useEffect(() => {
    if (disabled) setIsOpen(false);
  }, [disabled]);

  const handleSelect = (optionValue) => {
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
  };

  const toggleOpen = () => {
    if (!disabled) setIsOpen(prev => !prev);
  };

  const selectedOption = options.find(opt => opt.id === value);

  return (
    <div
      ref={containerRef}
      className={`
        ${styles.selectContainer}
        ${isOpen ? styles.isOpen : ''}
        ${disabled ? styles.disabled : ''}
        ${error ? styles.error : ''}
        ${absoluteMode ? styles.absoluteMode : ''}
        ${styles[variant]}
        ${className || ''}
      `}
    >
      <button
        className={styles.selectHeader}
        onClick={toggleOpen}
        type="button"
        disabled={disabled}
        aria-expanded={isOpen}
      >
        <span className={value ? styles.selectedValue : styles.placeholder}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <ChevronDown className={styles.arrow} />
      </button>

      {isOpen && (
        <div className={styles.optionsList}>
          {options.map((option) => (
            <button
              key={option.id}
              className={`${styles.option} ${option.id === value ? styles.selected : ''}`}
              onClick={() => handleSelect(option.id)}
              type="button"
            >
              {option.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

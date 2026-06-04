// Основные настройки пагинатора

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Pagination.module.scss';

// Компонент пагинации
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  
  // Функция для перехода на предыдущую страницу, срабатывает, только если мы не на первой странице
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  // Функция для перехода на следующую страницу, срабатывает, только если есть куда листать дальше
  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className={styles.paginationWrapper}>
      <button 
        className={styles.arrowBtn} 
        onClick={handlePrev}
        disabled={currentPage === 1}
      >
        <ChevronLeft />
      </button>

      <span className={styles.pageNumber}>{currentPage}</span>

      <button 
        className={styles.arrowBtn} 
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        <ChevronRight />
      </button>
    </div>
  );
}
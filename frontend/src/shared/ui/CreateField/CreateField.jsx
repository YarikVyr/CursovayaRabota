import React from 'react';
import styles from './CreateField.module.scss';

export default function CreateField({ onClick }) {
  return (
    <button className={styles.card} onClick={onClick} type="button" aria-label="Создать проект">
      <span className={styles.plus}>+</span>
    </button>
  );
}

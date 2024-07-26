import React from 'react';
import styles from './GoButton.module.css';

const GoButton = ({text,onClick}) => {
  return (
    <button onClick={onClick} className={styles.button}>
        <span>{text}</span>
        <img className={styles.arrow} src= "./images/arrowForward.png" alt = "go"></img>
    </button>
  )
}

export default GoButton
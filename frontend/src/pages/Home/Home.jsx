import React from 'react';
import styles from './Home.module.css';
import { Link,useNavigate } from 'react-router-dom';
import Card from '../../components/shared/Card/Card';
import GoButton from '../../components/shared/Button/GoButton';

const Home = () => {
  // const signInLink ={
  //   color: '#0761c8',
  //   fontWeight: 'Bold',
  //   textDecoration: 'none',
  //   marginLeft: '10px',
  // }
  const navigate = useNavigate();

  function startRegister(){
    
    navigate("/authenticate");

    console.log("Button Clicked....");
  }
  return (
    <div className = {styles.cardWrapper}>
      <Card title="Welcome to Gamershouse!" icon ="hello">
      <p className={styles.text}>
          We're working hard to get Gamershouse ready for you! 
          While we wrap up the finishing touches, 
          we're adding people gradually to make sure nothing breaks 
        </p>
        <div className={styles.button}>
          <GoButton onClick={startRegister} text="Lets Go"></GoButton>
        </div>
        <div className={styles.bottomlink}>
          <span className={styles.hasinvite}>Have an invite text?</span>
        </div>
      </Card>
    </div>
    
  );
}

export default Home;
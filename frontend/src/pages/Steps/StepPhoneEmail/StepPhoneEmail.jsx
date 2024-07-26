import {React ,useState} from 'react'
import Phone from './Phone/Phone';
import Email from './Email/Email';
import styles from './StepPhoneEmail.module.css';

const phoneEmailMap ={
  phone : Phone,
  email : Email,
}


const StepPhoneEmail = ({onNext}) => {

  const [type, setType] = useState('phone');
  const Component = phoneEmailMap[type];

  return (
    <>
      <div className ={styles.cardWrapper}>
        <div>
          <div className = {styles.buttonWrapper}>
            <button className = {`${styles.tabbutton} ${type === 'phone' ? styles.active:''}`} onClick={() => setType('phone')}>
              <img src = "/images/phone_android.png" alt ="phone"/>
            </button>
            <button className = {`${styles.tabbutton} ${type === 'email' ? styles.active:''}`} onClick={() => setType('email')}>
              <img src = "/images/email_web.png" alt ="email"/>
            </button>
          </div>
          <Component onNext = {onNext}/>
        </div> 
      </div>
    </>
  );
}
export default StepPhoneEmail;
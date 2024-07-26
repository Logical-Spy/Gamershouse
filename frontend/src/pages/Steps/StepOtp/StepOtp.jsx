import {React, useState} from 'react'
import styles from './StepOtp.module.css';
import GoButton from '../../../components/shared/Button/GoButton';
import TextInput from '../../../components/shared/TextInput/TextInput';
import Card from '../../../components/shared/Card/Card';
import { verifyOtp } from '../../../http';
import { useSelector } from 'react-redux';
import { setAuth } from '../../../store/authSlice';
import { useDispatch } from 'react-redux';

const StepOtp = () => {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState('');
  const {phone, hash} = useSelector((state) => state.auth.otp);

  async function submit() {
    if(!otp || !phone || !hash) return;
    try{
      const {data} = await verifyOtp({ otp, phone , hash});
      // console.log(data);
      dispatch(setAuth(data));
    }
    catch(err){
      console.log(err);
    }

  };
  return (
    <>
      <div className={styles.cardWrapper}>

        <Card
          title = "Enter the code we just texted you"
          icon = "locklogo"
        >

        <TextInput 
        value = {otp}
        onChange = {(e) => setOtp(e.target.value)}
        />

        <div className={styles.actionButtonWrap}>
          <GoButton onClick ={submit} text="Next"/>
        </div>

        <p className={styles.bottomParagraph}>
            Didn’t receive? Tap to resend
        </p>
        </Card>

      </div>
    </>
  )
}

export default StepOtp;
import {React, useState} from 'react'
import Card from '../../../../components/shared/Card/Card';
import GoButton from '../../../../components/shared/Button/GoButton';
import TextInput from '../../../../components/shared/TextInput/TextInput';
import styles from '../StepPhoneEmail.module.css';
import { sendOtp } from '../../../../http/index';
import { useDispatch } from 'react-redux';
import { setOtp } from '../../../../store/authSlice';


const Phone = ({ onNext }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const dispatch = useDispatch();

    async function submit(){
        if(!phoneNumber){
            return;
        }
        // server req
        // try{
            const { data } = await sendOtp({phone:phoneNumber});
            console.log(data);
            dispatch(setOtp({phone : data.phone, hash: data.hash}));
            onNext();
        // }
        // catch(err){
        //     console.log(err);
        //     alert("Phone Number field is required !");
        // }
    }
  return (

      <Card title="Enter Your Phone Number" icon ="phonelogo">

        <TextInput 
        value={phoneNumber} 
        onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <div>
            <div className ={styles.actionButtonwrap}>
                <GoButton text="Next" onClick ={submit} ></GoButton>
            </div>

            <p className={styles.bottomParagraph}>
                By entering your number,
                you’re agreeing to our Terms of Service 
                and Privacy Policy. Thanks!
            </p>
        </div>
      </Card>
  )
}

export default Phone;
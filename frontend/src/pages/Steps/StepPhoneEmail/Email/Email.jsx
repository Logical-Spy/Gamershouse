import {React, useState} from 'react'
import Card from '../../../../components/shared/Card/Card';
import GoButton from '../../../../components/shared/Button/GoButton';
import TextInput from '../../../../components/shared/TextInput/TextInput';
import styles from '../StepPhoneEmail.module.css';
const Email = ({ onNext }) => {
    const [emailId, setEmailId] = useState('');
  return (
    <Card title="Enter Your Email Id" icon ="emaillogo">
        <TextInput 
        value={emailId} 
        onChange={(e) => setEmailId(e.target.value)}
        />
    <div>
        <div className ={styles.actionButtonwrap}>
            <GoButton text="Next" onClick={onNext} ></GoButton>
        </div>

        <p className={styles.bottomParagraph}>
            By entering your email,
            you’re agreeing to our Terms of Service 
            and Privacy Policy. Thanks!
        </p>
    </div>
    </Card>
)
}

export default Email;
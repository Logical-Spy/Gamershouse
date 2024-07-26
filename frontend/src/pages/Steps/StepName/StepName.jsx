import React, { useState } from 'react'
import Card from '../../../../src/components/shared/Card/Card';
import GoButton from '../../../../src/components/shared/Button/GoButton';
import TextInput from '../../../../src/components/shared/TextInput/TextInput';
import { useDispatch, useSelector } from 'react-redux';
import { setName } from '../../../store/activateSlice';
import styles from './StepName.module.css';

const StepName = ({onNext}) => {
  const {name} =  useSelector((state) => state.activate);
  const dispatch = useDispatch();
  const [fullname, setFullName] = useState(name);

  function nextStep(){
    if(!fullname){
      return;
    }
    dispatch(setName(fullname));
    onNext();
  }
  return (
    <>
      <Card
          title = "What's your Full Name?"
          icon = "glasses"
        >
        <TextInput 
        value = {fullname}
        onChange = {(e) => setFullName(e.target.value)}
        />

        <p className={styles.paragraph}>
          Gamers use real name at Gamershouse :) !
        </p>
        
        <div >
          <GoButton onClick ={nextStep} text="Next"/>
        </div>

        </Card>
    </>
  )
}

export default StepName;
import React , {useEffect, useState} from 'react'
import Card from '../../../../src/components/shared/Card/Card';
import GoButton from '../../../../src/components/shared/Button/GoButton';
import styles from './StepAvatar.module.css';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setAvatar } from '../../../store/activateSlice';
import { activate } from '../../../http';
import { setAuth } from '../../../store/authSlice';
import Loader from '../../../components/shared/Loader/Loader';

const StepAvatar = ({onNext}) => {
  const dispatch = useDispatch();
  const {name, avatar} = useSelector((state) => state.activate);
  const [image, setImage] = useState('/images/monkey-avatar.jpg');
  const [loading, setLoading] = useState(false);
  // const [unMounted, setUnMounted] = useState(false);

  function captureImage(e){
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function(){
      setImage(reader.result);
      dispatch(setAvatar(reader.result));
    }
  }
  
  async function submit (){
    if(!avatar || !name) return;
    setLoading(true);
    try{
      const {data} = await activate({name, avatar});
      if(data.auth){
        // if(!unMounted){
          dispatch(setAuth(data));
        // }
        
      }
    }catch(err){
      console.log(err);
    }
  //   }finally{
  //     setLoading(false);
  //   }
  }
  
  // useEffect(() => {
  //   return() => {
  //     setUnMounted(true);
  //   }
  // }, []);

  if(loading) return <Loader message = "Activation in progress..."/>
  return (
    <>
      <Card
          title = {`Okay, ${name} `}
          icon = "monkey"
        >
        <p className ={styles.subHeading}>How's this photo?</p>
        <div className = {styles.avatarWrapper}>
          <img className={styles.avatarimage} src = {image} alt='avatar'/>
        </div>
        <div>
          <input 
          onChange={captureImage}
          id = "avatarInput"
          type= "file" 
          className={styles.avatarInput}
          />
          <label className={styles.avatarLabel} htmlFor="avatarInput">Choose a diffrent photo</label>
        </div>
        <div >
          <GoButton onClick ={submit} text="Next"/>
        </div>

        </Card>
    </>
  )
}

export default StepAvatar;
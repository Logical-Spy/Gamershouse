import React, { useEffect, useState, useRef } from 'react'
import styles from './Rooms.module.css';
import RoomCard from '../../components/shared/RoomCard/RoomCard';
import AddRoomModal from '../../components/AddRoomModal/AddRoomModal';
import { getAllRooms } from '../../http';

// const rooms = [
//   {
//     id: 1,
//     topic: "Topic room 1",
//     speakers: [
//       {
//         id: 1,
//         name: 'John Doe',
//         avatar: '/images/monkey-avatar.jpg',
//       },
//       {
//         id: 2,
//         name: 'John Wick',
//         avatar: '/images/monkey-avatar.jpg',
//       },
//     ],
//     totalPeople: 40,
//   },
//   {
//     id: 2,
//     topic: "Topic room 2",
//     speakers: [
//       {
//         id: 1,
//         name: 'John Doe',
//         avatar: '/images/monkey-avatar.jpg',
//       },
//       {
//         id: 2,
//         name: 'John Wick',
//         avatar: '/images/monkey-avatar.jpg',
//       },
//     ],
//     totalPeople: 30,
//   }
// ]

const Rooms = () => {
  const [showModal, setShowModal] = useState(false);
  const [rooms, setRooms] = useState([]);
  const fetching = useRef(false);

  useEffect(() => {
    const fetchRooms = async () => {
      if (fetching.current) return;
      fetching.current = true;

      try {
        const { data } = await getAllRooms();
        setRooms(data);
      } catch (err) {
        console.log('Error fetching rooms:', err);
      } finally {
        fetching.current = false; 
      }
    };

    fetchRooms();

  }, []);

  function openModal() {
    setShowModal(true);
  }
  return (
    <>
      <div className='container'>
        <div className={styles.roomsHeader}>
          <div className ={styles.left}>
            <span className={styles.heading}>All Voice Rooms</span>
            <div className={styles.searchBox}>
              <img src="/images/search.png" alt="search" />
              <input type="text" className = {styles.searchInput}></input>
            </div>
          </div>
          <div className={styles.right}>
            <button onClick = {openModal} className={styles.startRoomButton}>
              <img src="/images/speaker.png" alt="add-room" />
              <span>Start a room</span>
            </button>
          </div>
        </div>
        <div className={styles.roomList}>
          {
            rooms.map((room) => (
              <RoomCard key={room.id} room = { room }/>
            ) )
          }
          
        </div>
      </div>
      {showModal && <AddRoomModal onClose = {() => setShowModal(false)}></AddRoomModal>}
    </>
  )
}

export default Rooms;
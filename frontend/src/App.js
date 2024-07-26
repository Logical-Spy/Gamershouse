
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Navigation from './components/shared/Navigation/Navigation';
import Authenticate from './pages/Authenticate/Authenticate';
import Activate from './pages/Activate/Activate';
import Rooms from './pages/Rooms/Rooms';
import Room from './pages/Room/Room';
import { useSelector } from 'react-redux';
import { useLoadingWithRefresh } from './hooks/useLoadingWithRefresh';
import Loader from './components/shared/Loader/Loader';

function App() {
  // Call refresh End Point.
  const { loading } = useLoadingWithRefresh();
  return loading ?(
    <Loader message="Loading, Please Wait..."></Loader>
  ):(
    <Router>
      <Navigation />
      <Routes>
      <Route
          path="/" 
          element={
            <GuestRoute element={<Home />} />
          }
        />
        <Route
          path="/authenticate"
          element={
            <GuestRoute element={<Authenticate />} />
          }
        />
        <Route 
        path="/activate"
        element={
          <SemiProtected element={<Activate/>}/>
        }
        />
        <Route 
        path="/rooms"
        element={
          <Protected element={<Rooms/>}/>
        }
        />
        <Route 
        path="/rooms/:id"
        element={
          <Protected element={<Room/>}/>
        }
        />
      </Routes>
    </Router>
  );
}


const GuestRoute = ({ element }) => {
  const { isAuth } = useSelector((state) => state.auth);
  return isAuth ? (
    <Navigate to="/rooms" />
  ) : (
    element
  );
};

const SemiProtected = ({ element }) => {
  const { user, isAuth } = useSelector((state) => state.auth);
  return !isAuth ? (
    <Navigate to="/"/>
  ) : (
    isAuth && !user.activated ? (
      element
    ) : (
      <Navigate to="/rooms"/>
    )
  );
};

const Protected = ({element}) => {
  const { user, isAuth } = useSelector((state) => state.auth);
  return !isAuth ? (
    <Navigate to="/"/>
  ) : (
    isAuth && !user.activated ? (
      <Navigate to="/activate"/>
    ) : (
      element
    )
  );
}
export default App;


import './App.css';
import NaveBar from './Components/NaveBar/NaveBar';
import { Outlet } from 'react-router';

function App() {



  return (
   
    <>
  
   <NaveBar/>
   <Outlet/>

    </>

  );
}

export default App;

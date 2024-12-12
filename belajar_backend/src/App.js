import './App.css';
import Home from './Pages/Home';
import {Route, Routes} from 'react-router-dom'
import Tambah from './Pages/Tambah';
import Login from './Pages/login';
import Register from './Pages/Register';
import Profile from './Pages/Profile'; 
function App() {
  return (
   <Routes>
     <Route path="/register" element={<Register />} />
    <Route path="/" element={<Login />} />
    <Route path="/login" element={<Login />} />
    <Route path='/home' element={<Home/>} />
    <Route path='/tambah' element={<Tambah/>} />
    <Route path='/update/:id' element={<Tambah/>} />
    <Route path="/profile" element={<Profile />} />
   </Routes>
  );
}

export default App;
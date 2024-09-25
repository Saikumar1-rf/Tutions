import logo from './logo.svg';
import './App.css';
import { Routes,Route } from 'react-router-dom';
import Login from './Login';
import Forgotpassword from './Forgotpassword';
import Student from './Student';
import Tutor from './Tutor';

function App() {
  return (
    <div className="App">
       <Routes>
   <Route path='/' element={<Login/>}></Route>
   <Route path='/login'element={<Login/>}></Route>
    <Route path='/login' element={<Login/>}></Route>
   <Route path='/forgotpassword' element={<Forgotpassword/>}></Route>
   <Route path='/student'element={<Student/>}></Route>
   <Route path='/tutor'element={<Tutor/>}></Route>
   </Routes>
    </div>
  );
}

export default App;

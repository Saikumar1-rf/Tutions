import logo from './logo.svg';
import './App.css';
import { Routes,Route } from 'react-router-dom';
import Login from './Login';
import Forgotpassword from './Forgotpassword';

function App() {
  return (
    <div className="App">
       <Routes>
   <Route path='/' element={<Login/>}></Route>
   <Route path='/login'element={<Login/>}></Route>
    <Route path='/login' element={<Login/>}></Route>
   <Route path='/forgotpassword' element={<Forgotpassword/>}></Route>
  
   </Routes>
    </div>
  );
}

export default App;

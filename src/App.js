import logo from './logo.svg';
import './App.css';
import { Routes,Route } from 'react-router-dom';
import Login from './Login';
import Forgotpassword from './Forgotpassword';
import Student from './Student';
import SignUp from './SignUp';
import React, { useState } from 'react'; 
import Successfull from './Successfull';

function App() {

  const [isSubmitted, setIsSubmitted] = useState(false); // Initialize state here

  return (
    <div className="App">
       <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotpassword" element={<Forgotpassword />} />
          <Route path="/student" element={<Student />} />
          <Route path="/tutor" element={<SignUp setIsSubmitted={setIsSubmitted} />} />
          <Route path="/success" element={<Successfull isSubmitted={isSubmitted} />} />
        </Routes>
    </div>
  );
}

export default App;

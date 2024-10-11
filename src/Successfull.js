import React from 'react';
import { Navigate } from 'react-router-dom';




const Successfull = ({isSubmitted}) => {
  if (!isSubmitted) {
    return <Navigate to="/tutor" />;
  }
  return (
    <div className="max-w-3xl sm-640px mx-auto mt-10 p-10 bg-white border border-gray-300 rounded-lg shadow-lg">
      <h1>Successful Register </h1> 
      <h1>Payment has been Initiated</h1>
    </div>
  );
}

export default Successfull;
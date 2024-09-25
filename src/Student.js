import React, { useState } from 'react'

const Student = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phoneNumber: '',
        dateofbirth: '',
        location: '',
        gender: '',
        studyingclass: '',
        board: '',
        school: '',
        subject: '',
        teaching: '',
        afford:'',
        timings: '',
    })

    const [errors, setErrors] = useState({});
    const [isLocationDetected, setIsLocationDetected] = useState(false); // Prevent multiple detections
    
    //Date of Birth
    const isLeapYear = (year) => {
      return (year % 4 === 0 && year % 100 !==0) || year % 400 ===0;
    };
    const getDaysInMonth = (month, year) => {
      switch (parseInt(month)) {
        case 1: // January
        case 3: // March
        case 5: // May
        case 7: // July
        case 8: // August
        case 10: // October
        case 12: // December
          return 31;
        case 4: // April
        case 6: // June
        case 9: // September
        case 11: // November
          return 30;
        case 2: // February
          return isLeapYear(year) ? 29 : 28;
        default:
          return 31;
      }
    };

    // const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      setErrors({});

      const validationErrors = validate();
      if(Object.keys(validationErrors).length === 0) {
        console.log('form submitted successfully', formData);
        // setIsSuccessModalVisible(true);
      } else {
        setErrors(validationErrors);
      };
    }

    const handleChange = (e) => {
      const {name, value} = e.target;
      let newValue = value.trimStart();
      const today = new Date();
      const CurrentYear = today.getFullYear();
      const [year, month, day] = value.split('-');
      let errorMsg = '';

      if(year && (year.length !== 4 || parseInt(year) > CurrentYear)) {
        errorMsg = 'Year should be 4 digits and not greater than the current year.';
      }
       // Validate month (1-12)
    if (month && (parseInt(month) < 1 || parseInt(month) > 12)) {
      errorMsg = 'Month should be between 1 and 12.';
    }

    // Validate day based on the number of days in the month and year
    const maxDays = getDaysInMonth(month, year);
    if (day && (parseInt(day) < 1 || parseInt(day) > maxDays)) {
      errorMsg = `Day should be between 1 and ${maxDays} for the selected month and year.`;
    }

      if(name === 'email') {
        newValue = value.replace(/\s+/g, '').toLowerCase();
      }
      
      setFormData({
        ...formData,
        [name]: newValue,
        // dateofbirth : value,
      });
      // setErrors({
      //   ...errors,
      //   dateofbirth: errorMsg,
      // })
    }

     // Function to detect the user's location using the Geolocation API
  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          // Use reverse geocoding to get the city, state, area, and country
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
          )
            .then((response) => response.json())
            .then((data) => {
              const { suburb, city, state, country } = data.address; // suburb = area/neighborhood
              const exactLocation = `${suburb}, ${city}, ${state}, ${country}`;
              
              // Set the location as "Area, City, State, Country"
              setFormData((prevFormData) => ({
                ...prevFormData,
                location: exactLocation,
              }));
              setIsLocationDetected(true); // Mark as detected to prevent re-fetch
            })
            .catch((error) =>
              setErrors((prevErrors) => ({
                ...prevErrors,
                location: "Unable to retrieve location",
              }))
            );
        },
        (error) => {
          console.error("Error detecting location:", error);
          setErrors((prevErrors) => ({
            ...prevErrors,
            location: "Unable to detect location",
          }));
        }
      );
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        location: "Geolocation is not supported by this browser",
      }));
    }
  };

   // Handle the onFocus event to detect location when the input is focused
   const handleFocus = () => {
    if (!isLocationDetected) {
      detectLocation(); // Detect location only if not already detected
    }
  };

    //validate first Name
    const handleNameChar = (e)=> {
      const key = e.key;
      const value = e.target.value;

      const nameRegex = /^[A-Za-z]/; 
      let newError = {};

      if ((value === "" && key === " ") || !/[a-zA-Z\s]/.test(key)) {
        e.preventDefault();
      }
      else if (!nameRegex.test(value)) {
        newError.Organizationname = "Must start with a Character";
      }

    }

    const handleInput = (e) => {
      const { name, value } = e.target;
      if (name === "email") {
        e.target.value = value.replace(/\s+/g, "");
      }
    };

    const validate = ()=>{
      const newErrors = {};
      //first Name
      if(!formData.firstname.trim()) {
        newErrors.firstname = 'First Name is required';
      } else if (formData.firstname.length<4) {
        newErrors.firstname = 'First Name must be at least 4 characters';
      }
      //last Name
      if(!formData.lastname.trim()) {
        newErrors.lastname = 'last Name is required';
      } else if(formData.lastname.length<4) {
        newErrors.lastname = 'Last Name must be at least 4 characters';
      }
      //email
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+\.(com|net|edu|org|gov|mil|in|co|us|info|io|biz)$/;
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      //phoneNumber
      const phoneRegex = /^[6-9]\d{9}$/;
      if(!formData.phoneNumber) {
        newErrors.phoneNumber = 'Phone number is required';
      } else if (!phoneRegex.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Phone number must be 10 digits and start with 6-9'
      }
      
      //board
      if(!formData.board.trim()) {
        newErrors.board = 'Board is required';
      }

      //school/college
      if (!formData.school.trim()) {
        newErrors.school = 'School is required';
      }

      //date of birth
      if(!formData.dateofbirth.trim()) {
        newErrors.dateofbirth = 'Date of Birth is required';
      }

      //location
      if(!formData.location.trim()) {
        newErrors.location = 'location is required';
      }

      //gender
      if(!formData.gender.trim()) {
        newErrors.gender = 'Gender is required';

        
      }

       //studying class
       if(!formData.studyingclass.trim()) {
        newErrors.studyingclass = 'Studying Class is required';
      }

       //Subject
       if(!formData.subject.trim()) {
        newErrors.subject = 'Subject tuition looking for is required';
      }

       //mode of teaching
       if(!formData.teaching.trim()) {
        newErrors.teaching = 'Mode of teaching is required';
      }

       //affordability
       if(!formData.afford.trim()) {
        newErrors.afford = 'Your Affordability per month is required';
      }

       //timings
       if(!formData.timings.trim()) {
        newErrors.timings = 'timings is required';
      }

      return newErrors;
    }

   
  return (
    <div className="w-[650px]  mx-auto border border-gray-400 p-4">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
        Sign Up as a Student
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="flex ">
          {/* {/ ---------first Name------------ /} */}
          <div className="my-2 relative">
            <label className="float-start text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              minLength={4}
              maxLength={20}
              name="firstname"
              onChange={handleChange}
              onKeyDown={handleNameChar}
              value={formData.firstname}
              placeholder="Enter your First Name"
              className={`w-[300px] py-2 px-2 mr-6 border border-gray-500 outline-none rounded-md ${
                errors.firstname ? "border-red-500" : ""
              }`}
            ></input>
            {errors.firstname && (
              <span className="text-red-500 text-sm">{errors.firstname}</span>
            )}
          </div>

          {/* {/ ------------Last Name--------------- /} */}

          <div className="my-2">
            <label className="float-start text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              minLength={4}
              maxLength={20}
              name="lastname"
              onChange={handleChange}
              onKeyDown={handleNameChar}
              value={formData.lastname}
              placeholder="Enter your Last Name"
              className={`w-[300px] py-2 px-2 mr-6 border border-gray-500 outline-none rounded-md ${
                errors.lastname ? "border-red-500" : ""
              }`}
            ></input>
            {errors.firstname && (
              <span className="text-red-500 text-sm">{errors.lastname}</span>
            )}
          </div>
        </div>

        <div className="flex gap-6">
          {/* {/ --------------Email-------------------- /} */}
          <div className="my-2">
            <label className="float-start text-sm font-medium text-gray-700">
              Email Id
            </label>
            <input
              type="email"
              id="email"
              name="email"
              maxLength={30}
              value={formData.email}
              onChange={handleChange}
              onInput={handleInput}
              placeholder="Enter your Email Id"
              className={`w-[300px] py-2 px-2 border border-gray-500 outline-none rounded-md ${
                errors.email ? "border-red-500" : ""
              }`}
            ></input>
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          {/* {/ --------------Phone Number---------------------- /} */}
          <div className="my-2">
            <label className="float-start text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              maxLength={10}
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
                if (e.target.value && !/^[6-9]/.test(e.target.value)) {
                  e.target.value = "";
                }
              }}
              placeholder="Enter your Phone Number"
              className={`w-[300px] py-2 px-2 border border-gray-500 outline-none rounded-md ${
                errors.phoneNumber ? "border-red-500" : ""
              }`}
            ></input>
            {errors.phoneNumber && (
              <span className="text-red-500 text-sm">{errors.phoneNumber}</span>
            )}
          </div>
        </div>

        {/* {/ ------------Date of birth------------------ /} */}
        <div className="flex gap-6">
          <div className="my-2">
            <label className="float-start text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateofbirth"
              name="dateofbirth"
              value={formData.dateofbirth}
              max={new Date().toISOString().split('T')[0]}
              onChange={handleChange}
              className={`w-[300px] py-2 px-2 border border-gray-500 outline-none rounded-md ${
                errors.dateofbirth ? "border-red-500" : ""
              }`}
            ></input>
             {errors.dateofbirth && (
              <span className="text-red-500 text-sm">{errors.dateofbirth}</span>
            )}
          </div>

          {/* {/ -----------------Location-------------------------- /} */}
          <div className="my-2">
            <label className="float-start text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              onFocus={handleFocus}
              placeholder="Enter your Current Location"
              className={`w-[300px] py-2 px-2 border border-gray-500 outline-none rounded-md ${
                errors.location ? "border-red-500" : ""
              }`}
            ></input>
             {errors.location && (
              <span className="text-red-500 text-sm">{errors.location}</span>
            )}
          </div>
        </div>

        <div className="flex gap-6">
          {/* {/ ----------Gender------------ /} */}
          <div className="my-2">
            <label className="float-start text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-[300px] py-2 border border-gray-500 outline-none rounded-md"

            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && (
              <span className="text-red-500 text-sm">{errors.gender}</span>
            )}
          </div>

          {/* {/ ----------Studying class--------------- /} */}
          <div className="my-2">
            <label className="float-start text-sm font-medium text-gray-700">
              Studying Class
            </label>
            <input
              type="text"
              id="studyingclass"
              name="studyingclass"
              value={formData.studyingclass}
              onChange={handleChange}
              placeholder="Enter your Standard/Class"
              className={`w-[300px] py-2 px-2 border border-gray-500 outline-none rounded-md ${
                errors.studyingclass ? "border-red-500" : ""
              }`}
            ></input>
             {errors.studyingclass && (
              <span className="text-red-500 text-sm">{errors.studyingclass}</span>
            )}
          </div>
        </div>

        {/* {/ -----------------Board and School/College------------------------- /} */}
        <div className="flex gap-6">
          <div className="my-2">
            <label className="float-start text-sm font-medium text-gray-700">
              Board
            </label>
            <input
              type="text"
              id="board"
              name="board"
              value={formData.board}
              onChange={handleChange}
              maxLength={30}
              onKeyDown={handleNameChar}
              placeholder="Enter your Board"
              className={`w-[300px] py-2 px-2 border border-gray-500 outline-none rounded-md ${
                errors.board ? "border-red-500" : ""
              }`}
            ></input>
            {errors.board && (
              <span className="text-red-500 text-sm">{errors.board}</span>
            )}
          </div>
          {/* {/ --------school--------- /} */}
          <div className="my-2">
            <label className="float-start  text-sm font-medium text-gray-700">
              School/College
            </label>
            <input
              type="text"
              id="school"
              name="school"
              value={formData.school}
              maxLength={50}
              onKeyDown={handleNameChar}
              onChange={handleChange}
              placeholder="Enter your School/College"
              className={`w-[300px] py-2 px-2 border border-gray-500 outline-none rounded-md ${
                errors.school ? "border-red-500" : ""
              }`}
            ></input>
             {errors.school && (
              <span className="text-red-500 text-sm">{errors.school}</span>
            )}
          </div>
        </div>

        {/* {/ ---------------Subject and Teaching--------------------- /} */}
        <div className="flex gap-6">
          <div className="my-2">
            <label className="float-start text-sm font-medium text-gray-700">
              Subjects tuition looking for
            </label>
            <input
              type="text"
              name="subject"
              placeholder="Enter Subject you are Looking for"
              value={formData.subject}
              maxLength={30}
              onChange={handleChange}
              onKeyDown={handleNameChar}
              className={`w-[300px] py-2 px-2 border border-gray-500 outline-none rounded-md ${
                errors.subject ? "border-red-500" : ""
              }`}
            />
            {errors.subject && (
              <span className="text-red-500 text-sm">{errors.subject}</span>
            )}
          </div>
              {/* {/ ----------mode of teaching----------- /} */}
          <div className="my-2">
            <label className="float-start text-sm font-medium text-gray-700">
              Mode of Teaching
            </label>
            <select
              name="teaching"
              value={formData.teaching}
              onChange={handleChange}
              className="w-[300px] py-2 border border-gray-500 outline-none rounded-md"
            >
              <option value="">Select Mode</option>
              <option value="Student Home">Student Home</option>
              <option value="Tutor Home">Tutor Home</option>
              <option value="Virtual Mode">Virtual Mode</option>
            </select>
            {errors.teaching && (
              <span className="text-red-500 text-sm">{errors.teaching}</span>
            )}
          </div>
        </div>

        {/* {/ -------------affordability and timings----------------- /} */}
        <div className="flex gap-6">
          <div className="my-2">
            <label className="float-start text-sm font-medium text-gray-700">
              Your Affordability per month
            </label>
            <input
              type="text"
              name="afford"
              placeholder="Your affordability per month"
              value={formData.afford}
              onChange={handleChange}
              className={`w-[300px] py-2 px-2 border border-gray-500 outline-none rounded-md ${
                errors.afford ? "border-red-500" : ""
              }`}
            />
            {errors.afford && (
              <span className="text-red-500 text-sm">{errors.afford}</span>
            )}
          </div>

          <div className="my-3">
            <label className="float-start text-sm font-medium text-gray-700">
              Available timings
            </label>
            <select
              name="timings"
              value={formData.timings}
              onChange={handleChange}
              className={`w-[300px] py-1.5 border border-gray-500 outline-none rounded-md ${
                errors.timings ? "border-red-500" : ""
              }`}
            >
              <option value="">Select Timing</option>
              <option value="7:00 - 7:45">7:00 - 7:45</option>
              <option value="8:30 - 9:15">8:30 - 9:15</option>
              <option value="10:00 - 10:45">10:00 - 10:45</option>
              <option value="11:30 - 12:15">11:30 - 12:15</option>
              <option value="13:00 - 13:45">13:00 - 13:45</option>
              <option value="14:30 - 15:15">14:30 - 15:15</option>
              <option value="16:00 - 16:45">16:00 - 16:45</option>
              <option value="17:30 - 18:15">17:30 - 18:15</option>
              <option value="19:00 - 19:45">19:00 - 19:45</option>
              <option value="20:30 - 21:15">20:30 - 21:15</option>
              <option value="22:00 - 22:45">22:00 - 22:45</option>
              <option value="23:30 - 00:15">23:30 - 00:15</option>
            </select>
            {errors.timings && (
              <span className="text-red-500 text-sm">{errors.timings}</span>
            )}
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white py-2 px-4 ml-[450px] font-semibold rounded-md hover:bg-blue-400"
          >
            Next
          </button>
        </div>
      </form>

      {/* {/ ----------Success Modal----------- /} */}
      {/* {isSuccessModalVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-green-600">Registration Successful!</h2>
            <p className="mt-4">Thank you for registering.</p>
            <button
              onClick={() => setIsSuccessModalVisible(false)}
              className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-400"
            >
              Close
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default Student;
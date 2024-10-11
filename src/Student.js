import { useState, useEffect } from "react";
// import { phone } from "phone";
import { Countries } from "./Countries";
import Select from "react-select";

const Student = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    dateofbirth: "",
    location: "",
    gender: "",
    studyingclass: "",
    board: "",
    school: "",
    subject: "",
    teaching: "",
    afford: "",
    timings: "",
  });

  //Mobile Number Validation//
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [personInfo, setPersonInfo] = useState({
    phone: "",
  });

  const countryOptions = Countries.map((country) => ({
    value: country.code,
    label: `+${country.phone} ${country.label}`, // Corrected template literal
    country,
  }));

  const validateStartDigits = (value, country) => {
    if (!country || !country.validStartDigits.length) {
      return true; // No restrictions on starting digits for this country
    }
    return country.validStartDigits.some((digit) => value.startsWith(digit));
  };

  const [errors, setErrors] = useState({});
  const [isLocationDetected, setIsLocationDetected] = useState(false); // Prevent multiple detections

  //studying class
  const handleStudyingClassChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = "";

    if (/^\d+$/.test(value)) {
      if (Number(value) < 1 || Number(value) > 12) {
        errorMessage = "Please enter a number between 1 and 12";
      }
    } else {
      if (value.length > 20) {
        errorMessage = "Studying Class can only have up to 20 characters";
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      studyingclass: errorMessage,
    }));

    if (!errorMessage) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  //subject tuition looking for
  const handleSubjectChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = "";

    const validInputPattern = /^[a-zA-Z0-9\s]*$/;

    if (!validInputPattern.test(value)) {
      errorMessage = "Special characters are not allowed.";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      subject: errorMessage,
    }));

    if (!errorMessage && value.length <= 20) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const [timings, setTimings] = useState([]);

  //timing slots validations
  const generateTimings = () => {
    const timings = [];
    const startHour = 0; // 00:00 (12 AM in 24-hour format)
    const endHour = 23; // 23:00 (11 PM in 24-hour format)
    const interval = 45; // 45 minutes

    let hour = startHour;
    let minute = 0;

    while (hour < endHour || (hour === endHour && minute === 15)) {
      const startTime = formatTime(hour, minute);

      // Increment time by 45 minutes to get the end time of the slot
      let endHour = hour;
      let endMinute = minute + interval;

      if (endMinute >= 60) {
        endMinute -= 60;
        endHour++;
      }

      const endTime = formatTime(endHour, endMinute);
      timings.push(`${startTime} to ${endTime} IST`);

      // Update the current time for the next slot
      minute += interval;
      if (minute >= 60) {
        minute -= 60; // Reset minutes and increment hour
        hour++;
      }
    }

    return timings;
  };
  const formatTime = (hour, minute) => {
    const amPm = hour < 12 || hour === 24 ? "AM" : "PM"; // Handle AM/PM correctly
    const formattedHour = hour % 12 || 12; // Convert 0 and 24 hour to 12 for display
    const formattedMinute = minute < 10 ? `0${minute}` : minute; // Add leading zero for minutes
    return `${formattedHour}:${formattedMinute} ${amPm}`; // Return in HH:mm AM/PM format
  };
  
// useEffect to set the generated timings on component mount
useEffect(() => {
  const availableTimings = generateTimings();
  setTimings(availableTimings);
  console.log(availableTimings); // To log the available timings in IST format
}, []);

  //Date of Birth
  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
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
    if (Object.keys(validationErrors).length === 0) {
      console.log("form submitted successfully", formData);
      // setIsSuccessModalVisible(true);
    } else {
      setErrors(validationErrors);
    }
  };

  const handleKeyDown = (e) => {
    // Allow: backspace, delete, tab, escape, enter, and arrow keys
    if (
      e.key === "Backspace" ||
      e.key === "Delete" ||
      e.key === "Tab" ||
      e.key === "Escape" ||
      e.key === "Enter" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight"
    ) {
      return;
    }

    // Prevent any non-numeric key (except control keys)
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value.trimStart();
    const today = new Date();
    const CurrentYear = today.getFullYear();
    const [year, month, day] = value.split("-");
    let errorMsg = '';

    if (name === "afford" && /^[0-9]*$/.test(value)) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
    if (name === "afford" && !/^[0-9]*$/.test(value)) {
      setErrors((prevState) => ({
        ...prevState,
        afford: "Only numeric values are allowed.",
      }));
    } else {
      setErrors((prevState) => ({
        ...prevState,
        afford: "",
      }));
    }

    if (year && (year.length !== 4 || parseInt(year) > CurrentYear)) {
      errorMsg =
        "Year should be 4 digits and not greater than the current year.";
    }
    // Validate month (1-12)
    if (month && (parseInt(month) < 1 || parseInt(month) > 12)) {
      errorMsg = "Month should be between 1 and 12.";
    }

    // Validate day based on the number of days in the month and year
    const maxDays = getDaysInMonth(month, year);
if (day && (parseInt(day) < 1 || parseInt(day) > maxDays)) {
  errorMsg = `Day should be between 1 and ${maxDays} for the selected month and year.`; // Enclosed in backticks
}


    if (name === "email") {
      newValue = value.replace(/\s+/g, "").toLowerCase();
    }

    if (value === "0") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        studyingclass: "Zero is not allowed as a valid entry.",
      }));
      return; // Prevent further processing
    }
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };
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
            const { suburb, city, state, country } = data.address;
            const exactLocation = `${suburb}, ${city}, ${state}, ${country}`;

            // Set the location as "Area, City, State, Country"
            setFormData((prevFormData) => ({
              ...prevFormData,
              location: exactLocation,
            }));
            setIsLocationDetected(true);
          })
          .catch((error) => {
            console.error("Error with reverse geocoding:", error);
            setErrors((prevErrors) => ({
              ...prevErrors,
              location: "Unable to retrieve location details",
            }));
          });
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
    detectLocation();
  }
};

  //validate first Name
  const handleNameChar = (e) => {
    const key = e.key;
    const value = e.target.value;

    const nameRegex = /^[A-Za-z]/;
    let newError = {};

    if ((value === "" && key === " ") || !/[a-zA-Z\s]/.test(key)) {
      e.preventDefault();
    } else if (!nameRegex.test(value)) {
      newError.Organizationname = "Must start with a Character";
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      e.target.value = value.replace(/\s+/g, "");
    }
  };

  const validate = () => {
    const newErrors = {};
    //first Name
    if (!formData.firstname.trim()) {
      newErrors.firstname = "First Name is required";
    } else if (formData.firstname.trim().length < 3) {
      newErrors.firstname = "First Name must be at least 3 characters";
    }
    //last Name
    if (!formData.lastname.trim()) {
      newErrors.lastname = "last Name is required";
    } else if (formData.lastname.trim().length < 3) {
      newErrors.lastname = "Last Name must be at least 3 characters";
    }

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail|outlook|icloud)\.(com|net|edu|org|gov|mil|in|co|us|info|io|biz)$/;

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    //phoneNumber
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber =
        "Phone number must be 10 digits and start with 6-9";
    }

    //board
    if (!formData.board.trim()) {
      newErrors.board = "Board is required";
    } else if (formData.board.length < 3) {
      newErrors.board = "Board Name must be at least 3 characters";
    }

    //school/college
    if (!formData.school.trim()) {
      newErrors.school = "School/college is required";
    } else if (formData.school.trim().length < 3) {
      newErrors.school = "School/College Name must be at least 3 characters";
    }

    //date of birth
    if (!formData.dateofbirth.trim()) {
      newErrors.dateofbirth = "Date of Birth is required";
    }

    //location
    if (!formData.location.trim()) {
      newErrors.location = "location is required";
    }

    //gender
    if (!formData.gender.trim()) {
      newErrors.gender = "Gender is required";
    }

    //studying class
    if (!formData.studyingclass.trim()) {
      newErrors.studyingclass = "Studying Class is required";
    }

    //Subject
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject tuition looking for is required";
    } else if (formData.subject.length < 2) {
      newErrors.subject = "Subject Name must be at least 2 characters";
    }

    //mode of teaching
    if (!formData.teaching.trim()) {
      newErrors.teaching = "Mode of teaching is required";
    }

    //affordability
    if (!formData.afford.trim()) {
      newErrors.afford = "Your Affordability per month is required";
    }

    //timings
    if (!formData.timings.trim()) {
      newErrors.timings = "timings is required";
    }

    return newErrors;
  };

  return (
    <div className="w-[650px]  mx-auto border border-gray-400 p-4">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
        Sign Up as a Student
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="flex ">
          {/* ---------first Name------------ */}
          <div className="my-2 relative">
            <label className="float-start text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              minLength={3}
              maxLength={20}
              name="firstname"
              onChange={handleChange}
              onKeyDown={handleNameChar}
              value={formData.firstname}
              placeholder="Enter your First Name"
              className={`w-[300px] py-2 px-2 mr-6 border border-gray-500 outline-none  ${
                errors.firstname ? "border-red-500" : ""
              }`}
            ></input>
            {errors.firstname && (
              <span className="text-red-500 text-sm">{errors.firstname}</span>
            )}
          </div>

          {/* ------------Last Name--------------- */}

          <div className="my-2">
            <label className="float-start text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              minLength={3}
              maxLength={20}
              name="lastname"
              onChange={handleChange}
              onKeyDown={handleNameChar}
              value={formData.lastname}
              placeholder="Enter your Last Name"
              className={`w-[300px] py-2 px-2 mr-6 border border-gray-500 outline-none  ${
                errors.lastname ? "border-red-500" : ""
              }`}
            ></input>
            {errors.firstname && (
              <span className="text-red-500 text-sm">{errors.lastname}</span>
            )}
          </div>
        </div>

        <div className="flex gap-6">
          {/* --------------Email-------------------- */}
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
              className={`w-[300px] py-2 px-2 border border-gray-500 outline-none  ${
                errors.email ? "border-red-500" : ""
              }`}
            ></input>
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          {/* --------------Phone Number---------------------- */}
          <div className="pr-3 mt-2">
            <label className=" float-start  text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <div className="flex float-start">
              <Select
                name="countryCode"
                options={countryOptions}
                onChange={(selectedOption) => {
                  setSelectedCountry(selectedOption.country);
                  setPersonInfo({ ...personInfo, phone: "" });
                  setErrors((prev) => ({ ...prev, phoneNumber: null })); // Clear errors on country change
                }}
                value={
                  selectedCountry
                    ? {
                        value: selectedCountry.code,
                        label: `+${String(selectedCountry.phone)} ${
                          selectedCountry.label
                        }`,
                      }
                    : null
                }
                isSearchable
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    minWidth: "150px",
                  }),
                  control: (provided) => ({
                    ...provided,
                    minWidth: "60px",
                    height: "40px",
                  }),
                  dropdownIndicator: (provided) => ({
                    ...provided,
                    display: "none",
                  }),
                  indicatorSeparator: () => null,
                }}
                className="border border-gray-500 outline-none"
              />

              <input
                maxLength={10}
                type="tel"
                name="phoneNumber"
                placeholder="Enter your Mobile Number"
                value={personInfo.phone || ""}
                disabled={!selectedCountry}
                onChange={(e) => {
                  const inputvalue = e.target.value.replace(/[^0-9]/g, ""); // Allow only digits
                  setPersonInfo({ ...personInfo, phone: inputvalue });
                  setFormData({ ...formData, phoneNumber: inputvalue });
                }}
                onInput={(e) => {
                  const inputValue = e.target.value.replace(/[^0-9]/g, "");

                  if (
                    selectedCountry &&
                    !validateStartDigits(inputValue, selectedCountry)
                  ) {
                    e.target.value = "";
                  }

                  setPersonInfo({ ...personInfo, phone: inputValue });
                  setFormData({ ...formData, phoneNumber: inputValue });
                }}
                className={`w-[225px] px-4 py-4 border border-gray-500 outline-none   ${
                  selectedCountry && personInfo.phone
                    ? !validateStartDigits(personInfo.phone, selectedCountry)
                      ? "border-red-500"
                      : ""
                    : ""
                }`}
                style={{
                  height: "42px",
                }}
              />
            </div>
            {errors.phoneNumber && (
              <span className="text-red-500 text-sm">{errors.phoneNumber}</span>
            )}
          </div>
          
        </div>

        {/* ------------Date of birth------------------ */}
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
              // max={new Date().toISOString().split("T")[0]}
              max={
                new Date(
                  new Date().setFullYear(new Date().getFullYear() - 2) - 1
                )
                  .toISOString()
                  .split("T")[0]
              } // Restrict to exactly 2 years ago
              min={
                new Date(new Date().setFullYear(new Date().getFullYear() - 100))
                  .toISOString()
                  .split("T")[0]
              } // Disable dates more than 100 years ago
              onChange={handleChange}
              className={`w-[300px] py-2 px-2 border border-gray-500 outline-none  ${
                errors.dateofbirth ? "border-red-500" : ""
              }`}
              // style={{pointerEvents:'none'}} //Disable manual typing
              onKeyDown={(e) => e.preventDefault()}
            ></input>
            {errors.dateofbirth && (
              <span className="text-red-500 text-sm">{errors.dateofbirth}</span>
            )}
          </div>

          {/* -----------------Location-------------------------- */}
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
              className={`w-[300px] py-2 px-2 border border-gray-500 outline-none  ${
                errors.location ? "border-red-500" : ""
              }`}
            ></input>
            {errors.location && (
              <span className="text-red-500 text-sm">{errors.location}</span>
            )}
          </div>
        </div>

        <div className="flex gap-6">
          {/* ----------Gender------------ */}
          <div className="my-2">
            <label className="float-start text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-[300px] py-2 border border-gray-500 outline-none "
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && (
              <span className="text-red-500 text-sm">{errors.gender}</span>
            )}
          </div>

          {/* ----------Studying class--------------- */}
          <div className="my-2">
            <label className="float-start text-sm font-medium text-gray-700">
              Studying Class
            </label>
            <input
              type="text"
              id="studyingclass"
              name="studyingclass"
              value={formData.studyingclass}
              onChange={handleStudyingClassChange}
              placeholder="Enter your Standard/Class"
              className={`w-[300px] py-2 px-2 border border-gray-500 outline-none  ${
                errors.studyingclass ? "border-red-500" : ""
              }`}
            ></input>
            {errors.studyingclass && (
              <span className="text-red-500 text-sm">
                {errors.studyingclass}
              </span>
            )}
          </div>
        </div>

        {/* -----------------Board and School/College------------------------- */}
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
              className={`w-[300px] py-2 px-2 border border-gray-500 outline-none  ${
                errors.board ? "border-red-500" : ""
              }`}
            ></input>
            {errors.board && (
              <span className="text-red-500 text-sm">{errors.board}</span>
            )}
          </div>
          {/* --------school--------- */}
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
              className={`w-[300px] py-2 px-2 border border-gray-500 outline-none  ${
                errors.school ? "border-red-500" : ""
              }`}
            ></input>
            {errors.school && (
              <span className="text-red-500 text-sm">{errors.school}</span>
            )}
          </div>
        </div>

        {/* ---------------Subject and Teaching--------------------- */}
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
              maxLength={20}
              onChange={handleSubjectChange}
              // onKeyDown={handleNameChar}
              className={`w-[300px] py-2 px-2 border border-gray-500 outline-none  ${
                errors.subject ? "border-red-500" : ""
              }`}
            />
            {errors.subject && (
              <span className="text-red-500 text-sm">{errors.subject}</span>
            )}
          </div>
          {/* ----------mode of teaching----------- */}
          <div className="my-2">
            <label className="float-start text-sm font-medium text-gray-700">
              Mode of Teaching
            </label>
            <select
              name="teaching"
              value={formData.teaching}
              onChange={handleChange}
              className="w-[300px] py-2 border border-gray-500 outline-none "
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

        {/* -------------affordability and timings----------------- */}
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
              onKeyDown={handleKeyDown}
              maxLength={7}
              className={`w-[300px] py-2 px-2 border border-gray-500 outline-none  ${
                errors.afford ? "border-red-500" : ""
              }`}
            />
            {errors.afford && (
              <span className="text-red-500 text-sm">{errors.afford}</span>
            )}
          </div>
            {/* timing slots */}
          <div className="my-3">
            <label className="float-start text-sm font-medium text-gray-700">
              Available Time slots
            </label>
            <select
              name="timings"
              value={formData.timings}
              onChange={handleChange}
              className={`w-[300px] py-1.5 border border-gray-500 outline-none  ${
                errors.timings ? "border-red-500" : ""
              }`}
            >
             <option value=''>Select Available Timing</option>
             {timings.map((timing, index)=> (
              <option key={index} value={timing}>{timing}</option>
             ))} 
            </select>
            {errors.timings && (
              <span className="text-red-500 text-sm">{errors.timings}</span>
            )}
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white py-2 px-4 ml-[450px] font-semibold  hover:bg-blue-400"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default Student;
import React, { useState } from "react";
import { countries } from "./Countries";
import phone from "phone";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
// import { passportValidations, validatePassportNumber } from "./countries";

const SignUp = ({ setIsSubmitted }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    location: "",
    gender: "",
    dob: "",
    qualification: "",
    subject: "",
    modeOfTeaching: "",
    govtIdProof: "",
    aadhaarNumber: "",
    passportNumber: "",
    file: null,
    chargesPerHour: "",
    availableTimings: "",
  });
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState(""); // State for selected country code
  // const [passportNumber, setPassportNumber] = useState(""); // State for passport number
  // const [isPassportValid, setIsPassportValid] = useState(true); // State for passport validation status

  // const handleCountryChange = (event) => {
  //   const selectedCode = event.target.value;
  //   setSelectedCountryCode(selectedCode);
  //   // Reset passport number on country change
  //   setFormData((prev) => ({ ...prev, passportNumber: "" }));
  //   setErrors((prev) => ({ ...prev, passportNumber: "" }));
  // };
  // const handlePassportChange = (event) => {
  //   const value = event.target.value;
  //   setFormData((prev) => ({ ...prev, passportNumber: value }));

  //   if (formData.govtIdProof === "Passport Number") {
  //     const validation = passportValidations[selectedCountryCode];

  //     if (!value.trim()) {
  //       setErrors((prev) => ({
  //         ...prev,
  //         passportNumber: "Passport number is required",
  //       }));
  //     } else if (
  //       validation &&
  //       (!validation.regex.test(value) ||
  //         value.length < validation.minLength ||
  //         value.length > validation.maxLength)
  //     ) {
  //       setErrors((prev) => ({
  //         ...prev,
  //         passportNumber: `Invalid passport number format. It must be between ${validation.minLength} and ${validation.maxLength} characters long.`,
  //       }));
  //     } else {
  //       setErrors((prev) => ({ ...prev, passportNumber: "" })); // Clear errors if valid
  //     }
  //   }
  // };

  //Mobile Number Validation//
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [personInfo, setPersonInfo] = useState({
    phone: "",
  });

  const validateStartDigits = (value, country) => {
    if (!country || !country.validStartDigits.length) {
      return true; // No restrictions on starting digits for this country
    }
    return country.validStartDigits.some((digit) => value.startsWith(digit));
  };

  const countryOptions = countries.map((country) => ({
    value: country.code,
    label: `(+${country.phone}) ${country.label}`,
    country,
  }));
  //******/

  const [errors, setErrors] = useState({
    govtIdProof: "",
    aadhaarNumber: "",
    passportNumber: "",
    file: "",
  });

  const [charCount, setCharCount] = useState(0);
  //Location Validation//
  const [isLocationDetected, setIsLocationDetected] = useState(false); // Prevent multiple detections

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
  //******/
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value.trimStart();

    // Validation logic
    if (name === "passportNumber") {
      const regex = /^[A-Z][0-9]{7}$/; // Regex for the valid passport number format
      const maxLength = 8;

      if (!value) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          passportNumber: "Passport Number is required",
        }));
      } else if (value.length !== maxLength) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          passportNumber: `Passport Number must be exactly ${maxLength} characters long`,
        }));
      } else if (!regex.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          passportNumber:
            "Invalid passport number format. It should start with a letter followed by 7 digits (e.g., A1234567).",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          passportNumber: "", // Clear any errors
        }));
      }
    }

    if (name === "email") {
      newValue = value.replace(/\s+/g, "").toLowerCase();
    }

    if (name === "chargesPerHour") {
      // Prevent input if more than 10 digits
      if (newValue.length > 7) {
        return;
      }
      // Ensure it's a numeric value
      if (!/^\d*\.?\d*$/.test(newValue)) {
        return; // Prevent any non-numeric input
      }
    }

    // Validate first name and last name for alphabets only and no spaces at the start
    if (name === "firstName" || name === "lastName") {
      const regex = /^[A-Za-z\s]*$/; // Allow only alphabets and spaces
      if (!regex.test(newValue) && newValue !== "") {
        return; // Ignore input if it contains non-alphabetic characters
      }
    }
    if (name === "subject") {
      setCharCount(value.length);
    }

    if (name === "aadhaarNumber" && formData.govtIdProof === "Aadhaar Card") {
      // Check if the value is numeric and does not exceed 12 digits
      if (!/^\d*$/.test(value) || value.length > 12) {
        return; // Prevent any non-numeric input
      }
    }
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));
    setErrors(validate());
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      file,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, file: "" })); // Clear file error if any
  };

  const validate = () => {
    const newErrors = {};

    //first name
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    else if (formData.firstName.length < 3)
      newErrors.firstName = "First name must be at least 4 characters";
    //last name
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    else if (formData.lastName.length < 3)
      newErrors.lastName = "Last name must be at least 4 characters";

    //email
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail|outlook|icloud)\.(com|net|edu|org|gov|mil|in|co|us|info|io|biz)$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    //mobile
    if (!formData.phoneNumber)
      newErrors.phoneNumber = "Mobile Number is required";

    //gender
    if (!formData.gender) newErrors.gender = "Gender is required";
    //location
    if (!formData.location) newErrors.location = "Location is required";
    //DOB
    if (!formData.dob) newErrors.dob = "Date of Birth is required";
    //sub are req
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    //Mode of teaching
    if (!formData.modeOfTeaching)
      newErrors.modeOfTeaching = "Mode of teaching is required";
    //charges per hour
    if (!formData.chargesPerHour)
      newErrors.chargesPerHour = "Charges per hour is required";
    else if (isNaN(formData.chargesPerHour) || formData.chargesPerHour <= 0)
      newErrors.chargesPerHour = "Charges must be a positive number";

    if (!formData.govtIdProof)
      newErrors.govtIdProof = "Government ID Proof is required";
    // Validate Highest Qualification
    const qualificationRegex = /^[A-Za-z\s]+$/; // Allow only letters and spaces
    if (!formData.qualification.trim()) {
      newErrors.qualification = "Highest qualification is required";
    } else if (!qualificationRegex.test(formData.qualification)) {
      newErrors.qualification =
        "Invalid qualification format. Only letters and spaces are allowed.";
    }

    // Charges Per Hour validation
    if (!formData.chargesPerHour) {
      newErrors.chargesPerHour = "Charges per hour is required";
    } else if (isNaN(formData.chargesPerHour) || formData.chargesPerHour <= 0) {
      newErrors.chargesPerHour = "Charges must be a positive number";
    } else if (formData.chargesPerHour.length > 10) {
      newErrors.chargesPerHour = "Charges per hour cannot exceed 10 digits";
    }

    // Aadhaar Card validation
    if (formData.govtIdProof === "Aadhaar Card") {
      const aadhaarRegex = /^\d{12}$/; // Aadhaar should be exactly 12 digits
      if (!formData.aadhaarNumber.trim()) {
        newErrors.aadhaarNumber = "Aadhaar number is required";
      } else if (!aadhaarRegex.test(formData.aadhaarNumber.trim())) {
        newErrors.aadhaarNumber =
          "Invalid Aadhaar number format. It must be 12 digits.";
      }
    }

    // Passport validation

    if (formData.govtIdProof === "Passport Number") {
      if (!formData.passportNumber)
        newErrors.passportNumber = "Passport Number is required";
      // Add any specific validation logic for passport number here if needed
    }

    if (!formData.file) newErrors.file = "File upload is required";

    if (!formData.availableTimings) {
      newErrors.availableTimings = "Available timing is required";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted successfully", formData);
      setIsSubmitted(true);
      navigate("/success");
    } else {
      setErrors(newErrors);
    }
  };

  const handleNextClick = (e) => {
    e.preventDefault(); // Prevents the form's default behavior
    handleSubmit(e); // Call handleSubmit and pass the event object
  };

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

  // Usage in the component
  const availableTimings = generateTimings();
  console.log(availableTimings);

  return (
    <div className="max-w-10xl sm-640px mx-auto mt-10 p-10 bg-white border border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Sign Up as a Tutor
      </h2>
      <form id="signUpForm" onSubmit={handleSubmit}>
        {/* Row 1: First Name, Last Name, Email */}
        <div className="flex mb-3">
          <div className="w-1/3 pr-3">
            <label className="block mb-2 text-sm font-medium text-gray-700 float-start">
              First Name:
            </label>
            <input
              type="text"
              id="firstname"
              minLength={3}
              maxLength={20}
              name="firstName"
              value={formData.firstName}
              onKeyDown={handleNameChar}
              onChange={handleChange}
              className={`w-full px-4 py-2 border border-gray-500 outline-none ${
                errors.firstName ? "border-red-500" : ""
              }`}
            />
            {errors.firstName && (
              <span className="text-red-500 text-sm">{errors.firstName}</span>
            )}
          </div>
          <div className="w-1/3 px-3">
            <label className="block mb-2 text-sm font-medium text-gray-700 float-start">
              Last Name:
            </label>
            <input
              type="text"
              id="lastname"
              minLength={3}
              maxLength={20}
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onKeyDown={handleNameChar}
              className={`w-full px-4 py-2 border border-gray-500 outline-none ${
                errors.lastName ? "border-red-500" : ""
              }`}
            />
            {errors.lastName && (
              <span className="text-red-500 text-sm">{errors.lastName}</span>
            )}
          </div>
          <div className="w-1/3 pl-3">
            <label className="block mb-2 text-sm font-medium text-gray-700 float-start">
              Email:
            </label>
            <input
              type="email"
              name="email"
              maxLength={30}
              value={formData.email}
              onChange={handleChange}
              onInput={handleInput}
              className={`w-full px-4 py-2 border border-gray-500 outline-none ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>
        </div>

        {/* Row 2: Mobile Number, Location, Gender */}
        <div className="flex">
        
          <div className="w-1/3 pr-3 mt-2 mb-4">
            <label className="text-sm font-medium text-gray-700 float-start">
              Mobile Number: 
            </label>
            <div className="flex float-start">
              <Select
                name="countryCode"
                options={countryOptions}
                onChange={(selectedOption) => {
                  setSelectedCountry(selectedOption.country);
                  setPersonInfo({ ...personInfo, phone: "" });
                }}
                value={
                  selectedCountry
                    ? {
                        value: selectedCountry.code,
                        label: `+${selectedCountry.phone} ${selectedCountry.label}`,
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
                className="w-1/4 border border-gray-500 rounded-l-md outline-none"
              />

              <input
              
                maxLength={10}
                type="tel"
                name="phoneNumber"
                value={personInfo.phone || ""}
                disabled={!selectedCountry}
                onChange={(e) => {
                  const inputValue = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
                  setPersonInfo({ ...personInfo, phone: inputValue });
                  setFormData({ ...formData, phoneNumber: inputValue });
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
                className={`w-[285px] px-4 py-4 border border-gray-500 outline-none ${
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
        

          <div className="w-1/3 px-3">
            <label className="block mb-2 text-sm font-medium text-gray-700 float-start">
              Location:
            </label>
            <input
              type="text"
              name="location"
              id="location"
              value={formData.location}
              onChange={handleChange}
              onFocus={handleFocus}
              className={`w-full px-4 py-2 border border-gray-500 outline-none ${
                errors.location ? "border-red-500" : ""
              }`}
            />
            {errors.location && (
              <span className="text-red-500 text-sm">{errors.location}</span>
            )}
          </div>
          <div className="w-1/3 pl-3">
            <label className="block mb-2 text-sm font-medium text-gray-700 float-start">
              Gender:
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full px-4 py-2 border border-gray-500 outline-none ${
                errors.gender ? "border-red-500" : ""
              }`}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.gender && (
              <span className="text-red-500 text-sm">{errors.gender}</span>
            )}
          </div>
        </div>

        {/* Row 3: Date of Birth, Highest Qualification, Subjects You Are Expert At */}
        <div className="flex mb-3">
          <div className="w-1/3 pr-3">
            <label className="block mb-2 text-sm font-medium text-gray-700 float-start">
              Date of Birth:
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              max={
                new Date(
                  new Date().setFullYear(new Date().getFullYear() - 2) - 1
                )
                  .toISOString()
                  .split("T")[0]
              } // Restrict to exactly 2 years ago
              min={
                new Date(new Date().setFullYear(new Date().getFullYear() - 100))
                  .toISOString()
                  .split("T")[0]
              } // Disable dates more than 100 years ago
              className={`w-full px-4 py-2 border border-gray-500 outline-none  ${
                errors.dob ? "border-red-500" : ""
              }`}
              onKeyDown={(e) => e.preventDefault()}
            />
            {errors.dob && (
              <span className="text-red-500 text-sm">{errors.dob}</span>
            )}
          </div>
          <div className="w-1/3 px-3">
            <label className="block mb-2 text-sm font-medium text-gray-700 float-start">
              Highest Qualification:
            </label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={(e) => {
                const sanitizedValue = e.target.value.replace(
                  /[^A-Za-z\s]/g,
                  ""
                );
                setFormData({ ...formData, qualification: sanitizedValue });
              }}
              className={`w-full px-4 py-2 border border-gray-500 outline-none ${
                errors.qualification ? "border-red-500" : ""
              }`}
            />
            {errors.qualification && (
              <span className="text-red-500 text-sm">
                {errors.qualification}
              </span>
            )}
          </div>
          <div className="w-1/3 pl-3">
            <label className="block mb-2 text-sm font-medium text-gray-700 float-start">
              Subjects You Are Expert At:
            </label>
            <textarea
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full px-4 py-2 border border-gray-500 outline-none ${
                errors.subject ? "border-red-500" : ""
              } h-10`}
            />
            {errors.subject && (
              <span className="text-red-500 text-sm">{errors.subject}</span>
            )}
          </div>
        </div>

        {/* Row 4: Mode of Teaching, Charges per Hour, Available Timings */}
        <div className="flex mb-3">
          <div className="w-1/3 pr-3">
            <label className="block mb-2 text-sm font-medium text-gray-700 float-start">
              Mode of Teaching:
            </label>
            <select
              name="modeOfTeaching"
              value={formData.modeOfTeaching}
              onChange={handleChange}
              className={`w-full px-4 py-2 border border-gray-500 outline-none  ${
                errors.modeOfTeaching ? "border-red-500" : ""
              }`}
            >
              <option value="">Select Mode</option>
              <option value="online">Student Home</option>
              <option value="offline">Tutor Home</option>
              <option value="offline">Virtual Mode</option>
            </select>
            {errors.modeOfTeaching && (
              <span className="text-red-500 text-sm">
                {errors.modeOfTeaching}
              </span>
            )}
          </div>
          <div className="w-1/3 px-3">
            <label className="block mb-2 text-sm font-medium text-gray-700 float-start">
              Charges Per Hour:
            </label>
            <input
              type="text"
              name="chargesPerHour"
              value={formData.chargesPerHour}
              onChange={handleChange}
              maxLength={7}
              className={`w-full px-4 py-2 border border-gray-500 outline-none ${
                errors.chargesPerHour ? "border-red-500" : ""
              }`}
            />
            {errors.chargesPerHour && (
              <span className="text-red-500 text-sm">
                {errors.chargesPerHour}
              </span>
            )}
          </div>
          <div className="w-1/3 pl-3">
            <label className="block mb-2 text-sm font-medium text-gray-700 float-start">
              Available Time Slots:
            </label>
            <select
              name="availableTimings"
              value={formData.availableTimings}
              onChange={handleChange}
              className={`w-full px-4 py-2 border border-gray-500 outline-none`}
            >
              <option value="">Select Available Timing</option>
              {availableTimings.map((timing, index) => (
                <option key={index} value={timing}>
                  {timing}
                </option>
              ))}
            </select>
            {errors.availableTimings && (
              <span className="text-red-500 text-sm">
                {errors.availableTimings}
              </span>
            )}
          </div>
        </div>

        {/* Row 5: Government ID Proof and Number, File Upload */}
        <div className="flex mb-6">
          <div className="w-1/3 pr-3">
            <label className="block mb-2 text-sm font-medium text-gray-700 float-start">
              Government ID Proof:
            </label>
            <select
              name="govtIdProof"
              value={formData.govtIdProof}
              onChange={handleChange}
              className={`w-full px-4 py-2 border border-gray-500 outline-none${
                errors.govtIdProof ? "border-red-500" : ""
              }`}
            >
              <option value="">Select ID Proof</option>
              <option value="Aadhaar Card">Aadhaar Card</option>
              <option value="Passport Number">Passport Number</option>
            </select>
            {errors.govtIdProof && (
              <span className="text-red-500 text-sm">{errors.govtIdProof}</span>
            )}
          </div>

          {/* Conditional Rendering based on selected Government ID Proof */}
          {formData.govtIdProof && (
            <>
              <div className="w-1/3 px-3">
                <label className="block mb-2 text-sm font-medium text-gray-700 float-start">
                  {formData.govtIdProof === "Aadhaar Card"
                    ? "Aadhaar Number:"
                    : "Passport Number:"}
                </label>
                <input
                  type="text"
                  name={
                    formData.govtIdProof === "Aadhaar Card"
                      ? "aadhaarNumber"
                      : "passportNumber"
                  }
                  value={
                    formData.govtIdProof === "Aadhaar Card"
                      ? formData.aadhaarNumber
                      : formData.passportNumber
                  }
                  onChange={handleChange}
                  maxLength={formData.govtIdProof === "Aadhaar Card" ? 12 : 8} // Set max length for passport to 8
                  className={`w-full px-4 py-2 border border-gray-500 outline-none ${
                    formData.govtIdProof === "Aadhaar Card" &&
                    errors.aadhaarNumber
                      ? "border-red-500"
                      : formData.govtIdProof === "Passport Number" &&
                        errors.passportNumber
                      ? "border-red-500"
                      : ""
                  }`}
                />

                {formData.govtIdProof === "Aadhaar Card" &&
                  errors.aadhaarNumber && (
                    <span className="text-red-500 text-sm">
                      {errors.aadhaarNumber}
                    </span>
                  )}
                {formData.govtIdProof === "Passport Number" &&
                  errors.passportNumber && (
                    <span className="text-red-500 text-sm">
                      {errors.passportNumber}
                    </span>
                  )}
              </div>

              <div className="w-1/3 pl-3">
                <label className="block mb-2 text-sm font-medium text-gray-700 float-start">
                  Upload{" "}
                  {formData.govtIdProof === "Aadhaar Card"
                    ? "Aadhaar Document:"
                    : "Passport Document:"}
                </label>
                <input
                  type="file"
                  name="file"
                  onChange={handleFileChange}
                  className={`w-full px-1 py-2 border border-gray-500 outline-none ${
                    errors.file ? "border-red-500" : ""
                  }`}
                />
                {errors.file && (
                  <span className="text-red-500 text-sm">{errors.file}</span>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end mb-4">
          <button
            type="button"
            className="w-24 bg-blue-600 text-white py-2  hover:bg-blue-500"
            onClick={handleNextClick}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "NEXT"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;

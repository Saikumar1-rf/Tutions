import React, { useState } from "react";
import { Link } from "react-router-dom";
// import LocationForm from "../components/LocationForm";

const countryCodes = [
  { code: "+1", name: "USA" },
  { code: "+91", name: "India" },
  { code: "+44", name: "UK" },
  { code: "+61", name: "Australia" },
  { code: "+49", name: "Germany" },
  { code: "+81", name: "Japan" },
  { code: "+33", name: "France" },
  { code: "+39", name: "Italy" },
  { code: "+82", name: "South Korea" },
  { code: "+65", name: "Singapore" },
];

const Tutor = () => {
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
    govtIdNumber: "",
    file: null,
    chargesPerHour: "",
    availableTimings: "",
    countryCode: "+91", // Default country code
  });

  const [errors, setErrors] = useState({});
  const [charCount, setCharCount] = useState(0);
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
  


  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value.trimStart();

    if (name === "email") {
      newValue = value.replace(/\s+/g, "").toLowerCase();
    }

    // Validate first name and last name for alphabets only
    if (name === "firstName" || name === "lastName") {
      const regex = /^[A-Za-z]*$/;
      if (!regex.test(value) && value !== "") {
        return; // Ignore the input if it contains non-alphabetic characters
      }
    }

    // Validate phone number for digits only
    if (name === "phoneNumber") {
      const regex = /^[0-9]*$/;
      if (!regex.test(value) && value !== "") {
        return; // Ignore the input if it contains non-numeric characters
      }
    }

    if (name === "subject") {
      setCharCount(value.length);
    }
    // Prevent non-numeric input for Aadhaar Number
    if (name === "govtIdNumber" && formData.govtIdProof === "Aadhaar Card") {
      if (!/^\d*$/.test(value) || value.length > 12) {
        return; // Prevent any non-numeric input
      }
    }

    setFormData({
      ...formData,
      [name]: newValue,
      // file: files ? files[0] : null,
    });
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
    //first name
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    else if (formData.firstName.length < 4)
      newErrors.firstName = "First name must be at least 4 characters";
    //last name
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    else if (formData.lastName.length < 4)
      newErrors.lastName = "Last name must be at least 4 characters";

    //email
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+\.(com|net|edu|org|gov|mil|in|co|us|info|io|biz)$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    //mobile number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phoneNumber)
      newErrors.phoneNumber = "Phone number is required";
    else if (!phoneRegex.test(formData.phoneNumber))
      newErrors.phoneNumber =
        "Phone number must be 10 digits and start with 6-9";

    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.dob) newErrors.dob = "Date of Birth is required";
    if (!formData.qualification.trim())
      newErrors.qualification = "Highest qualification is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    // else if (formData.subject.length > 1000)
    //   newErrors.subject = "Subject cannot exceed 1000 characters";

    if (!formData.modeOfTeaching)
      newErrors.modeOfTeaching = "Mode of teaching is required";
    if (!formData.chargesPerHour)
      newErrors.chargesPerHour = "Charges per hour is required";
    else if (isNaN(formData.chargesPerHour) || formData.chargesPerHour <= 0)
      newErrors.chargesPerHour = "Charges must be a positive number";
    if (!formData.govtIdProof)
      newErrors.govtIdProof = "Government ID Proof is required";

    // Aadhaar Card validation
    if (formData.govtIdProof === "Aadhaar Card") {
      const aadhaarRegex = /^\d{12}$/; // Aadhaar should be exactly 12 digits
      if (!formData.govtIdNumber.trim()) {
        newErrors.govtIdNumber = "Aadhaar number is required";
      } else if (!aadhaarRegex.test(formData.govtIdNumber)) {
        newErrors.govtIdNumber =
          "Invalid Aadhaar number format. It must be 12 digits.";
      }
    }

    // Passport number validation (if selected)
    if (formData.govtIdProof === "Passport") {
      const passportNumberPattern = /^[A-PR-WY][1-9]\d\s?\d{4}[1-9]$/;
      if (!formData.govtIdNumber.trim()) {
        newErrors.govtIdNumber = "Passport number is required";
      } else if (!passportNumberPattern.test(formData.govtIdNumber)) {
        newErrors.govtIdNumber =
          "Invalid Passport number. It should follow the format: A1234567.";
      }
    }
     //location
     if(!formData.location) {
        newErrors.location = 'location is required';
      }

         //timings
         if(!formData.timings) {
            newErrors.timings = 'timings is required';
          }

    if (!formData.file) newErrors.file = "File upload is required";

    if (!formData.availableTimings) {
        newErrors.availableTimings = "Available timing is required";
      }
  
  

    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
    //   setIsSubmitting(true);
      // Handle submission (e.g., API call)
      console.log("Form submitted successfully", formData);
    //   setIsSubmitting(false);
    } else {
      setErrors(validationErrors);
    }
  };

  const generateTimings = () => {
    const timings = [];
    const startHour = 0; // 00:00 (12 AM in 24-hour format)
    const endHour = 23; // 23:00 (11 PM in 24-hour format)
    const interval = 45; // 45 minutes

    let hour = startHour;
    let minute = 0;

    while (hour < endHour || (hour === endHour && minute <= 15)) {
      timings.push(formatTime(hour, minute));

      // Increment time by 45 minutes
      minute += interval;
      if (minute >= 60) {
        minute -= 60; // Reset minutes and carry over to the next hour
        hour++;
      }
    }

    return timings;
  };

  const formatTime = (hour, minute) => {
    const amPm = hour < 12 ? "AM" : "PM";
    const formattedHour = hour % 12 || 12; // Convert 0 hour to 12 for display
    const formattedMinute = minute < 10 ? `0${minute}` : minute; // Add leading zero for minutes
    return `${formattedHour}:${formattedMinute} ${amPm}`; // Return in HH:mm AM/PM format
  };

  // Usage in the component
  const availableTimings = generateTimings();
  console.log(availableTimings);

  return (
    <div className="max-w-3xl sm-640px mx-auto mt-10 p-10 bg-white border border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-green-600 mb-8">
        Sign Up as a Tutor
      </h2>
      <form onSubmit={handleSubmit}>
        {/* {/ Row 1: First Name, Last Name, Email /} */}
        <div className="flex mb-3">
          <div className="w-1/3 pr-3">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              minLength={4}
              maxLength={20}
              name="firstName"
              value={formData.firstName}
              onKeyDown={handleNameChar}
              onChange={handleChange}
              className={`w-full px-4 py-2 border border-gray-500 outline-none rounded-md ${
                errors.firstName ? "border-red-500" : ""
              }`}
            />
            {errors.firstName && (
              <span className="text-red-500 text-sm">{errors.firstName}</span>
            )}
          </div>
          <div className="w-1/3 px-3">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              minLength={4}
              maxLength={20}
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onKeyDown={handleNameChar}
              className={`w-full px-4 py-2 border border-gray-500 outline-none rounded-md ${
                errors.lastName ? "border-red-500" : ""
              }`}
            />
            {errors.lastName && (
              <span className="text-red-500 text-sm">{errors.lastName}</span>
            )}
          </div>
          <div className="w-1/3 pl-3">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              maxLength={30}
              value={formData.email}
              onChange={handleChange}
              onInput={handleInput}
              className={`w-full px-4 py-2 border border-gray-500 outline-none rounded-md ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>
        </div>

        {/* {/ Row 2: Mobile Number, Location, Gender /} */}
        <div className="flex mb-3">
          <div className="w-1/3 pr-3">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <div className="flex">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="w-1/4 border border-gray-500 rounded-l-md outline-none"
              >
                {countryCodes.map((country, index) => (
                  <option key={index} value={country.code}>
                    {country.code} {country.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  if (e.target.value && !/^[6-9]/.test(e.target.value)) {
                    e.target.value = "";
                  }
                }}
                onChange={handleChange}
                className={`w-2/3 px-4 py-2 border border-gray-500 rounded-r-md outline-none ${
                  errors.phoneNumber ? "border-red-500" : ""
                }`}
              />
            </div>
            {errors.phoneNumber && (
              <span className="text-red-500 text-sm">{errors.phoneNumber}</span>
            )}
          </div>
          <div className="w-1/3 px-3">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              name="location"
              id="location"
              value={formData.location}
              onChange={handleChange}
              onFocus={handleFocus}
              className={`w-full px-4 py-2 border border-gray-500 outline-none rounded-md ${
                errors.location ? "border-red-500" : ""
              }`}
            />
            {errors.location && (
              <span className="text-red-500 text-sm">{errors.location}</span>
            )}
          </div>
          <div className="w-1/3 pl-3">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full px-4 py-2 border border-gray-500 outline-none rounded-md ${
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

        {/* {/ Row 3: Date of Birth, Highest Qualification, Subjects You Are Expert At /} */}
        <div className="flex mb-3">
          <div className="w-1/3 pr-3">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]} // Disable future dates
              className={`w-full px-4 py-2 border border-gray-500 outline-none rounded-md ${
                errors.dob ? "border-red-500" : ""
              }`}
            />
            {errors.dob && (
              <span className="text-red-500 text-sm">{errors.dob}</span>
            )}
          </div>
          <div className="w-1/3 px-3">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Highest Qualification
            </label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className={`w-full px-4 py-2 border border-gray-500 outline-none rounded-md ${
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
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Subjects You Are Expert At
            </label>
            <textarea
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full px-4 py-2 border border-gray-500 outline-none rounded-md ${
                errors.subject ? "border-red-500" : ""
              } h-10`}
            />
            {errors.subject && (
              <span className="text-red-500 text-sm">{errors.subject}</span>
            )}
          </div>
        </div>

        {/* {/ Row 4: Mode of Teaching, Charges per Hour, Available Timings /} */}
        <div className="flex mb-3">
          <div className="w-1/3 pr-3">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Mode of Teaching
            </label>
            <select
              name="modeOfTeaching"
              value={formData.modeOfTeaching}
              onChange={handleChange}
              className={`w-full px-4 py-2 border border-gray-500 outline-none rounded-md ${
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
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Charges Per Hour
            </label>
            <input
              type="text"
              name="chargesPerHour"
              value={formData.chargesPerHour}
              onChange={handleChange}
              className={`w-full px-4 py-2 border border-gray-500 outline-none rounded-md ${
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
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Available Time Slots
            </label>
            <select
              name="availableTimings"
              value={formData.availableTimings}
              onChange={handleChange}
              className={`w-full px-4 py-2 border border-gray-500 outline-none rounded-md`}
            >
              <option value="">Select Available Timing</option>
              {availableTimings.map((timing, index) => (
                <option key={index} value={timing}>
                  {timing}
                </option>
              ))}
            </select>
            {errors.availableTimings && (
          <span className="text-red-500 text-sm">{errors.availableTimings}</span>
        )}
          </div>
        </div>

        {/* {/ Row 5: Government ID Proof and Number, File Upload /} */}
        <div className="flex mb-6">
          <div className="w-1/3 pr-3">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Government ID Proof
            </label>
            <select
              name="govtIdProof"
              value={formData.govtIdProof}
              onChange={handleChange}
              className={`w-full px-4 py-2 border border-gray-500 outline-none rounded-md ${
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

          {/* {/ Government ID Number and File Upload fields are displayed when an ID Proof is selected /} */}
          {formData.govtIdProof && (
            <>
              <div className="w-1/3 px-3">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  {formData.govtIdProof === "Aadhaar Card"
                    ? "Aadhaar Number"
                    : "Passport Number"}
                </label>
                <input
                  type="text"
                  name="govtIdNumber"
                  value={formData.govtIdNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border border-gray-500 outline-none rounded-md ${
                    errors.govtIdNumber ? "border-red-500" : ""
                  }`}
                />
                {errors.govtIdNumber && (
                  <span className="text-red-500 text-sm">
                    {errors.govtIdNumber}
                  </span>
                )}
              </div>

              <div className="w-1/3 pl-3">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Upload{" "}
                  {formData.govtIdProof === "Aadhaar Card"
                    ? "Aadhaar Document"
                    : "Passport Document"}
                </label>
                <input
                  type="file"
                  name="file"
                  onChange={handleChange}
                  className={`w-full px-1 py-2 border border-gray-500 outline-none rounded-md ${
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
            type="submit"
            className="w-24 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-500"
          >
            <Link to='/success'>NEXT</Link>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Tutor;
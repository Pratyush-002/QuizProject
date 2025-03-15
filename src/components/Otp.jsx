import React, { useState, useContext } from "react";
import { LanguageContext } from '../context/TranslationContext';
import '../styles/Otp.css';

//import "bootstrap/dist/css/bootstrap.min.css";


const Otp = () => {
   const { language, translations } = useContext(LanguageContext);
  const [otp, setOtp] = useState("");
 

  const handleOTPSubmit = (e) => {
    e.preventDefault();
    if (otp === "654321") {
      alert(translations[language].otpSuccess);
      window.location.href = "/mywins";
    } else {
      alert(translations[language].otpInvalid);
    }
  };

  return (
    <div className="container" id="languageSelect">
      
      <div className="row justify-content-center">
        <div className="col-md-6 col-12">
          <div className="card p-4 mt-5 text-center">
            <h2>{translations[language].OTPVerification}</h2>
            <div className="mb-3">
              <label className="form-label">{translations[language].EnterOTP}</label>
              <input
                type="text"
                className="form-control"
                placeholder={translations[language].EnterOTP}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-primary w-100" onClick={handleOTPSubmit}>
              {translations[language].Verify}
            </button>
            {/* <div className="mt-3">
              <label className="me-2">Select Language:</label>
              <select value={language} onChange={(e) => updateLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div> */}
          </div>
        </div>
      </div>
      <svg className='editorial' viewBox='0 24 150 28' preserveAspectRatio='none'>
        <defs>
          <path id='gentle-wave' d='M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z' />
        </defs>
        <g className='parallax'>
          <use xlinkHref='#gentle-wave' x='50' y='0' fill='#4579e2' />
          <use xlinkHref='#gentle-wave' x='50' y='3' fill='#3461c1' />
          <use xlinkHref='#gentle-wave' x='50' y='6' fill='#2d55aa' />
        </g>
      </svg>
    </div>
  );
};

export default Otp;

import React, { useContext, useState } from 'react';
import { LanguageContext } from '../context/TranslationContext';
import '../styles/Login.css';

const Login = () => {
  const { language, translations } = useContext(LanguageContext);
  const [msisdn, setMsisdn] = useState("");  // ✅ Store phone number
  const [countryCode, setCountryCode] = useState("255"); // ✅ Store country code

  if (!translations || !translations[language]) {
    return <p>Loading...</p>;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const fullMsisdn = `${countryCode}${msisdn.trim()}`; // ✅ Ensure proper formatting
    localStorage.setItem("msisdn", fullMsisdn);
    window.location.href = "/otp";
  };

  return (
    <div id="body-pd" className="bg-color bgimg">
      <h3 className="width-img-combined">
        <img src={require("../assets/Combined.png")} alt="logo" />
      </h3>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6">
            <div className="card login-we">
              <div className="text-center">
                <h2>{translations[language].login}</h2>
                <h3>{translations[language].letsgetstarted}</h3>
                <h6 className="text-dark" dir="rtl">
                  {translations[language].WeWillsendyouanonetimeotponthismobilenumber}
                </h6>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label text-dark">
                    {translations[language].MSISDN}
                  </label>
                  <div className="input-group">
                    {/* ✅ Country Code Dropdown */}
                    <select
                      className="form-select"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      required
                    >
                      <option value="255">+255</option>
                      <option value="242">+242</option>
                      <option value="91">+91</option>
                    </select>
                    {/* ✅ Phone Number Input */}
                    <input
                      className="form-control"
                      placeholder={translations[language].EnterPhoneNumber}
                      type="tel"
                      value={msisdn}
                      onChange={(e) => setMsisdn(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary login-btn text-uppercase mt-3">
                    {translations[language].Getotp}
                  </button>
                </div>
              </form>
            </div>
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

export default Login;

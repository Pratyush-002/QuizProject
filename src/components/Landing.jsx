import React, { useContext } from 'react';
import { LanguageContext } from '../context/TranslationContext';
import '../styles/Landing.css'

export function Landing() {
  const { language, setLanguage, translations } = useContext(LanguageContext);

  // ✅ Add a check to prevent undefined errors
  if (!translations || !translations[language]) {
    return <p>Loading...</p>;
  }

  return (
    <div className='landing-img'>
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
      
      <div className='content'>
        <h1>{translations[language].GIGAPROMO}</h1>
        <div className='language-selection'>
          <h2>{translations[language].Language}</h2>
          <select className='language-dropdown' value={language} onChange={e => setLanguage(e.target.value)}>
            <option value='en'>{translations[language].english}</option>
            <option value='ar'>{translations[language].Arabic}</option>
          </select>
          <button type='button' className='btn login-btn' onClick={() => (window.location.href = '/login')}>
            {translations[language].ContinuewithPhone}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Landing;

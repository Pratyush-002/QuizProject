import React from 'react';

const Header = () => {
  return (
    <header className="header" id="header">
      {/* <div className="header_toggle">
        <i className="bx bx-menu" id="header-toggle"></i>
      </div>
      <div className="text-uppercase text-white" id="languageSelect">
        <h3 contentEditable="true" className="width-img"> */}
          {/* <img src="./img/White_logo.png" alt="logo" /> */}
        {/* </h3>
      </div> */}
      {/* <div className="header_img" onClick={() => logout()}>
        <img src="img/logout1.png" alt="logout" />
      </div> */}
    </header>
  );
};

const logout = () => {
  localStorage.removeItem('userToken');
  window.location.href = '/login';
};

export default Header;
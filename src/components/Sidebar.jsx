import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/sideBar.css'; // Import the new CSS

const Sidebar = () => {
  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        <ul className="sidebar-list">
          <li>
            <Link to="/quizes" className="sidebar-link">
              <img className="sidebar-icon" src={require("../assets/img-111.png")} alt="Quizes" />
              <span>Quizes</span>
            </Link>
          </li>
          <li>
            <Link to="/mywins" className="sidebar-link">
              <img className="sidebar-icon" src={require("../assets/img-891.png")} alt="My Wins" />
              <span>My Wins</span>
            </Link>
          </li>
          <li>
            <Link to="/leaderboard" className="sidebar-link">
              <img className="sidebar-icon" src={require("../assets/img-8901.png")} alt="Leaderboard" />
              <span>Leaderboard</span>
            </Link>
          </li>
          <li>
            <a href="#" className="sidebar-link" onClick={unsubscribeUser}>
              <img className="sidebar-icon" src={require("../assets/unsub.png")} alt="Unsubscribe" />
              <span>Unsubscribe</span>
            </a>
          </li>
          <li>
            <Link to="/upload" className="sidebar-link">
              <img className="sidebar-icon" src={require("../assets/upload1.png")} alt="Upload" />
              <span>Upload</span>
            </Link>
          </li>
          <li>
            <Link to="/" className="sidebar-link logout">
              <img className="sidebar-icon" src={require("../assets/logout-0.png")} alt="Logout" />
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

const unsubscribeUser = () => {
  const msisdn = localStorage.getItem('msisdn');
  if (!msisdn) {
    alert('MSISDN not found. Please log in again.');
    return;
  }
  const apiUrl = `http://52.12.48.166:8086/Integration6dCongoB/SubscribeService/subscribe?msisdn=${msisdn}&serviceId=18610&productId=P_Telco_GIGAP_5248&spId=2374&type=unsub`;
  fetch(apiUrl, { method: 'GET' })
    .then((response) => response.text())
    .then((str) => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(str, 'application/xml');
      const status = xml.querySelector('status')?.textContent;
      const statusCode = xml.querySelector('statusCode')?.textContent;
      if (status === 'true' && statusCode === '3001') {
        alert('You have successfully unsubscribed.');
        window.location.href = '/login';
      } else {
        alert('Unsubscribe failed.');
      }
    })
    .catch((error) => {
      console.error('Unsubscribe API Error:', error);
      alert('An error occurred while unsubscribing.');
    });
};

export default Sidebar;

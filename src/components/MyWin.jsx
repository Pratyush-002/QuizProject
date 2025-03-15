import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import LoadingOverlay from './LoadingOverlay';
import '../styles/MyWins.css';

const MyWins = () => {
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState(null); // Store userId
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const recordsPerPage = 10;
  const msisdn = localStorage.getItem('msisdn');
  const url = `https://globicall.globicallservices.com/QuizIntegration/LoginServlet?reportType=userPoints&msisdn=${msisdn}`;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url);
      const result = await response.json();
      setData(result.userList);
      setUserId(result.userId); // Set userId state
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayPage = (page) => {
    const start = (page - 1) * recordsPerPage;
    const end = page * recordsPerPage;
    return data.slice(start, end).map((item, index) => (
      <tr key={index} className="mywins-table-row">
        <td className="mywins-table-data">{item.inserted_date}</td>
        <td className="mywins-table-data">{`${item.correct_answers}/${item.NumberOfquestion}`}</td>
        <td className="mywins-table-data">{`${item.total_points} MB`}</td>
      </tr>
    ));
  };

  const pageCount = Math.ceil(data.length / recordsPerPage);

  return (
    <div className="mywins-dashboard-container">
      <Sidebar />

      <div className="mywins-content">
        <div className="mywins-main-container">
          <article className="mywins-section-1">
            <div className="mywins-card2">
              <div className="mywins-card">
                <div className="mywins-row">
                  <div className="mywins-col-3">
                    <p className="mywins-user-icon">
                      <img src={require("../assets/Rectangle 33.png")} alt="User Icon" />
                    </p>
                  </div>
                  <div className="mywins-col-4">
                    <div className="mywins-user-info">
                      <p>
                        <span style={{color:"black"}}>{userId ? userId : 'Loading...'}</span>
                      </p>
                    </div>
                  </div>
                  <div className="mywins-col-4 mywins-vls">
                    <div className="mywins-total-played">
                      <p className="mywins-total-played-text">
                        <b>Total Played</b>
                      </p>
                      <div id="totalPlayers" className="mywins-total-played-value">
                        {data.length > 0 ? data.length : 'Loading...'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
          <article className="mywins-section-2">
            <div className="mywins-table-container">
              <div className="mywins-table-card">
                <h6 className="mywins-table-title">Your Score</h6>
                <table id="mywins-dataTable">
                  <tbody>{displayPage(currentPage)}</tbody>
                </table>
                <div className="mywins-pagination">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="mywins-pagination-button"
                  >
                    Previous
                  </button>
                  {Array.from({ length: pageCount }, (_, i) => (
                    <button
                      key={i + 1}
                      className={`mywins-pagination-button ${currentPage === i + 1 ? 'mywins-pagination-active' : ''}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === pageCount}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="mywins-pagination-button"
                  >
                    Next
                  </button>
                </div>
              </div>
              {loading && <LoadingOverlay />}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default MyWins;

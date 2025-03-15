import React, { useState, useEffect } from 'react';
import LoadingOverlay from './LoadingOverlay';
import Sidebar from './Sidebar';
import '../styles/Leaderboard.css';

const Leaderboard = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const recordsPerPage = 10;
  const url = `https://globicall.globicallservices.com/QuizIntegration/QuestionList?reportType=LeaderBoard`;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url);
      const result = await response.json();
      setData(result.sort((a, b) => b.total_points - a.total_points));
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
      <tr key={index}>
        <td>{start + index + 1}</td>
        <td>{item.userId}</td>
        <td>{`${item.total_points} MB`}</td>
      </tr>
    ));
  };

  const pageCount = Math.ceil(data.length / recordsPerPage);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div className="leaderboard-section">
          <div className="header-section">
            <div className="title">Leaderboards</div>
            <div className="info-container">
              <div className="info-box">
                <p>Total Played</p>
                <div id="totalPlayers" className="rank-box">Loading...</div>
              </div>
              <div className="info-box">
                <p>Your Rank</p>
                <div id="userRank" className="rank-box">Loading...</div>
              </div>
            </div>
          </div>

          <div className="table-container">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>User ID</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>{displayPage(currentPage)}</tbody>
            </table>
          </div>

          <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
              Previous
            </button>
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? 'active' : ''}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button disabled={currentPage === pageCount} onClick={() => setCurrentPage(currentPage + 1)}>
              Next
            </button>
          </div>
        </div>
      </div>
      {loading && <LoadingOverlay />}
    </div>
  );
};

export default Leaderboard;

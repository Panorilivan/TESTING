import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const History = () => {
  const [visitHistory, setVisitHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVisitHistory = async () => {
      try {
        const userId = "your_user_id"; // Replace with the actual user ID
        const response = await axios.get(`http://localhost:5000/visitHistory/${userId}`);
        setVisitHistory(response.data.loginHistory);
        setLoading(false);
      } catch (err) {
        setError("Error fetching visit history.");
        setLoading(false);
      }
    };

    fetchVisitHistory();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Visit History</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time In</th>
            <th>Time Out</th>
            <th>Total Visit Hours</th>
          </tr>
        </thead>
        <tbody>
          {visitHistory.map((visit) => (
            <tr key={visit._id}>
              <td>{new Date(visit.date).toLocaleDateString()}</td>
              <td>{visit.timeIn}</td>
              <td>{visit.timeOut || "Not logged out"}</td>
              <td>{visit.totalVisitHours || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};

export default History;

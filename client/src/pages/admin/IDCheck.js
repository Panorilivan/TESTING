import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles.css";

const IDCheck = () => {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isEmailSent, setIsEmailSent] = useState(false);

  // handle search for user
  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get("http://localhost:5000/auth/search", {
        params: { email },
      });
      setResult(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error searching for user");
      setResult(null);
    }
  };

  // handle activating user and sending success email
  const handleContinue = async () => {
    if (result) {
      try {
        // isActive status to true
        await axios.put("http://localhost:5000/users/activate", {
          email: result.email,
        });

        // send success email
        await axios.post("http://localhost:5000/send-success-email", {
          email: result.email,
        });

        alert("Yey! User has been activated!");
        setIsEmailSent(true);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Whoopsie! An error has occurred. Please try again or check console."
        );
      }
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="card twotone">
        <div className="row">
          <div className="col dark-background">
            <div className="half">
              <img src="media/search.webp" className="idlogo" alt="ID Logo" />
              <h5>
                <b>Activate a Member</b>
              </h5>
              <p>
                Please enter their registered ID.
                <br />
                <br />
                Only bonafide students, instructors, and personnel can utilize
                the fitness gym.
              </p>
            </div>
          </div>
          <div className="col light-background">
            <div className="card-body">
              <form onSubmit={handleSearch}>
                <div className="input-group mb-3 search">
                  <div className="form-floating flex-grow-1">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingInput"
                      placeholder="Enter text or numbers"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="floatingInput">Institutional ID</label>
                  </div>
                  <button
                    className="btn btn-outline-secondary"
                    type="submit"
                    id="button-addon2"
                  >
                    Search
                  </button>
                </div>
              </form>
              <div className="results">
                {error && <div className="alert alert-danger">{error}</div>}
                {result ? (
                  <div className="cardresult">
                    <div className="card-body">
                      <h5>Result:</h5>
                      <p>
                        <strong>Name:</strong> {result.firstName}{" "}
                        {result.lastName}
                      </p>
                      <p>
                        <strong>Email:</strong> {result.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="cardresult">
                    <div className="card-body">
                      Results will be displayed here after <br />
                      clicking on the search button.
                    </div>
                  </div>
                )}
              </div>
              <div className="reqbuttons">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="btn btn-dark backback"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  className="btn btn-primary gotit"
                  onClick={handleContinue}
                  disabled={!result || isEmailSent}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDCheck;

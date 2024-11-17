import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "./styles.css";

const Signup = () => {
  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailError, setEmailError] = useState("");
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const validateEmail = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    const emailPattern =
      /^[a-zA-Z0-9._%+-]+@(student\.buksu\.edu\.ph|buksu\.edu\.ph)$/;

    if (!emailPattern.test(emailValue)) {
      setEmailError("Please use a valid BukSU institutional email.");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError) {
      alert("Please use a valid BukSU email.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
        credentials: "include",
      });

      if (response.ok) {
        navigate("/success");
      } else {
        const data = await response.json();
        alert(data.message || "Signup failed, please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  const goBack = () => navigate(-1);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="card twotone">
        <div className="row">
          <div className="col dark-background">
            <div className="half">
              <img src="/media/write.webp" className="idlogo" alt="ID Logo" />
              <h5>
                <b>Register for free!</b>
              </h5>
              <p>Signup using your BukSU email to enjoy your fitness perks!</p>
            </div>
          </div>
          <div className="col light-background">
            <div className="card-body">
              <button
                className="google-signin-button"
                onClick={handleGoogleSignIn}
              >
                <div className="image-container">
                  <img
                    className="svgs"
                    src="media/dummy.svg"
                    alt="Google Logo"
                  />
                  <img
                    className="svgs"
                    src="media/divider2.svg"
                    alt="Divider"
                  />
                </div>
              </button>

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="floatingFirstName"
                        placeholder="John"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      <label htmlFor="floatingFirstName">First Name</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="floatingLastName"
                        placeholder="Doe"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                      <label htmlFor="floatingLastName">Last Name</label>
                    </div>
                  </div>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className={`form-control ${emailError ? "is-invalid" : ""}`}
                    id="floatingInput"
                    placeholder="12345678@buksu.edu.ph"
                    value={email}
                    onChange={validateEmail}
                    required
                  />
                  <label htmlFor="floatingInput">Institutional Email</label>
                  {emailError && (
                    <div className="invalid-feedback">{emailError}</div>
                  )}
                </div>

                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexCheckDefault"
                    required
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    I have read the
                    <b
                      className="text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowTerms(true)}
                    >
                      Terms & Conditions
                    </b>{" "}
                    and
                    <b
                      className="text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowPrivacy(true)}
                    >
                      BukSU Data Collection & Privacy
                    </b>
                  </label>
                </div>

                <div className="reqbuttons">
                  <button onClick={goBack} className="btn btn-dark backback">
                    Go Back
                  </button>
                  <button type="submit" className="btn btn-primary gotit">
                    Continue
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* terms modal */}
      <Modal show={showTerms} onHide={() => setShowTerms(false)} centered>
        <Modal.Header>
          <Modal.Title>Terms & Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>tbd</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowTerms(false)}>
            Got it!
          </Button>
        </Modal.Footer>
      </Modal>
      {/* privacy modal */}
      <Modal show={showPrivacy} onHide={() => setShowPrivacy(false)} centered>
        <Modal.Header>
          <Modal.Title>BukSU Data Collection & Privacy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            In compliance with the <b>Data Privacy Act of 2012</b>, BukSU
            Fitness Gym - Digital Logging System is committed to protect and
            respect your personal data privacy.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowPrivacy(false)}>
            Got it!
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Signup;

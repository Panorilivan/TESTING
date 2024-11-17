import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import DataTable from "react-data-table-component";
import "../styles.css";

const ManageMembers = () => {
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("http://localhost:5000/users");
        const data = await response.json();

        const formattedData = data.map((member) => ({
          ...member,
          userId: member.email.split("@")[0],
          signupMethod: member.googleId ? "Continue with Google" : "Manual",
        }));

        setMembers(formattedData);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, []);

  const handleUpdateClick = (member) => {
    navigate("/update", { state: { user: member } });
  };

  // Define columns for DataTable
  const columns = [
    {
      name: "Name",
      selector: (row) => `${row.firstName} ${row.lastName}`,
      sortable: true,
    },
    {
      name: "ID",
      selector: (row) => row.userId,
      sortable: true,
    },
    {
      name: "Signup Method",
      selector: (row) => row.signupMethod,
      sortable: true,
    },
    {
      name: "Options",
      cell: (row) => (
        <>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleUpdateClick(row)}
          >
            Update Details
          </button>
          <button type="button" className="btn btn-danger">
            Archive Member
          </button>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];
  

  return (
    <div className="d-flex">
      {/* sidebar */}
      <div className="sidebar" id="sidebar">
        <ul className="nav flex-column">
          <li className="nav-item">
            <a className="nav-link" href="/">
              Home
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link active" href="/">
              Members
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/">
              Report Generation
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/">
              Equipments
            </a>
          </li>
        </ul>
      </div>

      {/* main content */}
      <div className="content flex-grow-1">
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
          <div className="container-fluid d-flex align-items-center">
            <button
              className="btn btn-primary hamburger"
              type="button"
              aria-label="Toggle sidebar"
              onClick={() => {
                document.getElementById("sidebar").classList.toggle("show");
                document
                  .querySelector(".content")
                  .classList.toggle("sidebar-open");
              }}
            >
              ☰
            </button>
            <a className="navbar-brand branding ms-2" href="/">
              <img src="../media/logo.png" className="slogo" alt="Logo" />
              BukSU Fitness Gym Admin Panel
            </a>
            <div className="ms-auto">
              <button type="button" className="btn btn-danger">
                Log out
              </button>
            </div>
          </div>
        </nav>

        <div className="contentbody">
          <div className="container mt-4 welcome">
            <img
              src="../media/members.webp"
              className="bigimage"
              alt="Welcome"
            />
            <h1 className="headertxt">Manage Members</h1>
            <p>
              Add, edit, or archive members in this list. You can find archived
              members in the “Signed Up” tab.
            </p>
          </div>

          <ul className="nav navpill nav-pills">
            <li className="nav-item">
              <a
                className="nav-link pilled active"
                aria-current="page"
                href="/"
              >
                Activated
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link inactivepill" href="/">
                Signed Up
              </a>
            </li>
            <li className="nav-item">
              <div className="linee"></div>
            </li>
            <li className="nav-item">
              <button className="btn circlebuttonsb">
                <i className="bi bi-plus-lg"></i>
              </button>
            </li>
            <li className="nav-item">
              <button className="btn circlebuttonsr">
                <i className="bi bi-archive"></i>
              </button>
            </li>
            <li className="nav-item">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search for..."
                  aria-label="Search for..."
                  aria-describedby="button-addon2"
                />
                <button
                  className="btn btn-secondary"
                  type="button"
                  id="button-addon2"
                >
                  Go
                </button>
              </div>
            </li>
          </ul>

          {/* DataTable component */}
          <DataTable
            columns={columns}
            data={members}
            pagination
            highlightOnHover
            selectableRows
          />
        </div>
      </div>
    </div>
  );
};

export default ManageMembers;

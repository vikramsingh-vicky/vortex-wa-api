import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Icon from "../../media/vortex_final_logo.png";
import './Login.css'
import Swal from "sweetalert2";

// import User from '../../media/user.png'
import { Row } from "react-bootstrap";
import socket from "../../socketManager";
import apiService from "../../apiService";

// Main function starts here

function Login() {
  
  const navigate = useNavigate(); // to navigate to desired pages
  const [formData, setFormData] = useState({
    // To handle the Form Data and reseting the Form Data
    username: "",
    password: "",
  });
  const [loggedIn, setLoggedIn] = useState(false); // Setting the log in status of the user

  // Handling changes in form values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handling Form Submit
  const handleSubmit = (e) => {
    e.preventDefault(); // Preventing form to submit blank values.
    // console.log(formData);
    try {
      apiService.post('/auth/login', formData) //Linking and sending data to backend server's user's database
        .then((response) => {
          console.log(response);
          // Handling Server Response
          if (response.data.message === "Login Successful") {
            // console.log(response.data.Token);
            const token = response.data.Token; // Storing the token in a variable
            console.log(token);
            try {
              const headers = {
                "auth-token": token,
              };
              const data = {
                "Token": token,
              }
              console.log(headers);
              apiService.post('/user/fetchUser', data, {
                  headers: headers,
                })
                .then((respo) => {
                  console.log(respo);
                  if (!respo.data) {
                    Swal.fire({
                      title: "Invalid Credentials",
                      text: "Please enter valid credentials",
                      icon: "error",
                    });
                    document.getElementById("swal2-checkbox").style.display = "none";
                  } else {
                    setLoggedIn(true);
                    localStorage.setItem("loggedIn", "true");
                    localStorage.setItem("user", respo.data.name);
                    localStorage.setItem("mobile", respo.data.mobile);
                    localStorage.setItem("email", respo.data.email);
                    localStorage.setItem("uuid", respo.data.uuid);
                    localStorage.setItem("insID", respo.data.insID);
                    localStorage.setItem("uName", respo.data.username);
                    try {
                      const d = {
                        uuid: respo.data.uuid,
                        insID: respo.data.insID
                      }
                      apiService.post('/waRoutes/fetchInstance', d)
                      .then((res) => {
                        console.log(res.data);
                        if(res.data.message === "Instance Found") {
                          navigate("/dashboard");
                        } else {
                          const data = {
                            uuid : respo.data.uuid,
                            insID: respo.data.insID,
                            name: 'Admin'
                          }
                          apiService.post('/waRoutes/createInstance', data)
                         .then((result) => {
                            // console.log(result);
                            if(result.data.message === "Instance Created"){
                              // setInstanceData(respo.data.result);
                              Swal.fire({
                                title: result.data.message,
                                text: "You can now proceed with Vortex WhatsApp API.",
                                icon: "success",
                                confirmButtonText: "OK",
                                allowOutsideClick: false,
                              }).then((results) => {
                                if (results.isConfirmed) {
                                  socket.emit('fetchInstance', {uuid: localStorage.getItem("uuid")})
                                }
                              });
                              document.getElementById("swal2-checkbox").style.display = "none";
                              navigate("/dashboard"); // Navigate to Home page
                              // Reseting the form data to blank
                              setFormData({
                                username: "",
                                password: "",
                              });
                            }else{
                              Swal.fire({
                                title: result.data.message,
                                text: "Unable to create instance. Please try login again.",
                                icon: "error",
                                confirmButtonText: "OK",
                              }).then((resp) => {
                                if (resp.isConfirmed) {
                                  navigate("/login"); // Navigate to Login page
                                }
                              })
                              document.getElementById("swal2-checkbox").style.display = "none";
                            }
                          })
                        }
                      })

                    }catch (error) {
                      Swal.fire({
                        title: "Instance Creation Error",
                        text: "Unable to create instance. Please try login again.",
                        icon: "error",
                        confirmButtonText: "OK",
                      }).then((response) => {
                        if (response.isConfirmed) {
                          navigate("/login"); // Navigate to Home page
                        }
                      })
                    }
                  }
                });
            } catch (error) {
              Swal.fire({
                title: "Data Error",
                text: "Unable to fetch User Details. Please try again.",
                icon: "error",
              });
              document.getElementById("swal2-checkbox").style.display = "none";
            }
          } else {
            Swal.fire({
              title: "Invalid Credentials",
              text: response.data.message,
              icon: "error",
            });
            document.getElementById("swal2-checkbox").style.display = "none";
          }
        });
    } catch (error) {
      // console.error("Error sending form data:", error);
    }
  };

  // Setting user logged in status and storing to localstorage
  useEffect(() => {
    // const storedLoggedIn = localStorage.getItem("loggedIn");
    if (loggedIn === "true") {
      navigate("/dashboard"); // Navigate to Home page
    }
  }, [loggedIn, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <div className="login-div flex">
        <Card style={{}} className="login-card">
          <img
            variant="top"
            alt="icon"
            src={Icon}
            className="login-img"
            style={{}}
          />
          <Card.Body>
            <h2 style={{ transform: "translateY(-55%)", color: "white" }}>
              Welcome Back!
            </h2>
            <Card.Text style={{ color: "white" }}>
              Please login to get the access to your dashboard.
            </Card.Text>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Form.Group className="mb-3" controlId="Email">
                  <Form.Label className="mb-3 label">
                    Email Or Username
                  </Form.Label>
                  <Form.Control
                    className="shadow input-login-signup"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group className="mb-3" controlId="Password">
                  <Form.Label className="mb-3 label">Password</Form.Label>
                  <div className="input-group">
                    <Form.Control
                      className="shadow input-login-signup"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      style={{}}
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    {showPassword ? (
                      <span
                        className="material-symbols-outlined mt-2"
                        style={{
                          color: "#ffffff",
                          cursor: "pointer",
                          marginLeft: "8px",
                          fontSize: "2rem",
                        }}
                        onClick={togglePasswordVisibility}
                      >
                        visibility_lock
                      </span>
                    ) : (
                      <span
                        className="material-symbols-outlined mt-2"
                        style={{
                          color: "#ffffff",
                          cursor: "pointer",
                          marginLeft: "8px",
                          fontSize: "2rem",
                        }}
                        onClick={togglePasswordVisibility}
                      >
                        visibility
                      </span>
                    )}
                  </div>
                </Form.Group>
              </Row>
              <Row className="mb-2">
                <Link
                  style={{
                    textAlign: "right",
                    fontSize: "1.2rem",
                    color: "#daa520",
                    textDecorationLine: "none",
                  }}
                  to={"/forget"}
                >
                  Forget Password?
                </Link>
              </Row>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Text
                  style={{ color: "white", transform: "translateY(-50%)" }}
                >
                  By signing, you agree to our{" "}
                  <Link
                    style={{ textDecorationLine: "none", color: "orange" }}
                    to={"/"}
                  >
                    Privace Policy
                  </Link>
                </Form.Text>
              </Form.Group>
              {
                <Button
                  variant={
                    formData.username && formData.password
                      ? "success"
                      : "danger"
                  }
                  className="mb-4"
                  type="submit"
                >
                  Login
                </Button>
              }
              <Form.Group className="mb-3" controlId="register">
                <Form.Text style={{ color: "white" }} className="mb-3">
                  Don't have an account?{" "}
                  <Link
                    style={{
                      fontSize: "1.2rem",
                      textDecorationLine: "none",
                      color: "yellowgreen",
                    }}
                    to={"/signup"}
                  >
                    Register Now
                  </Link>
                </Form.Text>
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default Login;

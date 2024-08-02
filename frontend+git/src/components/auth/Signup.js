import React, {useCallback, useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {Button, Card, Form, Row, Col} from 'react-bootstrap';
import Icon from '../../media/vortex_final_logo.png';
import './Login.css'
import Swal from 'sweetalert2';

import apiService from "../../apiService";

function Signup() {
  
  const [captcha, setCaptcha] = useState("");
  const [captchaValid, setCaptchaValid] = useState(false);

  const navigate = useNavigate(); // to navigate to desired pages
  const [cons, setCons] = useState(false) // Enabling and Disabling the Login Button
  const [formData, setFormData] = useState({ // To handle the Form Data and reseting the Form Data
    name: '',
    username: '',
    email:'',
    mobile:'',
    password: '',
    repassword:''
  });
  // const [loggedIn, setLoggedIn] = useState(false); // Setting the log in status of the user
  const chkUsername = (e) => {
    const {name, value} = e.target;
    const data = {
      [name]: value
    }
    // console.log(data)
    apiService.post('/auth/chkusername',data)
      .then(response =>{
        if(response.data.message === "Username already taken."){
          const usrSpan = document.getElementById("usernameSpan")
          usrSpan.hidden = false;
          usrSpan.textContent = response.data.message;
          usrSpan.style.color = 'red';
        }else{
          const usrSpan = document.getElementById("usernameSpan")
          usrSpan.hidden = false;
          usrSpan.textContent = response.data.message;
          usrSpan.style.color = 'green';
        }
      })
  }

  const chkEmail = (e) => {
    const {name, value} = e.target;
    const data = {
      [name]: value
    }
    // console.log(data)
    apiService.post('/auth/chkemail',data)
      .then(response =>{
        if(response.data.message === "Email already registered"){
          const usrSpan = document.getElementById("emailSpan")
          usrSpan.hidden = false;
          usrSpan.textContent = response.data.message;
          usrSpan.style.color = 'red';
        }else{
          const usrSpan = document.getElementById("emailSpan")
          usrSpan.hidden = false;
          usrSpan.textContent = response.data.message;
          usrSpan.style.color = 'green';
        }
      })
  }

  // Handling changes in form values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if(formData.username.length>3 && formData.password.length>3){
      setCons(true)
    }else{
      setCons(false)
    }
  };

  const machPassword= (e) => {
    const {name, value} = e.target
    const pass = formData.password;
    // console.log(pass)
    if(pass === value && name === "repassword"){
      const passSpan = document.getElementById("pMatched")
      passSpan.hidden = false;
      passSpan.textContent = "Password matched";
      passSpan.style.color = 'green';
      passSpan.style.backgroundColor = 'white';
    }else{
      const passSpan = document.getElementById("pMatched")
      passSpan.hidden = false;
      passSpan.textContent = "Password not matched";
      passSpan.style.color ='red';
      passSpan.style.backgroundColor = 'white';
    }
  }
  
  // Handling Form Submit
  const handleSubmit = (e) => {
    e.preventDefault(); // Preventing form to submit blank values.    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire({
        title: "Invalid Details",
        text: "Please validate the details you have entered.",
        icon: "warning"
      });
      document.getElementById("swal2-checkbox").style.display = "none";
      return;
    }
    if (cons === true && captchaValid) {
      apiService.post('/auth/signup',formData) //Linking and sending data to backend server's user's database
      .then(response => { // Handling Server Response
        // console.log('Server response:', response.data);
        if(response.data.message === "Signup Successful"){
            navigate("/login") // Navigate to Home page
            // Reseting the form data to blank
            setFormData({
              name: '',
              username: '',
              email:'',
              mobile:'',
              password: '',
              repassword:'',
              captcha:''
            });
            Swal.fire({
              title: "Signup Successful",
              text: "You have successfully signed up.",
              icon: "success",
              confirmButtonText: "Ok",
            });
            document.getElementById("swal2-checkbox").style.display = "none";
        }else{
          Swal.fire({
            title: "Signup Failed",
            text: response.data.message,
            icon: "error"
          });
          document.getElementById("swal2-checkbox").style.display = "none";
        }
      })
      .catch(error => {
        // console.error('Error sending form data:', error);
      });
    } else {
      Swal.fire({
        title: "Invalid Details",
        text: "Please validate the details you have entered.",
        icon: "warning"
      });
      document.getElementById("swal2-checkbox").style.display = "none";
    }
  };

  const handleCaptchaChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, captcha: value });
    setCaptchaValid(value === formData.captchaImage.text);
    // console.log(captchaValid)
  };
  const generateCaptcha = useCallback( async () => {
    try {
      const response = await apiService.get('/auth/captcha');
      // console.log(response.data);
      setFormData({ ...formData, captchaImage: response.data.captcha });
      setCaptcha(response.data.captcha);
      // console.log(response.data.data);
    } catch (error) {
      // console.error("Error generating captcha:", error);
    }
  },[formData]);

  const reloadCaptcha = () => {
    generateCaptcha();
  };
    
  // Load captcha image on component mount
  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const [showRePassword, setReShowPassword] = useState(false);
  const toggleRePasswordVisibility = () => {
    setReShowPassword((prevShowRePassword) => !prevShowRePassword);
  };

  return (
    <>
      <div className="signup-div flex">
        <Card style={{  }} className='signup-card'>
          <img variant="top" alt='Unreal Automation' src={Icon} className='signup-img' style={{}} />
          <Card.Body>
            <h2 style={{transform:'translateY(-100%)', color:'white'}}>Let's Get You On Board!</h2>
            <Card.Text style={{color:'white'}}>
              Great things await us in the near future. Let us take you to a universe of automation.
              </Card.Text>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col lg='6' sm='12'>
                    <Form.Group className="mb-2" controlId="Name">
                      <Form.Label className="mb-4 label">Name</Form.Label>
                      <Form.Control type="text" name='name' className='shadow input-login-signup' value={formData.name} onChange={handleChange} required />                      
                    </Form.Group>
                  </Col>
                  <Col lg='6' sm='12'>
                    <Form.Group className="mb-2" controlId="Username">
                      <Form.Label className="mb-4 label">Username</Form.Label>
                      <Form.Control type="text" name='username' className=' shadow input-login-signup' value={formData.username} onChange={handleChange} onBlur={chkUsername} required />
                      <span id='usernameSpan' style={{fontSize:'0.8rem'}}></span>   
                    </Form.Group>                  
                  </Col>
                </Row>
                <Row>
                  <Col lg='6' sm='12'>
                    <Form.Group className="mb-2" controlId="Email">
                      <Form.Label className="mb-4 label">Email</Form.Label>
                      <Form.Control type="text" name='email' className=' shadow input-login-signup' value={formData.email} onChange={handleChange} onBlur={chkEmail} required />
                      <span id='emailSpan' style={{fontSize:'0.8rem'}}></span>                     
                    </Form.Group>
                  </Col>
                  <Col lg='6' sm='12'>
                    <Form.Group className="mb-2" controlId="Mobile">
                      <Form.Label className="mb-4 label">Mobile No</Form.Label>
                      <Form.Control type="text" name='mobile' className=' shadow input-login-signup' value={formData.mobile} onChange={handleChange} required />
                      <span id='mobileSpan' style={{fontSize:'0.8rem'}}>Enter your number with country code without '+'</span>                     
                    </Form.Group>
                  </Col>
                  
                </Row>
                <Row>
                  <Col lg='6' sm='12'>
                    <Form.Group className="mb-2" controlId="Password">
                      <Form.Label className="mb-4 label">Password</Form.Label>
                      <div className="input-group">
                        <Form.Control type={showPassword ? "text" : "password"} name="password" className=' shadow input-login-signup' style={{borderRadius:'1rem', backgroundColor:'transparent', color:'black'}} value={formData.password} onChange={handleChange} required />
                        {
                          <span className="material-symbols-outlined mt-2" style={{color: '#ffffff', cursor:'pointer', marginLeft:'8px', fontSize:'2rem'}} onClick={togglePasswordVisibility}>{showPassword ? "visibility_lock" : "visibility" }</span>
                        }
                      </div>
                    </Form.Group>
                  </Col>
                  <Col lg='6' sm='12'>
                    <Form.Group className="mb-2" controlId="rePassword">
                      <Form.Label className="mb-4 label">Repeat Password</Form.Label>
                      <div className="input-group">
                        <Form.Control type={showRePassword ? "text" : "password"} name="repassword" className=' shadow input-login-signup' style={{borderRadius:'1rem', backgroundColor:'transparent', color:'black'}} value={formData.repassword} onKeyUp={machPassword} onChange={handleChange} required />                        
                        {
                          <span className="material-symbols-outlined mt-2" style={{color: '#ffffff', cursor:'pointer', marginLeft:'8px', fontSize:'2rem'}} onClick={toggleRePasswordVisibility}>{showRePassword ? "visibility_lock" : "visibility" }</span>
                        }
                      </div>
                      <span id='pMatched' style={{fontSize:'0.8rem'}} hidden></span>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col lg='6' sm='12'>
                    <Form.Group className="mb-2" controlId="Captcha">
                      <Form.Label className="mb-4 label">Captcha</Form.Label>
                      <Form.Control type="text" name="captcha" className=' shadow input-login-signup' style={{borderRadius:'1rem', backgroundColor:'transparent', color:'black'}} value={formData.captcha} onChange={handleCaptchaChange} required />
                    </Form.Group>
                  </Col>
                  <Col lg='6' sm='12'>
                    {captcha.data && (
                      <>
                        <Row>
                          <Col className='mt-5' dangerouslySetInnerHTML={{ __html: captcha.data }}></Col>
                          <Col className='mt-5'>
                            <i className="bi bi-arrow-clockwise fa-spin" style={{fontSize:'2.5rem'  }} onClick={reloadCaptcha}></i>
                          </Col>
                        </Row>
                      </>
                    )}
                  </Col>
                </Row>
                <Form.Group className="mb-4" controlId="formBasicCheckbox">
                  <Form.Text style={{color:'white', transform:'translateY(-50%)'}}>
                    By signing you agree to our <Link style={{textDecorationLine:'none', color:'orange'}} to={'/'}>Privace Policy</Link>
                  </Form.Text>
                </Form.Group>
                {
                  <Button variant={cons ? "success":"danger"} className='mb-4' type="submit">
                    Signup
                  </Button>
                }
                <Form.Group className="mb-4" controlId="login">
                  <Form.Text style={{color:'white'}} className=''>
                    Already have an account? <Link to={'/login'} style={{fontSize:'1.2rem', textDecorationLine:'none', color:'yellowgreen'}}>Login Now</Link>
                  </Form.Text>
                </Form.Group>
              </Form>              
          </Card.Body>
        </Card>
      </div>
    </>
  )
}

export default Signup

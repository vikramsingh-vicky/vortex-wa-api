import React, { useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Icon from '../../media/vortex_final_logo.png';
import Swal from 'sweetalert2';

import { Row } from 'react-bootstrap';
import apiService from '../../apiService';

// Main function starts here

function ForgetPass() {
  const navigate = useNavigate(); // to navigate to desired pages
  const [cons, setCons] = useState(false) // Enabling and Disabling the Login Button
  const [formData, setFormData] = useState({ // To handle the Form Data and reseting the Form Data
    username: '',
    password: '',
    repassword:''
  });

  // Handling changes in form values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if(formData.username.length>=3 && formData.password.length>=3){
      setCons(true)
    }else{
      setCons(false)
    }
  };
  
  // Handling Form Submit
  const handleSubmit = (e) => {
    e.preventDefault(); // Preventing form to submit blank values.
    
    if (cons === true) {
      apiService.post('/auth/rePass',formData) //Linking and sending data to backend server's user's database
      .then(response => { // Handling Server Response
        if(response.data.message === "Password reset successful, please login."){
          Swal.fire({
            title: "Password Reset Successful",
            text: response.data.message,
            icon: "success"
          });
          document.getElementById("swal2-checkbox").style.display = "none";
            navigate("/login") // Navigate to Home page
            // Reseting the form data to blank
            setFormData({
              username: '',
              password: '',
              repassword: ''
            });
        }else{
          Swal.fire({
            title: "Invalid Credentials",
            text: response.data.message,
            icon: "error"
          });
          document.getElementById("swal2-checkbox").style.display = "none";
        }
      })
      .catch(error => {
        Swal.fire({
          title: "Error",
          text: "Something went wrong, please try again.",
          icon: "error"
        });
        document.getElementById("swal2-checkbox").style.display = "none";
      });
    } else {
      Swal.fire({
        title: "Oops!",
        text: "Validate your details.",
        icon: "warning"
      });
      document.getElementById("swal2-checkbox").style.display = "none";
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
    }else{
      const passSpan = document.getElementById("pMatched")
      passSpan.hidden = false;
      passSpan.textContent = "Password not matched";
      passSpan.style.color ='red';
    }
  }

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
      <div className="login-div flex">
        <Card style={{  }} className='login-card'>
          <img variant="top" alt='icon' src={Icon} className='login-img' style={{}} />
          <Card.Body>
            <h2 style={{transform:'translateY(-55%)', color:'white'}}>Forgot Password!</h2>
            <Card.Text style={{color:'white'}}>
              No worries, re-generate your new password.
              </Card.Text>
              <Form onSubmit={handleSubmit}>
                <Row>
                <Form.Group className="mb-3" controlId="Email">
                  <Form.Label className="mb-3 label">Registered Email</Form.Label>
                    <Form.Control className='shadow input-login-signup' type="email" name='username'  value={formData.username} onChange={handleChange} required />                  
                </Form.Group>
                </Row>
                <Row>
                <Form.Group className="mb-3" controlId="Password">
                  <Form.Label className="mb-3 label">New Password</Form.Label>
                  <div className="input-group">
                    <Form.Control className='shadow input-login-signup' type={showPassword ? "text" : "password"} name="password" style={{}} value={formData.password} onChange={handleChange} required />                  
                    { 
                      <span className="material-symbols-outlined mt-2" style={{color: '#ffffff', cursor:'pointer', marginLeft:'8px', fontSize:'2rem'}} onClick={togglePasswordVisibility}>{showPassword ? "visibility_lock" : "visibility"}</span>
                    }
                  </div>
                </Form.Group>
                </Row>
                <Row>
                <Form.Group className="mb-3" controlId="rePassword">
                  <Form.Label className="mb-3 label">Re-enter New Password</Form.Label>
                  <div className="input-group">
                    <Form.Control className='shadow input-login-signup' type={showRePassword ? "text" : "password"} name="repassword" style={{}} value={formData.repassword} onKeyUp={machPassword} onChange={handleChange} required />                  
                    {
                      <span className="material-symbols-outlined mt-2" style={{color: '#ffffff', cursor:'pointer', marginLeft:'8px', fontSize:'2rem'}} onClick={toggleRePasswordVisibility}>{showRePassword ? "visibility_lock" : "visibility"}</span>
                    }
                  </div>
                  <span id='pMatched' style={{fontSize:'0.8rem'}} hidden></span>
                </Form.Group>
                </Row>
                <Row className='mb-2'>
                  <Link style={{textAlign:'right', fontSize:'1.2rem', color:'#daa520', textDecorationLine:'none'}} to={'/login'}>Login Now</Link>
                </Row>
                {
                  <Button variant={cons ? "success":"danger"} className='mb-4' type="submit">
                    Submit
                  </Button>
                }
              </Form>
              
          </Card.Body>
        </Card>
        
      </div>
    </>
  )
}

export default ForgetPass

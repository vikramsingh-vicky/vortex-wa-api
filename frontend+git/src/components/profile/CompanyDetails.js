import React, {useState} from 'react'
import { useNavigate } from'react-router-dom';
import { Button, Container, Row, Form  } from "react-bootstrap";
import Swal from "sweetalert2";
import '../dashboard/style.css';

import TopNav from '../dashboard/components/topNav';
import SideNav from '../dashboard/components/sideNav';

import apiService from '../../apiService';

function CompanyDetails() {
    const api_url = process.env.REACT_APP_API_URL;
    const [isSideNavOpen, setIsSideNavOpen] = useState(true);
    const [isTopNavFrozen, setIsTopNavFrozen] = useState(false);
    const [companyData, setCompanyData] = useState({
        uuid:localStorage.getItem("uuid"),
        cName: "",
        cLocation:"",
        cContact: "",
        cEmail: "",
        cWeb: "",
    });
    
    const navigate = useNavigate();

    const toggleSideNav = () => {
      setIsSideNavOpen(!isSideNavOpen);
      setIsTopNavFrozen(true)
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompanyData({
          ...companyData,
          [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        console.log(companyData);
        e.preventDefault();
        try {
            apiService.post(`${api_url}/company/createCompany`, companyData)
            .then(res => {
                if(res.data.message === "Company Data Stored Successfully"){
                    Swal.fire({
                        title: 'Success',
                        text: 'Company Details Updated Successfully',
                        icon:'success',
                        confirmButtonText: 'Okay'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            setCompanyData({
                                cName: "",
                                cLocation:"",
                                cContact: "",
                                cEmail: "",
                                cWeb: "",
                            })
                            navigate("/profile");
                        }
                    })
                    document.getElementById("swal2-checkbox").style.display = "none";
                }else{
                    Swal.fire({
                        title: res.data.message,
                        text: res.data.error,
                        icon: 'error',
                        confirmButtonText: 'Okay'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            setCompanyData({
                                cName: "",
                                cLocation:"",
                                cContact: "",
                                cEmail: "",
                                cWeb: "",
                            })
                            navigate("/profile");
                        }
                    })
                    document.getElementById("swal2-checkbox").style.display = "none";
                }
            })            
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Error Updating Company Details',
                icon: 'error',
                confirmButtonText: 'Okay'
            })
        }
    }
    
    return(
    <>
        <TopNav toggleSideNav={toggleSideNav} isSideNavOpen={isSideNavOpen} isTopNavFrozen={isTopNavFrozen} />
        <div className='content' style={{backgroundColor:'black !important'}} >
            <SideNav isOpen={isSideNavOpen} isTopNavFrozen={isTopNavFrozen} />
            <div className="main-content" style={{backgroundColor:'#fff',overflowY: 'auto', maxHeight: 'calc(100vh - 60px)'}}>
                <Container style={{alignItems:'center', justifyContent:'center', alignContent:'center'}}>                    
                    <Form style={{marginLeft:'25%', width:'50%'}} onSubmit={handleSubmit}>
                        <Row>
                            <Form.Group controlId="cName">
                                <Form.Label className="mb-3 lable">Company Name</Form.Label>
                                <Form.Control className="shadow input-company" type="text" name='cName' onChange={handleChange} placeholder="Enter Company Name" />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group controlId="cLocation">
                                <Form.Label className="mb-3 lable">Company Location</Form.Label>
                                <Form.Control className="shadow input-company" name='cLocation' onChange={handleChange} as="textarea" rows={3} />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group controlId="cCNumber">
                                <Form.Label className="mb-3 lable">Company Contact Number</Form.Label>
                                <Form.Control className="shadow input-company" name='cContact' onChange={handleChange} type="text" placeholder="Enter Company Contact Number" />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group controlId="cEmail">
                                <Form.Label className="mb-3 lable">Company Email ID</Form.Label>
                                <Form.Control className="shadow input-company" name='cEmail' onChange={handleChange} type="Email" placeholder="abc@xyz.com" />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group controlId="cCNumber">
                                <Form.Label className="mb-3 lable">Company Website</Form.Label>
                                <Form.Control className="shadow input-company" name='cWeb' onChange={handleChange} type="text" placeholder="https://www.example.com" />
                            </Form.Group>
                        </Row>
                        {
                            <Button variant={companyData.cName && companyData.cEmail ? "success" : "danger" } className="mb-4 shadow" type="submit" style={{marginTop:'5%'}} >
                                Submit
                            </Button>
                        }
                    </Form>
                    
                </Container>
            </div>
        </div>
    </>
    )
}

export default CompanyDetails;
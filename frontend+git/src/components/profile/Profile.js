import React, {useEffect, useState} from 'react'
import { useNavigate } from'react-router-dom';
import { Button, Card, Col, Container, Row, Table  } from "react-bootstrap";
import Swal from "sweetalert2";
import '../dashboard/style.css'
import TopNav from '../dashboard/components/topNav';
import SideNav from '../dashboard/components/sideNav';
import apiService from '../../apiService';



function Profile() {
    const apiurl = process.env.REACT_APP_API_URL;
    const [isSideNavOpen, setIsSideNavOpen] = useState(true);
    const [isTopNavFrozen, setIsTopNavFrozen] = useState(false);
    const [companyData, setCompanyData] = useState();
    const navigate = useNavigate();

    const toggleSideNav = () => {
      setIsSideNavOpen(!isSideNavOpen);
      setIsTopNavFrozen(true)
    };

    const handleUCompany = async () =>{
        navigate("./company");
    }
    
    useEffect(() => {
        const loggedIn = localStorage.getItem("loggedIn");
        const uuid = localStorage.getItem("uuid");
        if (loggedIn === "false" || loggedIn === null || !loggedIn) {
            Swal.fire({
              title: "Login Required",
              text: "You need to get logged in first! Please login to continue",
              icon: "error",
              confirmButtonText: "OK",
            }).then((result) => {
              if (result.isConfirmed) {
                navigate("/login");
              }
            });
            document.getElementById("swal2-checkbox").style.display = "none";
        }else{
            try {
                apiService.post(`${apiurl}/company/fetchCompany`, {uuid: uuid})
                .then((respo) => {
                    if(respo.data.message === "Company Found"){
                        setCompanyData(respo.data.result);
                        document.getElementById('cName').innerText = respo.data.result[0].company_name
                        document.getElementById('cLocation').innerText = respo.data.result[0].address
                        document.getElementById('cContact').innerText = respo.data.result[0].contact_number
                        document.getElementById('cEmail').innerText = respo.data.result[0].company_email
                        document.getElementById('cWeb').innerHTML = `<a href = ${respo.data.result[0].company_website} target="_blank">${respo.data.result[0].company_website}</a>`
                    }else{
                        setCompanyData(null);
                    }
                })
            } catch (error) {
                
            }
        }
    }, [apiurl, navigate])
  return (
    <>
        <TopNav toggleSideNav={toggleSideNav} isSideNavOpen={isSideNavOpen} isTopNavFrozen={isTopNavFrozen} />
        <div className='content'>
            <SideNav isOpen={isSideNavOpen} isTopNavFrozen={isTopNavFrozen} />
            <div className="main-content" style={{backgroundColor:'#fff',overflowY: 'auto', maxHeight: 'calc(100vh - 60px)'}}>
                <Container style={{alignItems:'center', justifyContent:'center', alignContent:'center'}}>
                    <Row>
                        <Col>
                            <Card style={{marginTop:'10px', marginBottom:'10px', width:'30rem', border:'none'}}>
                                <Card.Title style={{color:'goldenrod'}}>Personal Details</Card.Title>                    
                                <Table responsive size='sm'>
                                    <tbody>
                                        <tr>
                                            <td><b>Name</b></td>
                                            <td>{localStorage.getItem("user")}</td>
                                        </tr>
                                        <tr>
                                            <td><b>User Name</b></td>
                                            <td>{localStorage.getItem("uName")}</td>
                                        </tr>
                                        <tr>
                                            <td><b>Mobile</b></td>
                                            <td>{localStorage.getItem("mobile")}</td>
                                        </tr>
                                        <tr>
                                            <td><b>Email</b></td>
                                            <td>{localStorage.getItem("email")}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card>
                        </Col>
                        <Col>
                            <Card style={{marginTop:'10px', marginBottom:'10px', width:'30rem', border:'none'}}>
                                <Card.Title style={{color:'goldenrod'}}>Organization Details</Card.Title>                    
                                <Table responsive size='sm'>
                                    <tbody>
                                        <tr>
                                            <td><b>Company Name</b></td>
                                            <td id='cName'></td>
                                        </tr>
                                        <tr>
                                            <td><b>Company Location</b></td>
                                            <td id='cLocation'></td>
                                        </tr>
                                        <tr>
                                            <td><b>Contact Number</b></td>
                                            <td id='cContact'></td>
                                        </tr>
                                        <tr>
                                            <td><b>Company Email</b></td>
                                            <td id='cEmail'></td>
                                        </tr>
                                        <tr>
                                            <td><b>Company Website</b></td>
                                            <td id='cWeb'></td>
                                        </tr>
                                    </tbody>
                                </Table>
                                {!companyData && (
                                    <Button style={{marginTop:'10px'}} onClick={() => handleUCompany(apiurl)}>Update Company Details</Button>
                                )}
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    </>
  )
}

export default Profile

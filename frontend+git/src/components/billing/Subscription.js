/* global Razorpay */
import React, {useEffect, useState} from 'react'
import { useLocation, useNavigate } from'react-router-dom';
import { Button, Container, Row, Form  } from "react-bootstrap";
import '../dashboard/style.css';

import TopNav from '../dashboard/components/topNav';
import SideNav from '../dashboard/components/sideNav';
import Swal from "sweetalert2";
import logo from '../../media/vortex_final_logo.png'
import apiService from '../../apiService';

function Subscription() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [isSideNavOpen, setIsSideNavOpen] = useState(true);
    const [options, setOptions] = useState([]);
    const [insID, setInsID] = useState(null);
    // const [selectedValue, setSelectedValue] = useState('');
    const location = useLocation();
    
    const [isChecked, setIsChecked] = useState(true);

    const handleSwitchChange = () => {
        setIsChecked(!isChecked);
    };

    const navigate = useNavigate();

    const toggleSideNav = () => {
      setIsSideNavOpen(!isSideNavOpen);
    };

    const handleChange = (e) => {
        setInsID(e.target.value);
        
    };

    const paymentHandler = async (e) => {
        // const conRate = await axios.get(`${props.exchapi}/${document.getElementById("tAmount").value}`);
        // console.log(conRate.data.conversion_result);
        const amountDoller = document.getElementById("tAmount").value;
        var amountINR = amountDoller * 100;
        console.log(amountINR);
        const currency = "INR";
        const durationText = document.getElementById("bTypeText").textContent;
        var duration = 0;
        if(durationText === "Monthly"){
            duration = 30;
        }else if(durationText === "Annually"){
            duration = 365;
        }
        const receiptID = Math.floor(Math.random() * 1000000000).toString();
        const response = await fetch(`${apiUrl}/payment/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                insid: insID,
                amount: amountINR,
                currency: currency,
                receipt: receiptID,
                validity: duration,
               
            })
        });
        const data = await response.json();
        console.log(data.result.id);

        var option = {
            key: process.env.REACT_APP_RZP_KEY,
            amount: amountINR,
            currency: currency,
            name: 'Vortex WhatsApp API',
            description: 'Vortex WhatsApp API',
            image: logo,
            order_Id: data.id,
            handler: async function (response) {
                const body = {...response,razorpay_order_id: data.result.id, insid: insID, validity: duration}
                const validateResponse = await fetch(`${apiUrl}/payment/validate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body)
                });

                const validateData = await validateResponse.json();
                if(validateData.message === "Payment verified"){
                    Swal.fire({
                        title: validateData.message,
                        text: "Payment Successful",
                        icon: "success",
                        confirmButtonText: "OK",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate("/dashboard");
                        }
                    });
                    document.getElementById("swal2-checkbox").style.display = "none";
                }else{
                    Swal.fire({
                        title: validateData.message,
                        text: "Payment Failed",
                        icon: "error",
                        confirmButtonText: "OK",
                    })
                    document.getElementById("swal2-checkbox").style.display = "none";
                }
            },
            prefill: {
                name: localStorage.getItem("user"),
                email: localStorage.getItem("email"),
                contact: localStorage.getItem("mobile"),
            },
            notes: {
                address: 'Vortex WhatsApp API',
            },
            theme: {
                color: '#000',
            },
        }
        var rzp1 = new Razorpay(option);
        rzp1.on('payment.success', function (response) {
            console.log(response);
        })
        rzp1.on('payment.failed', function (response) {
            alert('Payment Failed');
        })
        rzp1.open();
        e.preventDefault();
    }

    useEffect(() =>{
        const uuid = localStorage.getItem("uuid")
        // socket.emit("fetchInstance", { uuid });
        const fetchOptions = async () => {
            try {
                apiService.post(`${apiUrl}/waRoutes/fetchInstance`, {uuid: uuid})
                .then((data) => {
                    if (data.data.message === "Instance Found") {
                        const fetchedOptions = data.data.result.map(instance => ({
                            value: instance.insid,
                            label: instance.instanceName,
                        }));
                        setOptions(fetchedOptions);
                    }
                })
            } catch (error) {
              console.error('Error fetching options:', error);
            }
          };
      
          fetchOptions();

            const url = location.href || window.location.href;
            const urlParams = new URLSearchParams(new URL(url).search);
            setInsID(urlParams.get('insid'));

    },[location, apiUrl])

    return(
    <>
        <TopNav toggleSideNav={toggleSideNav} isSideNavOpen={isSideNavOpen} />
        <div className='content' style={{backgroundColor:'black !important'}} >
            <SideNav isOpen={isSideNavOpen} />
            <div className="main-content" style={{backgroundColor:'#fff',overflowY: 'auto', maxHeight: 'calc(100vh - 60px)'}}>
                <Container style={{alignItems:'center', justifyContent:'center', alignContent:'center',textAlign:'center'}}> 
                    <h2>Activate Your Token</h2>                   
                    <Form style={{marginLeft:'25%', width:'50%'}}>
                        <Row>
                            <Form.Group controlId="iName">
                                <Form.Label className="mb-3 lable">Instance Name</Form.Label>
                                <Form.Select className="shadow input-company" type="text" name='iName' value={!insID ? '' : insID} onChange={handleChange}>
                                    <option value="Instance Not Selected" disabled>Select Instance</option>
                                    {options.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Row>
                        <Row style={{alignContent:'center',justifyContent:'center',alignItems:'center',justifyItems:'center',display:'flex',flexDirection:'column',}}>
                            <Form.Group controlId="bTypes">
                                <Form.Label className="mb-3 lable">Billed</Form.Label>
                            </Form.Group>
                            <div className="d-flex align-items-center">
                                <span id='bTypeText' style={{color: 'green', fontSize:'1.2rem', marginLeft:'30%' }}>{!isChecked ? "Monthly" : "Annually"}</span>
                                <Form.Check type="switch" id="bType"
                                    className="mx-3 input-company"
                                    checked={isChecked}
                                    onChange={handleSwitchChange}
                                    style={{alignSelf:'center', alignContent:'center', fontSize:'2rem'}}
                                />
                            </div>
                        </Row>
                        <Row>
                            <h6 style={{color:'green',fontSize:'1.2rem',marginLeft:'0%'}}>@ {!isChecked ? '2500/Month' : '2100/Month'} </h6>
                        </Row>
                        <Row>
                            <Form.Group controlId="tAmount">
                                <Form.Label className="mb-3 lable">Amount to be paid</Form.Label>
                                <Form.Control className="shadow input-company" name='tAmount' value={!isChecked ? 2500 : 2100*12} type="text" readOnly />
                            </Form.Group>
                        </Row>
                        {
                            <Button variant="success" className="mb-4 shadow" style={{marginTop:'5%'}} onClick={paymentHandler} >
                                Pay Now
                            </Button>
                        }   
                    </Form>
                    
                </Container>
            </div>
        </div>
    </>
    )
}

export default Subscription;
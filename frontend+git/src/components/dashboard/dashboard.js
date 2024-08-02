import React, {useState, useEffect} from 'react'
import { useNavigate } from'react-router-dom';
// import TopNav from '../dashboard/components/TopNav1';
import TopNav from '../dashboard/components/topNav';
import SideNav from '../dashboard/components/sideNav';
import QRWA from '../whatsapp/qrcode';
// import Profile from '../profile/Profile';
import './style.css'
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import socket from '../../socketManager';
import Instruction from './components/Instruction_qr'
import apiService from '../../apiService';

function Dashboard() {
  // const api_url = props.apiurl;
  const navigate = useNavigate();
  // const [instanceData, setInstanceData] = useState();
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    const insID = localStorage.getItem("insID");
    const uuid = localStorage.getItem("uuid");
    // console.log(insID)
    // console.log(loggedIn);
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
    }
    else{
      const data = {
        uuid: uuid,
        insID: insID,
      }
      try {
        apiService.post('/waRoutes/fetchInstance', data)
       .then((respo) => {
        if(respo.data.message === "Instance Found"){
          // setInstanceData(respo.data.result);
          // console.log(respo.data.result)
            // Swal.fire({
            //   title: respo.data.message,
            //   text: "You can now proceed with Vortex WhatsApp API.",
            //   icon: "success",
            //   confirmButtonText: "OK",
            // })
            // document.getElementById("swal2-checkbox").style.display = "none";
          }else if(respo.data.message === "Instance Created"){
            Swal.fire({
              title: respo.data.message,
              text: "Instance created successfully. You can now start using Vortex WhatsApp API.",
              icon: "success",
              confirmButtonText: "OK",
            }).then((result) => {
              if (result.isConfirmed) {
                socket.emit('fetchInstace', {uuid,insID});
              }
            })
          }else{
            Swal.fire({
              title: respo.data.message,
              text: "Please contact your administrator to get access to Vortex WhatsApp API.",
              icon: "error",
              confirmButtonText: "OK",
            }).then((result) => {
              if (result.isConfirmed) {
                navigate(`/createTicket?type=Fetch%20Instance&uuid=${localStorage.getItem("uuid")}`);
              }
            })
            document.getElementById("swal2-checkbox").style.display = "none";
          }
       })
        
      } catch (error) {
        
      }
    }
  }, [navigate]);

    const [isSideNavOpen, setIsSideNavOpen] = useState(true);
    const [isTopNavFrozen, setIsTopNavFrozen] = useState(false);

    const toggleSideNav = () => {
      setIsSideNavOpen(!isSideNavOpen);
    };

    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      if (scrollPosition > 0) {
        setIsTopNavFrozen(true);
      } else {
        setIsTopNavFrozen(false);
      }
    };
    useEffect(() => {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);

    const createInstance =async () => {
      Swal.fire({
        title: "Enter Instance Name",
        input: "text",
        inputAttributes: {
          autocapitalize: "off",
          autocomplete: "off",
          autocorrect: "off",
          spellcheck: "true",
          type: "text",
          placeholder: "Enter Instance Name",
          required: true,
          style: {          
            color: "#495057 !important",
            backgroundColor: "#fff !important",
            transition: "border-color.15s ease-in-out,box-shadow.15s ease-in-out",
            fontSize: "1rem",
            lineHeight: "1.5",
            borderRadius: ".25rem",
          },
        },
        text: "Enter Instance Name",
        icon: "question",
        confirmButtonText: "Create Now",
        confirmButtonColor: "#157347",
      }).then((result) => {
        if (result.isConfirmed) {
          try {
            const insid = uuidv4();
            const data = {
              uuid : localStorage.getItem("uuid"),
              insID: insid,
              name: result.value,
            }
            apiService.post('/waRoutes/createInstance', data)
          .then((respo) => {
              if(respo.data.message === "Instance Created"){
                // setInstanceData(respo.data.result);
                Swal.fire({
                  title: respo.data.message,
                  text: "You can now proceed with Vortex WhatsApp API.",
                  icon: "success",
                  confirmButtonText: "OK",
                  allowOutsideClick: false,
                }).then((result) => {
                  if (result.isConfirmed) {
                    socket.emit('fetchInstance', {uuid: localStorage.getItem("uuid")})
                  }
                });
                document.getElementById("swal2-checkbox").style.display = "none";
              }else if(respo.data.message === "Instance Limit Reached"){
                Swal.fire({
                  title: respo.data.message,
                  text: "You have reached the limit of instances you can create. Please raise a ticket to get access to additional instances of Vortex WhatsApp API.",
                  icon: "warning",
                  confirmButtonText: "Proceed With Ticket",
                  confirmButtonColor: "#157347",
                  cancelButtonText: "Cancel",
                  cancelButtonColor: "#d33",
                  showCancelButton: true,
                  allowOutsideClick: false,
                }).then((result) => {
                  if (result.isConfirmed) {
                    navigate(`/createTicket?type=Create%20New%20Instance&uuid=${localStorage.getItem("uuid")}`);
                  }
                });
                document.getElementById("swal2-checkbox").style.display = "none";
              }else{
                Swal.fire({
                  title: respo.data.message,
                  text: "Please raise a ticket to get this issue resolved.",
                  icon: "error",
                  confirmButtonText: "OK",
                  allowOutsideClick: false,
                }).then((result) => {
                  if (result.isConfirmed) {
                    navigate(`/tickets?type=create-instance&uuid=${localStorage.getItem("uuid")}`);
                  }
                });
                document.getElementById("swal2-checkbox").style.display = "none";
              }
            })
          } catch (error) {
            
          }
        }
      })
      document.getElementById("swal2-checkbox").style.display = "none";
    }

    // const mainContentClassText = (isSideNavOpen && isTopNavFrozen)? "main-content-frozen-open" : (isSideNavOpen &&!isTopNavFrozen)? "main-content" : (!isSideNavOpen && isTopNavFrozen)? "main-content-frozen-close" : "main-content";
  
    return (
      <>
        {/* <TopNav toggleSideNav={toggleSideNav} isSideNavOpen={isSideNavOpen} /> */}
        <TopNav toggleSideNav={toggleSideNav} isSideNavOpen={isSideNavOpen} isTopNavFrozen={isTopNavFrozen} />
        <div className='content'>
          <SideNav isOpen={isSideNavOpen} isTopNavFrozen={isTopNavFrozen} />
          <div className="main-content" style={{backgroundColor:'#fff',overflowY: 'auto', maxHeight: 'calc(100vh - 60px)'}}>
            <div id='dash'>
              <QRWA />            
              <Button className='btn-success' onClick={createInstance}>Create New Instance</Button>
              <hr />
              <Instruction />
            </div>
            {/* <div id='profile' hidden={true}>
              <Profile />
            </div> */}
            {/* <div id='ticket'>
              <Ticket />
            </div> */}
          </div>
        </div>
      </>
    );
  }

export default Dashboard


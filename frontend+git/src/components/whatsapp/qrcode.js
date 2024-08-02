import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import { Button, Table } from "react-bootstrap";
import socket from '../../socketManager';
import {format} from 'date-fns';
import Swal from "sweetalert2";

function Wa() {
  
  const [insSessions, setInsSessions] = useState({});
  const [authenticatedSessions, setAuthenticatedSessions] = useState([]);
  const [instances, setInstances] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
      .then(() => {
        Swal.fire({
           title: "Copied to Clipboard",
           text: "Your API Key has been copied to clipboard",
           icon: "success",
           confirmButtonText: "OK",
           confirmButtonColor: "#157347",
         });
         document.getElementById("swal2-checkbox").style.display = "none";
      })
      .catch((err) => console.error("Error copying to clipboard:", err));
  }

  function showAPIKey(key) {
    Swal.fire({
      title: "API Key",
      text: "Your API Key is: " + key,
      icon: "success",
      confirmButtonText: "Copy API Key",
      confirmButtonColor: "#157347",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        copyToClipboard(key);
      }
    });
    document.getElementById("swal2-checkbox").style.display = "none";
  }

  function logout(id){
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of this session. \n\nTo log back in, you will need to scan the QR code again.",
      icon: "warning",
      confirmButtonText: "Yes, Logout",
      showCancelButton: true,
      cancelButtonText: "No, Cancel",
      cancelButtonColor: "#d33",
      confirmButtonColor: "#157347",
      allowOutsideClick: true,
    }).then((result) => {
      if (result.isConfirmed) {
        socket.emit("logout", id)
      }
    })  
    document.getElementById("swal2-checkbox").style.display = "none";
  }
  
  function removeInstance(inID){
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure to remove this instance from our database. \n\nThis action cannot be undone.",
      icon: "warning",
      confirmButtonText: "Yes, Please Remove",
      confirmButtonColor: "#d33",
      showCancelButton: true,
      cancelButtonText: "No, Cancel",
      cancelButtonColor: "#157347",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        socket.emit("removeInstance", inID);
      }
    })
    document.getElementById("swal2-checkbox").style.display = "none";
  }
  const sendTestMsg = (key) => {
    Swal.fire({
      title: "Enter Mobile Number",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
        autocomplete: "off",
        autocorrect: "off",
        spellcheck: "false",
        type: "number",
        maxlength: 12,
        minlength: 12,
        placeholder: "Enter Mobile Number with country code without + sign",
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
      text: "Enter Mobile Number with country code without + sign",
      icon: "question",
      confirmButtonText: "Send Now",
      confirmButtonColor: "#157347",
    }).then((result) => {
      if (result.isConfirmed) {
        socket.emit("sendTestMessage", {
          key: key,
          message: {
            body: "Thank you for choosing Vortex WhatsApp API. \n\nThis is a test message. \n\nYou can now proceed with Vortex WhatsApp API.",
            to: result.value,
            type: "chat",
          },
        });
      }
    })
    document.getElementById("swal2-checkbox").style.display = "none";
  };

  const createSessionForWhatsapp = (inID) => {
    // console.log(inID);
    socket.emit("createSession", {
      id: inID,
    });
    document.getElementById(inID).textContent= "Loading...";
    document.getElementById(inID).setAttribute("disabled", true);
    document.getElementById(inID).setAttribute("variant", "info");
  };

  const NavigateToBilling = (inID) => {
    navigate("/dashboard/subscriptions?insid="+inID);
  };
  useEffect(() => {
    const uuid = localStorage.getItem("uuid");
    // console.log(uuid);

    // Function to handle instance fetched event
    const handleInstanceFetched = (respo) => {
      if (respo.message === "Instance Found") {
        // console.log(respo.result);
        Swal.fire({
          title: respo.message,
          text: "You can now proceed with Vortex WhatsApp API.",
          icon: "success",
          confirmButtonText: "OK",
        });
        document.getElementById("swal2-checkbox").style.display = "none";
        setInstances(respo.result);
        setIsLoading(false);
        
      }
    };

    // Function to handle QR event
    const handleQR = (data) => {
      const { qr, id } = data;
      // console.log(id, qr);
      setInsSessions((prevSessions) => ({
        ...prevSessions,
        [id]: qr,
      }));
      // document.getElementById(data.id).setAttribute("hidden",true)
    };

    // Function to handle ready event
    const handleReady = (data) => {
      const { id } = data;
      // console.log("Session Ready", id);
      setAuthenticatedSessions((prevSessions) => [...prevSessions, id]);
      socket.emit("fetchInstance", { uuid });
      // document.getElementById(data.id).setAttribute("hidden",true)
    };

    const handleTestMessageSent = (data) => {
      // if(data.message === "Test Message Sent"){
      Swal.fire({
        title: data.title,
        text: data.message,
        icon: (data.title === "Message Sent Successfully")? "success" : "error",
        confirmButtonText: "OK",
      });
      document.getElementById("swal2-checkbox").style.display = "none";
    };

    const handleInstanceRemoved = (data) => {
      Swal.fire({
        title: data.title,
        text: data.message,
        icon: "success",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          socket.emit("fetchInstance", {uuid});
        }
      })
      document.getElementById("swal2-checkbox").style.display = "none";
    };

    // Emit fetchInstance event
    socket.emit("fetchInstance", { uuid });

    // Event listeners
    socket.on("instanceFetched", handleInstanceFetched);
    socket.on("qr", handleQR);
    socket.on("ready", handleReady);
    socket.on("testMessageSent", handleTestMessageSent);
    socket.on("instanceRemoved", handleInstanceRemoved);
    socket.on("sessionRemoved", (data) => {
      Swal.fire({
        title: data.title,
        text: data.message,
        icon: "info",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
      document.getElementById("swal2-checkbox").style.display = "none";
    });

    
  }, []);

  return (
    <>
      <Table responsive striped bordered hover style={{verticalAlign:"middle",textAlign:"center"}}>
        <thead>
          <tr>
            <th>#</th>
            <th>Instance ID</th>
            <th>Instance Name</th>
            <th>Authentication Status</th>
            <th>Instance Status</th>
            <th>API Key</th>            
            <th>Session Action</th>
            <th>Billing Valid Till</th>
            <th>Send Test Message</th>
            <th>Delete Instance</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="7">Loading instances...</td>
            </tr>
          ) : (
            instances.map((ins, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{ins.insid}</td>
                <td>{ins.instanceName}</td>
                <td>
                  {ins.authenticated === 0 ? "Not Connected" : "Connected"}
                </td>
                <td>
                  {
                    ins.trial === 1 ? 
                      "Trial" : 
                        (ins.trial === 0 && ins.status === "Trial Expired") ? 
                          "Trial Expired" : 
                            (ins.trial === 0 && ins.status === "Expired") ? 
                              "Billing Expired" : 
                                ins.status === '' ? 
                                  '' :
                                    ins.status !== '' ?
                                      ins.status : 
                                        "Active"
                  }
                </td>
                <td>
                  {(ins.api_key && ins.authenticated === 1) && (
                    <Button variant="outline-primary" size="sm" onClick={() => showAPIKey(ins.api_key)}>
                      Show API Key
                    </Button>
                  )}
                </td>
                <td>
                  {(insSessions[ins.insid] && !authenticatedSessions.includes(ins.insid) && !ins.status.includes("Expired")) ? (
                      <QRCode value={insSessions[ins.insid]} size={'150px'} />
                    ) : (
                      (!authenticatedSessions.includes(ins.insid) && !ins.status.includes("Expired")) ? (
                        <Button variant="outline-success" id={ins.insid} size="sm" onClick={() => createSessionForWhatsapp(ins.insid, index)}>
                          Fetch Session
                        </Button>
                      ) : (ins.status.includes("Expired")) ? (
                          <Button variant="outline-danger" id={ins.insid} size="sm" onClick={() => NavigateToBilling(ins.insid)}>
                            Activate Now
                          </Button>
                      ) : ''
                    )
                  }
                  {authenticatedSessions.includes(ins.insid) && (
                    <Button variant="danger" size="sm" onClick={() => logout(ins.insid)}>
                      Logout?
                    </Button>
                  )}
                </td>
                <td>
                  {ins.validTill && (
                    format(ins.validTill, "dd-MMM-yyyy")
                    )}
                </td>
                <td>
                  {((authenticatedSessions.includes(ins.insid) || ins.authenticated === 1) && !ins.status.includes("Expired")) && (
                    <Button variant="success" size="sm" onClick={() => sendTestMsg(ins.api_key)}>Send Test Message</Button>
                    )}
                </td>
                <td>
                  {(!authenticatedSessions.includes(ins.insid) && ins.authenticated === 0 && ins.status === "") && (
                    // <Button variant="danger" size="sm" style={{verticalAlign:'middle'}} onClick={() => removeInstance(ins.insid)}>
                    <span className="material-symbols-outlined" style={{color:'red', cursor: 'pointer'}} onClick={() => removeInstance(ins.insid)}>
                      delete
                    </span> 
                    // </Button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </>
  );
}

export default Wa;

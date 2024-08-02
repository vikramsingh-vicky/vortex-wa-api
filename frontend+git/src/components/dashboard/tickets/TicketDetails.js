import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import apiService from '../../../apiService';
import TopNav from '../components/topNav';
import SideNav from '../components/sideNav';
import './ChatStyles.css';

function TicketDetails() {
    const [isSideNavOpen, setIsSideNavOpen] = useState(true);
    const location = useLocation();
    const url = location.href || window.location.href;
    const urlParams = new URLSearchParams(new URL(url).search);
    const ticketID = urlParams.get('id');
    const apiUrl = process.env.REACT_APP_API_URL;

    const [ticket, setTicket] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [reply, setReply] = useState('');

    const uuid = localStorage.getItem('uuid');
    
    const toggleSideNav = () => {
        setIsSideNavOpen(!isSideNavOpen);
    };

    const fetchTicketDetails = async () => {
        try {
            const response = await apiService.get(`${apiUrl}/ticket?ticketID=${ticketID}`);
            setTicket(response.data.ticket[0]);
            setConversations(response.data.conversations);
        } catch (error) {
            console.error('Error fetching ticket details:', error);
        }
    };

    const handleReplySubmit = async () => {
        try {
            if(reply !== ''){
                await apiService.post(`${apiUrl}/ticket/reply?ticketID=${ticketID}`, { reply, uuid });
                setReply('');
                fetchTicketDetails(); // Refresh the conversation
            }
        } catch (error) {
            console.error('Error submitting reply:', error);
        }
    };

    const handleCloseTicket = async () => {
        try {
            await apiService.post(`${apiUrl}/ticket/close?ticketID=${ticketID}`);
            fetchTicketDetails(); // Refresh the ticket details
        } catch (error) {
            console.error('Error closing ticket:', error);
        }
    };

    useEffect(() => {
        fetchTicketDetails();
    }, [ticketID]);

    return (
        <>
            <TopNav toggleSideNav={toggleSideNav} isSideNavOpen={isSideNavOpen} />
            <div className='content'>
                <SideNav isOpen={isSideNavOpen} />
                <div className="main-content">
                    {ticket ? (
                        <>
                            <div className='row'>
                                <div className='col-4 chat-box'>
                                    <div className="header">
                                        <div className="ticket-id"></div>
                                        <div className="subject">
                                            Ticket Details
                                        </div>                                        
                                    </div>
                                    <div style={{justifyContent:'center'}}>
                                        <b style={{fontSize:'25px'}}>Issue Detail:</b>
                                        <p style={{fontSize:'20px', wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{ticket.issue}</p>
                                    </div>
                                    <div>
                                        <b style={{fontSize:'25px'}}>Issue Raised On:</b>
                                        <p style={{fontSize:'20px', wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{new Date(ticket.ticketDate).toLocaleString()}</p>
                                    </div>
                                    <div className="status-container">
                                        <Button variant='success' className="status" disabled>{ticket.status}</Button>
                                        {ticket.status === 'Open' ? 
                                            <Button variant="danger" onClick={handleCloseTicket}>Close Ticket</Button>
                                        : ''}
                                    </div>
                                </div>
                                <div className='col-8 chat-box'>
                                    <div className="header">
                                        <div className="ticket-id">Ticket ID: {ticketID}</div>
                                        <div className="subject">{ticket.issueType}</div>
                                    </div>
                                    <div className="chat-container">
                                        {conversations.map((conv, index) => (
                                            <div key={index} className={`message ${conv.role === 'admin' ? 'admin' : 'user'}`}>
                                                <div className={`message-bubble ${conv.role === 'admin' ? 'admin' : 'user'}`}>
                                                    {conv.message}
                                                    <div className="timestamp">{new Date(conv.timestamp).toLocaleString()}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {ticket.status !== 'Closed' && (
                                        <div className="reply-section">
                                            <Form.Group controlId="reply" style={{backgroundColor:'aliceblue'}}>
                                                <Form.Control as="textarea" className="shadow" rows={3} value={reply} onChange={(e) => setReply(e.target.value)} required />
                                            </Form.Group>
                                            <Button className="reply-button" onClick={handleReplySubmit}>Submit Reply</Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <p>Loading ticket details...</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default TicketDetails;

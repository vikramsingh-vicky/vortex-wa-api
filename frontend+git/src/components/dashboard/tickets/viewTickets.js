import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import TopNav from '../components/topNav';
import SideNav from '../components/sideNav';
import { Button, Table, Pagination, Form, Row, Col } from 'react-bootstrap';
import apiService from '../../../apiService';
import { format } from 'date-fns';

function ViewTickets() {
    const apiUrl = process.env.REACT_APP_API_URL;

    const [isSideNavOpen, setIsSideNavOpen] = useState(true);
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const navigate = useNavigate(); // Use useNavigate instead of useHistory
    const uuid = localStorage.getItem('uuid');

    const toggleSideNav = () => {
        setIsSideNavOpen(!isSideNavOpen);
    };

    const fetchTickets = async () => {
        try {
            await apiService.post(`${apiUrl}/createTicket/view`, { uuid })
                .then((data) => {
                    if (data.data.message === "Ticket Found") {
                        setTickets(data.data.result);
                        setIsLoading(false);
                    }
                });
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleViewClick = (ticketID) => {
        navigate(`/ticket?id=${ticketID}`);
    };

    const indexOfLastTicket = currentPage * rowsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - rowsPerPage;
    const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
    const handleRowsPerPageChange = (e) => setRowsPerPage(Number(e.target.value));

    return (
        <>
            <TopNav toggleSideNav={toggleSideNav} isSideNavOpen={isSideNavOpen} />
            <div className='content' style={{ backgroundColor: 'black !important' }}>
                <SideNav isOpen={isSideNavOpen} />
                <div className="main-content" style={{ backgroundColor: '#fff', overflowY: 'auto', maxHeight: 'calc(100vh - 60px)' }}>
                    
                    <Table responsive striped bordered hover style={{ verticalAlign: "middle", textAlign: "center" }}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Ticket ID</th>
                                <th>Department</th>
                                <th>Subject</th>
                                <th>Ticket Status</th>
                                <th>Last Updated On</th>
                                <th>Ticket Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7">Loading Tickets...</td>
                                </tr>
                            ) : (currentTickets.map((ticks, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{ticks.ticketID}</td>
                                    <td>{ticks.issueType}</td>
                                    <td>{ticks.subject}</td>
                                    <td>{ticks.status}</td>
                                    <td>{format(new Date(ticks.ticketDate), "dd-MMM-yyyy")}</td>
                                    <td>
                                        <Button variant="outline-info" size="sm" style={{ marginBottom: '2px' }} onClick={() => handleViewClick(ticks.ticketID)}>
                                            View
                                        </Button>
                                    </td>
                                </tr>
                            )))}
                        </tbody>
                    </Table>                    
                    <Pagination>
                        {Array.from({ length: Math.ceil(tickets.length / rowsPerPage) }).map((_, index) => (
                            <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
                                {index + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </div>
            </div>
        </>
    );
}

export default ViewTickets;

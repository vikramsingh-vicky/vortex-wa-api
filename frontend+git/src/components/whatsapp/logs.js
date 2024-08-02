import React, { useEffect, useState } from 'react'
import socket from '../../socketManager';
import TopNav from '../dashboard/components/topNav';
import SideNav from '../dashboard/components/sideNav';
import { Row, Table } from 'react-bootstrap';
import Pagination from './pagination';
// import userEvent from '@testing-library/user-event';

function MessageLogs() {

  const [isSideNavOpen, setIsSideNavOpen] = useState(true);
  const [isTopNavFrozen, setIsTopNavFrozen] = useState(false);
  const [instances, setInstances] = useState([]);
  const [messages, setMessages] = useState([]);
  const [insID, setInsID] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [messagesPerPage] = useState(25);
  const [filters, setFilters] = useState({
    id: '',
    time: '',
    sentTo: '',
    message: '',
    sentStatus: '',
    readStatus: '',
  });
  
    const logFetched = (data) => {
      let d = [];
      data.result.forEach((r) => {
        if (r.lastMessage && r.lastMessage.fromMe === true && r.lastMessage.type === "chat") {
          d.push([
            r.lastMessage._data.rowId,
            r.lastMessage._data.t,
            r.lastMessage._data.to.user,
            r.lastMessage._data.body,
            r.lastMessage._data.ack,
            r.lastMessage._data.ack,
            r.isGroup
          ]);
        }
      });
      setMessages(d)
      setIsLoading(false)
      // console.log(d)
    }
    const handleInstances = (data) => {
      const res = data.result.filter(function(r){ return r.authenticated === 1})
      setInstances(res)
      // console.log(instances)
    }
    socket.on("messageLogFetched",logFetched)
    socket.on("instanceFetched",handleInstances)


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
    const handleChange = (e) => {
      setInsID(e.target.value);
      socket.emit("getMessageLog",{id: e.target.value});
      setIsLoading(true)
      
    };
    const getDeliveryStatus = (ack) => {
      switch (ack) {
          case -1:
              return 'Not Sent';
          case 0:
              return 'Sent';
          case 1:
              return 'Delivered to Server';
          case 2:
              return 'Delivered to Recipient';
          case 3:
              return 'Read by Recipient';
          default:
              return 'Unknown';
      }
    };

    const handleFilterChange = (key, value) => {
      setFilters({ ...filters, [key]: value });
    };

    const handleSort = (key) => {
      let direction = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
      }
      setSortConfig({ key, direction });
    };

    useEffect(() => {
      
      socket.emit("fetchInstance",{uuid: localStorage.getItem("uuid")})
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);

    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

    const sortedMessages = React.useMemo(() => {
      let sortableMessages = [...messages];
      if (sortConfig.key) {
        sortableMessages.sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }
      return sortableMessages;
    }, [messages, sortConfig]);

    const filteredMessages = sortedMessages.filter(msg => 
      (filters.id === '' || msg[0].toString().includes(filters.id)) &&
      (filters.time === '' || new Date(msg[1] * 1000).includes(filters.time)) &&
      (filters.sentTo === '' || msg[2].toString().includes(filters.sentTo)) &&
      (filters.message === '' || msg[3].toLowerCase().includes(filters.message)) &&
      (filters.sentStatus === '' || (msg[4] < 3 ? getDeliveryStatus(msg[4]) : 'Sent').toLowerCase().includes(filters.sentStatus)) &&
      (filters.readStatus === '' || (msg[4] === 3 ? 'Read' : 'Not Read').toLowerCase().includes(filters.readStatus))
    );
    
    const indexOfLastMessage = currentPage * messagesPerPage;
    const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
    const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);
    const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);
      

  return (
    <>
      <TopNav toggleSideNav={toggleSideNav} isSideNavOpen={isSideNavOpen} isTopNavFrozen={isTopNavFrozen} />
        <div className='content'>
          <SideNav isOpen={isSideNavOpen} isTopNavFrozen={isTopNavFrozen} />
          <div className="main-content" style={{backgroundColor:'#fff',overflowY: 'auto', maxHeight: 'calc(100vh - 60px)'}}>
            <Row>
              <select className="shadow input-company" aria-label="Default select example" style={{width:'50%', marginLeft:'25%', marginBottom:'10px'}} name='iName' value={insID} onChange={handleChange}>
                <option selected>Select Token Name To Get Logs</option>
                  {instances.map((option) => (
                      <option key={option.insid} value={option.insid}>
                          {option.instanceName + " - " + option.insid } 
                      </option>
                    )
                  )}
              </select>
            </Row>
            <Table responsive striped bordered hover style={{verticalAlign:"middle",textAlign:"center"}}>
              <thead>
                <tr>
                  <th><input className="shadow" type="text" placeholder="Filter ID" value={filters.id} onChange={(e) => handleFilterChange('id', e.target.value)} /></th>
                  <th></th>
                  <th></th>
                  <th><input className="shadow" type="text" placeholder="Filter Sent To" value={filters.sentTo} onChange={(e) => handleFilterChange('sentTo', e.target.value.toString())} /></th>
                  <th><input className="shadow" type="text" placeholder="Filter Message" value={filters.message} onChange={(e) => handleFilterChange('message', e.target.value.toLowerCase())} /></th>
                  <th><input className="shadow" type="text" placeholder="Filter Sent Status" value={filters.sentStatus} onChange={(e) => handleFilterChange('sentStatus', e.target.value.toLowerCase())} /></th>
                  <th><input className="shadow" type="text" placeholder="Filter Read Status" value={filters.readStatus} onChange={(e) => handleFilterChange('readStatus', e.target.value.toLowerCase())} /></th>
                </tr>
                <tr>
                  <th>ID</th>
                  <th>Chat Type</th>
                  <th onClick={() => handleSort(1)}>Time {sortConfig.key === 1 && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                  <th>Sent To</th>
                  <th>Message</th>
                  <th onClick={() => handleSort(4)}>Sent Status {sortConfig.key === 4 && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                  <th onClick={() => handleSort(5)}>View Status {sortConfig.key === 5 && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="7">Loading Messages...</td>
                  </tr>
                ) : (
                  currentMessages.map((msg, index) => (
                  <tr key={index}>
                    <td>{msg[0]}</td>
                    <td>{msg[6] === true ? "Group" : "One-O-One"}</td>
                    <td>{new Date(msg[1] * 1000).toLocaleString()}</td>
                    <td>{msg[2]}</td>
                    <td>{msg[3]}</td>
                    <td>{msg[4] < 3 ? getDeliveryStatus(msg[4]) : 'Sent'}</td>
                    <td>{msg[5] === 3 ? 'Read' : 'Not Read'}</td>
                  </tr>
                ))
              )}
              </tbody>
            </Table>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
    </>
  )
}

export default MessageLogs

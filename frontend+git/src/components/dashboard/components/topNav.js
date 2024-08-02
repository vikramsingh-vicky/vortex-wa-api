import React from 'react';
import { Navbar, NavDropdown} from 'react-bootstrap';
import Logo from '../../../media/vortex_final_logo.png';
import { Link, useNavigate } from 'react-router-dom';
import UserImg from '../../../media/user1.png';
import Swal from 'sweetalert2';


function TopNav({ toggleSideNav, isSideNavOpen, isTopNavFrozen }) {
  const navigate = useNavigate();
  // const sideNavStyle = isSideNavOpen ? {width:'calc(12% + 3px)', alignItems:'center'} : { width: 'calc(65px - 1%)',transition: 'margin-left 1.0s ease, width 1.0s ease', alignItems: 'center' };
  const topNavStyle = isSideNavOpen ? {width:'100%', color:'white !important',boxShadow: '0px 0px 8px 4px #4e4d4e', height:'60px', backgroundColor:'black'} : { width: '100%', height:'60px', color:'white !important',boxShadow: '0px 0px 8px 4px #4e4d4e', backgroundColor:'black'};
  const user = localStorage.getItem('user');
  const topNavFrozen = isTopNavFrozen ? {width:'100%', color:'white !important',boxShadow: '0px 0px 8px 4px #4e4d4e', height:'60px', backgroundColor:'black',position: 'fixed',top: '0',left: '0',zIndex: '1000', transition:'0.6s ease'} : { width: '100%', height:'60px', color:'white !important',boxShadow: '0px 0px 8px 4px #4e4d4e', backgroundColor:'black',position: 'fixed',top: '0',left: '0',zIndex: '1000', transition:'0.6s ease'};
  
  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        
        navigate('/login');
      }
    });
    document.getElementById("swal2-checkbox").style.display = "none";
  }
  // const renderTooltip = (props) => (
  //   <Tooltip id="button-tooltip" {...props} >
  //     Simple tooltip
  //   </Tooltip>
  // );

  return (
    <Navbar className="bg-body-tertiary-dark fixed" style={isTopNavFrozen ? topNavFrozen : topNavStyle} expand="lg">
      {/* <Container> */}
        <Navbar.Brand style={{width:'13%', textAlign:'center'}}>            
            <Link to={'/dashboard'}>
                <img src={Logo} height={35} style={{}} className="d-inline-block align-top" alt="" />
            </Link>
        </Navbar.Brand>
        <div className="vl" style={{ borderLeft: '2px solid gold', height: '50px', position: 'Relative', marginLeft: '-0.85%' }}></div>
        <span className="material-symbols-outlined" onClick={toggleSideNav} style={{color:'white', marginLeft:'10px', cursor:'pointer', fontSize:'2rem'}}>menu</span>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end" style={{color:'white'}}>
            <Link to='/dashboard/createTicket'><span className="material-symbols-outlined  tn-icon-pack">contact_support</span></Link>
            <span className="material-symbols-outlined  tn-icon-pack">campaign</span>
            <span className="material-symbols-outlined tn-icon-pack">notifications</span>
            <div className="vl" style={{ borderLeft: '2px solid gold', height: '50px', position: 'Relative', marginLeft: '3px', marginRight: '3%' }}></div>
            <NavDropdown title={user} id="basic-nav-dropdown" style={{color:'white', marginRight:'3%'}}>
              <NavDropdown.Item>
                <Link to='/profile' style={{color:'black',textDecorationLine:'none'}}>Profile</Link>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <Link to='/dashboard' style={{color:'black',textDecorationLine:'none'}}>Instances</Link>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <Link to='/' style={{color:'black',textDecorationLine:'none'}}>Billing</Link>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item style={{color:'red'}} onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
              <img src={UserImg} className='tn-icon-pack' alt="" height={35} width={35}/>
            
        </Navbar.Collapse>
      {/* </Container> */}
    </Navbar>
  );
}

export default TopNav;

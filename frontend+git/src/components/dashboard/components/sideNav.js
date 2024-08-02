import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function SideNav({ isOpen , isTopNavFrozen }) {

    const classText = (isOpen && isTopNavFrozen) ?('side-nav-open side-nav-frozen') : (isOpen && !isTopNavFrozen) ? ('side-nav-open') : (!isOpen && isTopNavFrozen) ?('side-nav side-nav-frozen') : ('side-nav')

    return (
        <div className={classText}>
            {isOpen ?
                <>
                    <Link to="/dashboard" style={{marginTop:'5%'}}><i className="fa-solid fa-mobile-retro" style={{color: '#ffffff'}}></i> Dashboard</Link>
                    
                    <Link to="#developers" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="developers"><i className="fa fa-fw fa-code"></i> Developers</Link>
                    <ListGroup as="ul" id = "developers" className='collapse'>
                        <ListGroup.Item as="li"><Link to="/developers/documentation" style={{fontSize:'17px'}}><i className="fa fa-fw fa-file-code"></i> Documentation</Link></ListGroup.Item>
                        <ListGroup.Item as="li"><Link to="/developers/prduct" style={{fontSize:'17px'}}><i className="fa-brands fa-product-hunt"></i> Product ID</Link></ListGroup.Item>
                        <ListGroup.Item as="li"><Link to="/developers/webhooks" style={{fontSize:'17px'}}><i className="fa-brands fa-chrome"></i> Webhooks</Link></ListGroup.Item>
                        <ListGroup.Item as="li"><Link to="/developers/logs" style={{fontSize:'17px'}}><i className="fa-solid fa-file-lines"></i> Logs</Link></ListGroup.Item>
                    </ListGroup>                  
                    <Link to="#dashboard" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="dashboard"><i className="fa-solid fa-handshake-angle"></i> Integrations</Link>
                    <ListGroup as="ul" id='dashboard' className='collapse'>
                        <ListGroup.Item as="li"><Link to="/dashboard" style={{fontSize:'17px'}}><i className="fa-regular fa-rectangle-list"></i> Google Sheets</Link></ListGroup.Item>
                        <ListGroup.Item as="li"><Link to="/dashboard" style={{fontSize:'17px'}}><i className="fa-regular fa-address-card"></i> Google Contacts</Link></ListGroup.Item>
                    </ListGroup>
                    <Link to="/dashboard/subscriptions"><i className="fa-solid fa-cart-shopping"></i> Subscriptions</Link>
                    <Link to="#tickets" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="tickets"><i className="fa-solid fa-question fa-xl"></i> Help Center</Link>
                    <ListGroup as="ul" id='tickets' className='collapse'>
                        <ListGroup.Item as="li"><Link to="/dashboard/createTicket" style={{fontSize:'17px'}}><i className="fa-solid fa-file-pen fa-lg"></i> Create New Ticket</Link></ListGroup.Item>
                        <ListGroup.Item as="li"><Link to="/dashboard/viewTickets" style={{fontSize:'17px'}}><i className="fa-regular fa-square-check fa-lg"></i> View Tickets</Link></ListGroup.Item>
                    </ListGroup>
                </>
            : 
                <>
                    <Link to="/dashboard" style={{marginTop:'5%'}}><i className="fa-solid fa-mobile-retro"></i></Link>
                    <Link to="#developers" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="developers"><i className="fa fa-fw fa-code"></i></Link>
                    <ListGroup as="ul" id = "developers" className='collapse'>
                        <ListGroup.Item as="li"><Link to="/developers/documentation" style={{fontSize:'17px'}}><i className="fa fa-fw fa-file-code"></i></Link></ListGroup.Item>
                        <ListGroup.Item as="li"><Link to="/developers/prduct" style={{fontSize:'17px'}}><i className="fa-brands fa-product-hunt"></i></Link></ListGroup.Item>
                        <ListGroup.Item as="li"><Link to="/developers/webhooks" style={{fontSize:'17px'}}><i className="fa-brands fa-chrome"></i></Link></ListGroup.Item>
                        <ListGroup.Item as="li"><Link to="/developers/logs" style={{fontSize:'17px'}}><i className="fa-solid fa-file-lines"></i></Link></ListGroup.Item>
                    </ListGroup> 
                    <Link to="#dashboard" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="dashboard"><i className="fa-solid fa-handshake-angle"></i></Link>
                    <ListGroup as="ul" id='dashboard' className='collapse'>
                        <ListGroup.Item as="li"><Link to="/dashboard" style={{fontSize:'17px'}}><i className="fa-regular fa-rectangle-list"></i></Link></ListGroup.Item>
                        <ListGroup.Item as="li"><Link to="/dashboard" style={{fontSize:'17px'}}><i className="fa-regular fa-address-card"></i></Link></ListGroup.Item>
                    </ListGroup>
                    <Link to="/dashboard/subscriptions"><i className="fa-solid fa-cart-shopping"></i></Link>
                    <Link to="#tickets" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="tickets"><i className="fa-solid fa-question fa-xl"></i></Link>
                    <ListGroup as="ul" id='tickets' className='collapse'>
                        <ListGroup.Item as="li"><Link to="/dashboard/createTicket" style={{fontSize:'17px'}}><i className="fa-solid fa-file-pen fa-lg"></i></Link></ListGroup.Item>
                        <ListGroup.Item as="li"><Link to="/dashboard/viewTickets" style={{fontSize:'17px'}}><i className="fa-regular fa-square-check fa-lg"></i></Link></ListGroup.Item>
                    </ListGroup>
                </>
            }
        </div>
    );
}

export default SideNav;

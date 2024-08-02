import React, {useEffect, useState} from 'react'
import TopNav from './components/topNav'
import SideNav from './components/sideNav'
import { Card, Col, Row } from 'react-bootstrap';
import ApexCharts from 'apexcharts'

function AdminDashboard() {
    const [isSideNavOpen, setIsSideNavOpen] = useState(true);
    const [isTopNavFrozen, setIsTopNavFrozen] = useState(false);

    const handleScroll = () => {
        const scrollPosition = window.scrollY;
  
        if (scrollPosition > 0) {
          setIsTopNavFrozen(true);
        } else {
          setIsTopNavFrozen(false);
        }
    };

    const toggleSideNav = () => {
        setIsSideNavOpen(!isSideNavOpen);
    };

    useEffect(() => {
        var chart = new ApexCharts(document.querySelector("#u"), {
                series: [{name: 'Users',data: [10,25,15,75,55,20,35]}], 
                chart: {type: 'area', height: 250, sparkline: { enabled: true },}, 
                stroke: { curve: 'straight'},
                fill: { opacity: 0.3, },
                xaxis: {categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul']},
                yaxis: {min: 0},
                colors: ['#239B56','#82E0AA'],
                title: {text: '1547', offsetX: 0, style: { fontSize: '24px',}},
                subtitle: {text: 'Users', offsetX: 0, style: {fontSize: '14px',}}
            }
        );
        chart.render();

        var chart1 = new ApexCharts(document.querySelector("#u1"), {            
                series: [14, 23, 21, 17, 15, 10, 12, 17, 21],
                chart: {type: 'polarArea', height:200},
                stroke: {colors: ['#fff']},
                fill: {opacity: 0.5},
                responsive: [{ options: { chart: { width: 100 }, legend: { position: 'right' }}}]
            }
        );
        chart1.render();

        window.addEventListener("scroll", handleScroll);
        return () => {
          window.removeEventListener("scroll", handleScroll);
          chart.destroy()
        };

        
    }, []);

    
        
        
            
    
  return (
    <div>
        <TopNav toggleSideNav={toggleSideNav} isSideNavOpen={isSideNavOpen} isTopNavFrozen={isTopNavFrozen} />
        <div className='content'>
            <SideNav isOpen={isSideNavOpen} isTopNavFrozen={isTopNavFrozen} />
            <div className="main-content" style={{backgroundColor:'lightgrey',overflowY: 'auto', maxHeight: 'calc(100vh - 60px)'}}>
                <Row className='' style={{paddingBottom:'20px'}}>
                
                    <Col>
                    
                        <Card className='cards' style={{backgroundColor:'white' }}>
                            {/* <Card.Body>
                                <Card.Title id='u'>1547</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Active Users</Card.Subtitle>
                                <Card.Text>
                                    
                                </Card.Text> */}
                                <div id='u'></div>
                                
                            {/* </Card.Body> */}
                        </Card>
                    </Col>
                    <Col>
                        <Card className='cards' style={{backgroundColor:'black' }}>
                            <div id='u1'></div>
                            {/* <Card.Body>
                                <Card.Title>Card Title</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                                <Card.Text>
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                                </Card.Text>
                                <Card.Link href="#">Card Link</Card.Link>
                                <Card.Link href="#">Another Link</Card.Link>
                            </Card.Body> */}
                        </Card>
                    </Col>
                    <Col>
                        <Card className='cards' style={{backgroundColor:'lightblue' }}>
                            <Card.Body>
                                <Card.Title>Card Title</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                                <Card.Text>
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                                </Card.Text>
                                <Card.Link href="#">Card Link</Card.Link>
                                <Card.Link href="#">Another Link</Card.Link>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className='cards' style={{backgroundColor:'lightblue' }}>
                            <Card.Body>
                                <Card.Title>Card Title</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                                <Card.Text>
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                                </Card.Text>
                                <Card.Link href="#">Card Link</Card.Link>
                                <Card.Link href="#">Another Link</Card.Link>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                </Row>
                <Row className=''>
                    
                    <Col>
                        <Card className='cards' style={{backgroundColor:'lightblue' }}>
                            <Card.Body>
                                <Card.Title>Card Title</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                                <Card.Text>
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                                </Card.Text>
                                <Card.Link href="#">Card Link</Card.Link>
                                <Card.Link href="#">Another Link</Card.Link>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className='cards' style={{backgroundColor:'lightblue' }}>
                            <Card.Body>
                                <Card.Title>Card Title</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                                <Card.Text>
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                                </Card.Text>
                                <Card.Link href="#">Card Link</Card.Link>
                                <Card.Link href="#">Another Link</Card.Link>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className='cards' style={{backgroundColor:'lightblue' }}>
                            <Card.Body>
                                <Card.Title>Card Title</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                                <Card.Text>
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                                </Card.Text>
                                <Card.Link href="#">Card Link</Card.Link>
                                <Card.Link href="#">Another Link</Card.Link>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className='cards' style={{backgroundColor:'lightblue' }}>
                            <Card.Body>
                                <Card.Title>Card Title</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                                <Card.Text>
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                                </Card.Text>
                                <Card.Link href="#">Card Link</Card.Link>
                                <Card.Link href="#">Another Link</Card.Link>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    </div>
  )
}

export default AdminDashboard

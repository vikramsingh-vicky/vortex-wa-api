import React from 'react'
import iosSetting from '../../../media/apple-settings.svg'

function Instruction_qr() {
    return (
        <>
            <h2 style={{color:'#E06409', textAlign:'center'}}>Instructions</h2>
              <div className="row" style={{padding: '20px'}}>
                <div className='col' style={{padding: '10px', borderRight:'solid 2px', borderRightColor: '#000'}}>
                    <h3 style={{color:'goldenrod', textAlign:'center'}}>How to generate New Instance</h3>
                    <ol className="list-group list-group-flush" style={{marginLeft: '15px'}}>
                        <li>We've already created 1 Instance with your Signup and Login Activity for the first time.</li>
                        <li>Additional Instances can be created by clicking on the <b>Create New Instance</b> button above.</li>
                        <li>You can generate upto 5 Instances for one user account. To get additional Instances, contact our Sales Team.</li>
                        <li>The billing will be based on number of Instances.</li>
                        <li>You can send Test Message by clicking on <b>Send Test Message</b> button once you get authenticated.</li>
                    </ol>
                    <br />
                    <span style={{color:'red'}}>Keep our resources free by not generating unutilized Instances.</span>
                </div>
                <div className="col" style={{padding: '10px', borderRight:'solid 2px', borderRightColor: '#000'}}>
                    <h3 style={{color:'goldenrod', textAlign:'center'}}>How to generate QR code</h3>
                    <ol className="list-group list-group-flush" style={{marginLeft: '15px'}}>
                        <li>Under the <b>Session Action</b> column in the <b>Instances Table</b> located at the top of the page, click on <b>Fetch Session</b> button.</li>
                        <li>Once the session is generated, you'll get a QR code Displayed.</li>
                        <li>If you have already authenticated, you'll see a <b>Logout</b> button.</li>
                    </ol>
                </div>
                <div className="col" style={{padding: '10px'}}>
                    <h3 style={{color:'goldenrod', textAlign:'center'}}>How to connect your phone</h3>
                    <ol className="list-group list-group-flush" style={{marginLeft: '15px'}}>
                        <li>Open WhatsApp on you phone</li>
                        <li>Tap <b>Menu </b><i className="fas fa-ellipsis-v"></i> on Android, or <b>Settings </b><img src={iosSetting} alt='' height={25} width={25} /> on iOS</li>
                        <li>Tap <b>Linked devices</b> and then <b>Link a device</b></li>
                        <li>Scan the QR code of any of the instances you have created and generated the QR for.</li>
                        <li>One phone can only be connected to a single instance.</li>
                    </ol>
                </div>
              </div>
            
        </>
    )
}

export default Instruction_qr


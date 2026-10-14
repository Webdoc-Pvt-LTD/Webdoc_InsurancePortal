import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Swal from 'sweetalert2';  // Import SweetAlert2
import { SMSURL } from '../Config';  // Assuming SMSURL is defined in your Config.js

const SendSMS = () => {
  // State variables to store user input
  const [mobilenumber, setMobilenumber] = useState('');
  const [status, setStatus] = useState('');

  // Static SMS Text
  const smstext = "Download the app today and easily apply for a loan in just a few steps. Get the financial support you need now! http://bit.ly/4iFiQbr";

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data to send
    const data = {
      masking: "WEBDOC.", // Static value for masking
      mobilenumber,
      smstext,
    };

    try {
      // Send the POST request to the API
      const response = await axios.post(`${SMSURL}/api/sentsms/send-sms`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if the response indicates success
      if (response.data && response.data.ResponseCode === '0000') {
        console.log('Successfully sent SMS:', response.data);
        setStatus('Message sent successfully!');
        
        // Show success SweetAlert
        Swal.fire({
          title: 'Success!',
          text: 'SMS sent successfully!',
          icon: 'success',
          confirmButtonText: 'Okay'
        });
      } else {
        console.error('Failed to send SMS:', response.data);
        setStatus('Failed to send SMS');
        
        // Show error SweetAlert
        Swal.fire({
          title: 'Failed!',
          text: 'Failed to send SMS. Please try again later.',
          icon: 'error',
          confirmButtonText: 'Okay'
        });
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      setStatus('Error sending SMS');
      
      // Show error SweetAlert in case of network error or any other issue
      Swal.fire({
        title: 'Error!',
        text: 'Error sending SMS. Please check your connection or try again later.',
        icon: 'error',
        confirmButtonText: 'Okay'
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            {/* <div className="card-body">
              <h2 className="text-center mb-4">Send SMS</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="masking" className="form-label">Masking</label>
                  <input
                    type="text"
                    className="form-control"
                    id="masking"
                    value="WEBDOC."
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="mobilenumber" className="form-label">Mobile Number</label>
                  <input
                    type="text"
                    className="form-control"
                    id="mobilenumber"
                    value={mobilenumber}
                    onChange={(e) => setMobilenumber(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="smstext" className="form-label">SMS Text</label>
                  <textarea
                    id="smstext"
                    className="form-control"
                    value={smstext}
                    readOnly
                    rows="4"
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Send SMS</button>
              </form>

              {status && (
                <div className="mt-3 alert alert-info text-center">
                  <strong>{status}</strong>
                </div>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendSMS;

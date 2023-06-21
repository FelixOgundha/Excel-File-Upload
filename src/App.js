import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import React from 'react';
import { Form } from 'react-bootstrap';
import Index from './components';

function App() {
  const [selectedFile, setSelectedFile] = React.useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Perform the upload using your preferred method (e.g., Axios)
      // Replace `uploadUrl` with the appropriate URL for your server-side upload endpoint
      const uploadUrl = 'https://api-meru.ngamia.africa/api/AccountManagement/UploadUsersCSV';
      axios.post(uploadUrl, formData)
        .then(response => {
          // Handle the successful upload response
          console.log('Upload success:', response);
        })
        .catch(error => {
          // Handle upload errors
          console.error('Upload error:', error);
        });
    }
  };

  return (
    <div className="App">
      {/* <div>
        <h2>Upload CSV File</h2>
        <input type="file" accept="*" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div> */}
      <Index />
    </div>
  );
}

export default App;

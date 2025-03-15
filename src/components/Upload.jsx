import React, { useState } from 'react';
import '../styles/Upload.css';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a file.");
      return;
    }
    
    const validExtensions = ["xml", "xlsx"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      alert("Invalid file type. Please upload an XML or XLSX file.");
      return;
    }
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);

    setUploadStatus("Uploading...");

    try {
      const response = await fetch('https://globicall.globicallservices.com/QuizIntegration/UploadServletNew', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.status === 'true') {
        setUploadStatus("Processing file...");
        const fileName = file.name.split(".").slice(0, -1).join(".");
        
        const processResponse = await fetch(`https://globicall.globicallservices.com/QuizIntegration/ReadExcelServletNew?fileName=${encodeURIComponent(fileName)}`);
        
        if (!processResponse.ok) {
          throw new Error(`File processing failed with status: ${processResponse.status}`);
        }
        
        const processData = await processResponse.json();
        setUploadStatus(processData.success ? "File processed successfully" : "File processing failed");
      } else {
        throw new Error(data.message || "File upload failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setUploadStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">File Uploader</h2>
      <form className="upload-form" onSubmit={handleUpload}>
        <input className="upload-input" type="file" accept=".xml,.xlsx" onChange={handleFileChange} required />
        <i className="upload-icon fas fa-cloud-upload-alt"></i>
        <p className="upload-text">Browse File to Upload</p>
        <button type="submit" className="upload-button">Upload</button>
      </form>
      <div className="upload-status">{uploadStatus}</div>
    </div>
  );
};

export default Upload;

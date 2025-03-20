import React, { useState, useEffect } from 'react';

const UploadModal = ({ onClose, categories, subcategories, setPdfFile }) => {
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [file, setFile] = useState(null);
  const [documentCode, setDocumentCode] = useState('');
  const [versionCode, setVersionCode] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  
  useEffect(() => {
    // When section changes, update available subjects
    if (selectedSection) {
      if (selectedSection === 'Quality Manual') {
        // If Quality Manual is selected, show all subcategories as options
        const allSubcategories = Object.keys(subcategories);
        setAvailableSubjects(allSubcategories);
      } else if (subcategories[selectedSection]) {
        // If a specific section is selected, show its subjects
        setAvailableSubjects(subcategories[selectedSection]);
      } else {
        setAvailableSubjects([]);
      }
    } else {
      setAvailableSubjects([]);
    }
  }, [selectedSection, subcategories]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    }
  };

  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
    setSelectedSubject('');
  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  const handleUpload = () => {
    if (file && selectedSection && selectedSubject) {
      setPdfFile(file, documentCode, versionCode, effectiveDate, selectedSection, selectedSubject);
      onClose();
    }
  };

  // Debug logging
  console.log('Selected Section:', selectedSection);
  console.log('Available Subjects:', availableSubjects);
  console.log('Selected Subject:', selectedSubject);
  console.log('File:', file ? file.name : 'No file selected');

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3 className="modal-title">Upload Document</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="form-row">
          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Section:</label>
              <select 
                value={selectedSection}
                onChange={handleSectionChange}
                className="form-control"
              >
                <option value="">Select Section</option>
                <option value="User Guide">User Guide</option>
                <option value="Context Organizational">Context Organizational</option>
                <option value="Leadership">Leadership</option>
                <option value="Planning">Planning</option>
                <option value="Support">Support</option>
                <option value="Operation">Operation</option>
                <option value="Performance Evaluation">Performance Evaluation</option>
                <option value="Improvement">Improvement</option>
              </select>
            </div>
          </div>
          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Subject:</label>
              <select 
                value={selectedSubject}
                onChange={handleSubjectChange}
                className="form-control"
                disabled={!selectedSection}
              >
                <option value="">Select Subject</option>
                {selectedSection === 'User Guide' && (
                  <>
                    <option value="Foreword">Foreword</option>
                    <option value="Table of Contents">Table of Contents</option>
                    <option value="Objectives of the Quality Manual">Objectives of the Quality Manual</option>
                    <option value="Background Info of NRCP">Background Info of NRCP</option>
                    <option value="Authorization">Authorization</option>
                    <option value="Distribution">Distribution</option>
                    <option value="Coding System">Coding System</option>
                  </>
                )}
                {selectedSection && selectedSection !== 'User Guide' && (
                  <>
                    <option value="Overview">Overview</option>
                    <option value="Requirements">Requirements</option>
                    <option value="Process">Process</option>
                    <option value="Documentation">Documentation</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Upload PDF:</label>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={handleFileChange} 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Document Code:</label>
          <input 
            type="text" 
            value={documentCode}
            onChange={(e) => setDocumentCode(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Version Code:</label>
          <input 
            type="text" 
            value={versionCode}
            onChange={(e) => setVersionCode(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Effective Date:</label>
          <input 
            type="date" 
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-actions">
          <button 
            className="primary-button" 
            style={{ backgroundColor: 'rgb(0, 123, 255)' }}
            onClick={handleUpload}
            disabled={!file || !selectedSection || !selectedSubject}
          >
            Upload
          </button>
          <button className="secondary-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
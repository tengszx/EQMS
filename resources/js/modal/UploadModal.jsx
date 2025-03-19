import React, { useState } from 'react';

const UploadModal = ({ onClose, categories, subcategories, setPdfFile }) => {
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [file, setFile] = useState(null);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [documentCode, setDocumentCode] = useState('');
  const [versionCode, setVersionCode] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      const fileUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(fileUrl);
    }
  };

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setEndPage(numPages);
  };

  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
    setSelectedSubject('');
  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  const handleUpload = () => {
    if (file) {
      setPdfFile(file, documentCode, versionCode, effectiveDate);
      onClose();
    }
  };

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
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
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
                {selectedSection && subcategories[selectedSection].map((subcat, index) => (
                  <option key={index} value={subcat}>{subcat}</option>
                ))}
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

        {previewUrl && (
          <div className="pdf-preview-container">
            <h4>PDF Preview:</h4>
            <div className="pdf-preview">
              <Document
                file={previewUrl}
                onLoadSuccess={handleDocumentLoadSuccess}
                className="pdf-document"
              >
                <Page 
                  pageNumber={startPage} 
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  scale={0.5}
                  className="pdf-page"
                />
              </Document>
            </div>
            
            <div className="form-group page-selection">
              <label className="form-label">Page Range:</label>
              <div className="page-range">
                <div className="page-range-input">
                  <span>From:</span>
                  <input 
                    type="number" 
                    min="1" 
                    max={numPages || 1} 
                    value={startPage}
                    onChange={(e) => setStartPage(Math.max(1, Math.min(parseInt(e.target.value) || 1, numPages)))}
                    className="form-control page-input"
                  />
                </div>
                <div className="page-range-input">
                  <span>To:</span>
                  <input 
                    type="number" 
                    min={startPage}
                    max={numPages || 1} 
                    value={endPage}
                    onChange={(e) => setEndPage(Math.max(startPage, Math.min(parseInt(e.target.value) || startPage, numPages)))}
                    className="form-control page-input"
                  />
                </div>
                <span className="page-total">of {numPages}</span>
              </div>
            </div>
          </div>
        )}

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
            onClick={handleUpload}
            disabled={!file || (!selectedSection || !selectedSubject)}
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

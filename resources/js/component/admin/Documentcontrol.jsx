import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import '../../../css/styles/admin/DocumentControl.css';
import { Document, Page } from 'react-pdf';

// Import the specific version of pdf.js that matches react-pdf
import { pdfjs } from 'react-pdf';
// Set the worker source to the correct version
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// Custom Add File Modal Component
const AddFileModal = ({ onClose, onAddFile }) => {
  const [file, setFile] = useState(null);
  const [selectedPage, setSelectedPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);

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
    setSelectedPage(1);
  };

  const handlePageChange = (e) => {
    const page = parseInt(e.target.value);
    if (page > 0 && page <= numPages) {
      setSelectedPage(page);
    }
  };

  const handleAddFile = () => {
    if (file) {
      onAddFile(file, selectedPage);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3 className="modal-title">Add File</h3>
          <button className="close-button" onClick={onClose}>×</button>
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
                  pageNumber={selectedPage} 
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  scale={0.5}
                  className="pdf-page"
                />
              </Document>
            </div>
            
            <div className="form-group page-selection">
              <label className="form-label">Select Page:</label>
              <input 
                type="number" 
                min="1" 
                max={numPages || 1} 
                value={selectedPage}
                onChange={handlePageChange}
                className="form-control page-input"
              />
              <span className="page-total">of {numPages}</span>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button 
            className="primary-button" 
            onClick={handleAddFile}
            disabled={!file}
          >
            Add
          </button>
          <button className="secondary-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// Custom Upload Modal Component
const UploadModal = ({ onClose, categories, subcategories, setPdfFile, isAddingFile }) => {
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

        {!isAddingFile && (
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
        )}

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
            disabled={!file || (!isAddingFile && (!selectedSection || !selectedSubject))}
          >
            Upload
          </button>
          <button className="secondary-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// Draft Modal Component
const DraftModal = ({ onClose }) => {
  const [drafts, setDrafts] = useState([
    { id: 1, title: 'User Guide - Foreword', date: 'Mar 15, 2025', category: 'User Guide', subcategory: 'Foreword' },
    { id: 2, title: 'Leadership - Policy', date: 'Mar 10, 2025', category: 'Leadership', subcategory: 'Policy' }
  ]);

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3 className="modal-title">Draft Documents</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="draft-list">
          {drafts.length === 0 ? (
            <p className="no-drafts">No draft documents available.</p>
          ) : (
            drafts.map(draft => (
              <div key={draft.id} className="draft-item">
                <div className="draft-info">
                  <div className="draft-title">{draft.title}</div>
                  <div className="draft-metadata">
                    {draft.category} - {draft.subcategory} | Last edited: {draft.date}
                  </div>
                </div>
                <div className="draft-actions">
                  <button className="draft-button">Edit</button>
                  <button className="draft-button">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="form-actions">
          <button className="secondary-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

const DocumentControl = () => {
  const [selectedManual, setSelectedManual] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [showAddFileModal, setShowAddFileModal] = useState(false);
  const [showDocumentView, setShowDocumentView] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [scale, setScale] = useState(0.8); // Start with smaller scale
  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });
  const [documentInfo, setDocumentInfo] = useState({
    documentCode: '01-001-2025',
    revisionNumber: '3',
    effectiveDate: '01/01/25'
  });

  // Keep track of total pages including added files
  const [totalDocumentPages, setTotalDocumentPages] = useState(0);

  // Revisions state
  const [revisions, setRevisions] = useState([
    { id: 1, subject: 'Foreword', revision: 'Page 1', date: 'Jan 24, 2025', selected: true },
    { id: 2, subject: 'Foreword', revision: 'Page 2', date: 'Jan 24, 2025', selected: false },
    { id: 3, subject: 'Foreword', revision: 'Page 3', date: 'Jan 24, 2025', selected: false }
  ]);

  // References state
  const [references, setReferences] = useState([]);
  const [showAddReferenceModal, setShowAddReferenceModal] = useState(false);
  const [newReference, setNewReference] = useState('');

  // Manual categories data structure
  const manualCategories = {
    'Quality Manual': [
      'User Guide', 'Context Organizational', 'Leadership', 
      'Planning', 'Support', 'Operation', 
      'Performance Evaluation', 'Improvement'
    ]
  };

  // Subcategories based on the selected category
  const subcategories = {
    'User Guide': [
      'Foreword', 'Table of Contents', 'Objectives of the Quality Manual', 
      'Background Info of NRCP', 'Authorization', 'Distribution', 'Coding System'
    ],
    'Context Organizational': [
      'Understanding the NRCP and its context', 
      'Understanding the Needs and Expectations of Interested Parties', 
      'Scope of the Quality Management System', 
      'Quality Management System and its Processes'
    ],
    'Leadership': [
      'Leadership and Commitment', 'Policy', 
      'Organizational Roles, Responsibilities and Authorities'
    ],
    'Planning': [
      'Actions to Address Risks and Opportunities', 
      'Quality Objective and Planning'
    ],
    'Support': [
      'Resources', 'Competence', 'Awareness', 
      'Communication', 'Document Information'
    ],
    'Operation': [
      'Operational Planning and Control', 'Requirement for Product and Services', 
      'Design and Development of Services', 'Product and Service Provision', 
      'Release of Services', 'Control of Nonconforming Outputs'
    ],
    'Performance Evaluation': [
      'Monitoring Measurement Analysis and Evaluation', 
      'Internal Audit', 'Management Review'
    ],
    'Improvement': [
      'General Requirement', 'Nonconformity and Corrective Action', 
      'Continual Improvement'
    ]
  };

  // Files list for each subcategory
  const [filesList, setFilesList] = useState({
    'Foreword': [
      { id: 1, name: 'Foreword.pdf', effectiveDate: 'Jan 24, 2025', documentCode: '01-001-2025', versionCode: '1' },
      { id: 2, name: 'Foreword_v2.pdf', effectiveDate: 'Jan 25, 2025', documentCode: '01-001-2025', versionCode: '2' }
    ],
    'Table of Contents': [
      { id: 1, name: 'Table of Contents.pdf', effectiveDate: 'Jan 24, 2025', documentCode: '01-002-2025', versionCode: '1' }
    ]
  });

  // Function to handle page load success and get dimensions
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setTotalDocumentPages(numPages);
    // Reset scale whenever a new document loads
    setScale(0.8);
  }

  // Handle when the page renders to get its dimensions
  const onPageLoadSuccess = (page) => {
    const { width, height } = page;
    setPdfDimensions({ width, height });
  };

  const handleManualChange = (e) => {
    setSelectedManual(e.target.value);
    setSelectedCategory('');
    setSelectedSubcategory('');
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory('');
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setShowDocumentView(true);
  };

  const handleBackToList = () => {
    setShowDocumentView(false);
  };

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, numPages || 1));
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.1, 1.5));
  };

  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.1, 0.5));
  };

  const resetZoom = () => {
    setScale(0.8); // Reset to default scale
  };

  const toggleUploadModal = () => {
    setShowUploadModal(!showUploadModal);
  };

  const toggleDraftModal = () => {
    setShowDraftModal(!showDraftModal);
  };

  const toggleAddFileModal = () => {
    setShowAddFileModal(!showAddFileModal);
  };

  const handleRevisionSelect = (id) => {
    setRevisions(revisions.map(rev => ({
      ...rev,
      selected: rev.id === id
    })));
  };

  const handleAddReference = () => {
    setShowAddReferenceModal(true);
  };

  const handleSaveReference = () => {
    if (newReference.trim()) {
      setReferences([...references, newReference]);
      setNewReference('');
    }
    setShowAddReferenceModal(false);
  };

  // File handler
  const handleSetPdfFile = (file, documentCode, versionCode, effectiveDate) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPdfFile(e.target.result);
        setCurrentPage(1);
        setScale(0.8); // Reset zoom when loading a new file
        setDocumentInfo({
          documentCode,
          revisionNumber: '1',
          effectiveDate
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Handle adding a file with page selection
  const handleAddFile = (file, selectedPage) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPdfFile(e.target.result);
        setCurrentPage(selectedPage);
        setScale(0.8); // Reset zoom when loading a new file
        
        // Update total page count
        // Assuming we're adding to existing document
        const newTotalPages = totalDocumentPages + 1;
        setTotalDocumentPages(newTotalPages);
        
        // Add to revision list
        const newRevision = {
          id: revisions.length + 1,
          subject: selectedSubcategory || 'New Document',
          revision: `Page ${selectedPage}`,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          selected: true
        };
        
        // Update revisions and mark the new one as selected
        setRevisions(
          revisions.map(rev => ({ ...rev, selected: false })).concat(newRevision)
        );
        
        // Add to files list
        const newFile = {
          id: Object.keys(filesList).reduce((maxId, key) => Math.max(maxId, Math.max(...filesList[key].map(file => file.id))), 0) + 1,
          name: file.name,
          effectiveDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          documentCode: documentInfo.documentCode,
          versionCode: documentInfo.revisionNumber
        };
        
        setFilesList({
          ...filesList,
          [selectedSubcategory]: [...filesList[selectedSubcategory], newFile]
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleUpload = (file, documentCode, versionCode, effectiveDate) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPdfFile(e.target.result);
        setCurrentPage(1);
        setScale(0.8); // Reset zoom when loading a new file
        
        // Update total page count
        // Assuming we're adding to existing document
        const newTotalPages = totalDocumentPages + 1;
        setTotalDocumentPages(newTotalPages);
        
        // Add to revision list
        const newRevision = {
          id: revisions.length + 1,
          subject: selectedSubcategory || 'New Document',
          revision: `Page 1`,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          selected: true
        };
        
        // Update revisions and mark the new one as selected
        setRevisions(
          revisions.map(rev => ({ ...rev, selected: false })).concat(newRevision)
        );
        
        // Add to files list
        const newFile = {
          id: Object.keys(filesList).reduce((maxId, key) => Math.max(maxId, Math.max(...filesList[key].map(file => file.id))), 0) + 1,
          name: file.name,
          effectiveDate: effectiveDate,
          documentCode,
          versionCode
        };
        
        setFilesList({
          ...filesList,
          [selectedSubcategory]: [...filesList[selectedSubcategory], newFile]
        });
        setDocumentInfo({
          documentCode,
          revisionNumber: '1',
          effectiveDate
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="document-control-container">
      {/* Manual Selection and Buttons */}
      <div className="manual-selection-container">
        <div className="select-manual-wrapper">
          <select 
            value={selectedManual} 
            onChange={handleManualChange}
            className="manual-select"
          >
            <option value="">Select Manual</option>
            <option value="Quality Manual">Quality Manual</option>
          </select>
        </div>

        <div className="document-control-buttons">
          <button className="add-button" onClick={toggleAddFileModal}>
            Add
          </button>
          <button className="upload-button" onClick={toggleUploadModal}>
            Upload
          </button>
          <button className="draft-button" onClick={toggleDraftModal}>
            Drafts
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="document-content-area">
        {/* Categories Column */}
        {selectedManual && (
          <div className="categories-column">
            {manualCategories[selectedManual].map((category, index) => (
              <button 
                key={index} 
                className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Subcategories Column */}
        {selectedCategory && (
          <div className="subcategories-column">
            {subcategories[selectedCategory].map((subcategory, index) => (
              <button 
                key={index} 
                className={`subcategory-button ${selectedSubcategory === subcategory ? 'active' : ''}`}
                onClick={() => handleSubcategoryClick(subcategory)}
              >
                {subcategory}
              </button>
            ))}
          </div>
        )}

        {/* Files List */}
        {selectedSubcategory && !showDocumentView && (
          <div className="files-list">
            <h3 className="section-title">Files:</h3>
            <table className="files-table">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Effective Date</th>
                  <th>Document Code</th>
                  <th>Version Code</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filesList[selectedSubcategory].map(file => (
                  <tr key={file.id}>
                    <td>{file.name}</td>
                    <td>{file.effectiveDate}</td>
                    <td>{file.documentCode}</td>
                    <td>{file.versionCode}</td>
                    <td>
                      <button className="view-button" onClick={() => handleFileClick(file)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Document View Area */}
        {selectedSubcategory && showDocumentView && (
          <div className="document-view-area">
            {/* Section and Subject headers */}
            <div className="document-headers">
              <div className="document-header-item">
                <div className="header-label">Section</div>
                <div className="header-value">{selectedCategory}</div>
              </div>
              <div className="document-header-item">
                <div className="header-label">Subject</div>
                <div className="header-value">{selectedSubcategory}</div>
              </div>
            </div>

            {/* PDF Viewer Container */}
            <div className="pdf-container">
              {/* PDF Viewer */}
              <div className="pdf-viewer">
                {pdfFile ? (
                  <Document 
                    file={pdfFile} 
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={(error) => console.error('Error loading PDF:', error)}
                    className="pdf-document"
                  >
                    <Page 
                      pageNumber={currentPage}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      scale={scale}
                      onLoadSuccess={onPageLoadSuccess}
                      className="pdf-page"
                    />
                  </Document>
                ) : (
                  <div className="pdf-placeholder">
                    <p>No document selected. Please upload a PDF document.</p>
                  </div>
                )}
              </div>

              {/* Zoom Controls */}
              <div className="zoom-controls">
                <button onClick={zoomOut} className="zoom-button" title="Zoom Out">-</button>
                <span>{Math.round(scale * 100)}%</span>
                <button onClick={zoomIn} className="zoom-button" title="Zoom In">+</button>
                <button onClick={resetZoom} className="reset-zoom-button" title="Reset Zoom">Reset</button>
              </div>

              {/* Page Navigation */}
              <div className="page-navigation">
                <button 
                  onClick={prevPage} 
                  className="nav-button"
                  disabled={currentPage <= 1}
                >
                  ◀
                </button>
                <span>Page {currentPage} of {totalDocumentPages}</span>
                <button 
                  onClick={nextPage} 
                  className="nav-button"
                  disabled={currentPage >= totalDocumentPages}
                >
                  ▶
                </button>
              </div>
            </div>

            {/* Previous Versions Section */}
            <div className="previous-versions-section">
              <h3 className="section-title">Previous Versions:</h3>
              <div className="revisions-list">
                {revisions.map(revision => (
                  <div 
                    key={revision.id} 
                    className={`revision-item ${revision.selected ? 'selected' : ''}`}
                    onClick={() => handleRevisionSelect(revision.id)}
                  >
                    <input 
                      type="checkbox" 
                      checked={revision.selected} 
                      onChange={() => handleRevisionSelect(revision.id)}
                    />
                    <div className="revision-details">
                      <div className="revision-subject">{revision.subject}</div>
                      <div className="revision-text">{revision.revision}</div>
                      <div className="revision-date">{revision.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* References Section */}
            <div className="references-section">
              <h3 className="section-title">References:</h3>
              <ul className="reference-list">
                {references.map((reference, index) => (
                  <li key={index} className="reference-item">• {reference}</li>
                ))}
              </ul>
              <button className="add-reference-button" onClick={handleAddReference}>
                Add Reference
              </button>
            </div>

            {/* Document Info Section */}
            <div className="document-info-section">
              <div className="info-row">
                <div className="info-label">Document Code</div>
                <div className="info-value">{documentInfo.documentCode}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Revision Number</div>
                <div className="info-value">{documentInfo.revisionNumber}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Effectivity Date</div>
                <div className="info-value">{documentInfo.effectiveDate}</div>
              </div>
            </div>

            {/* Back to List Button */}
            <div className="document-actions">
              <button className="back-button" onClick={handleBackToList}>Back to List</button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal 
          onClose={toggleUploadModal} 
          categories={manualCategories['Quality Manual']}
          subcategories={subcategories}
          setPdfFile={handleUpload}
        />
      )}

      {/* Draft Modal */}
      {showDraftModal && (
        <DraftModal 
          onClose={toggleDraftModal}
        />
      )}

      {/* Add File Modal */}
      {showAddFileModal && (
        <AddFileModal 
          onClose={toggleAddFileModal}
          onAddFile={handleAddFile}
        />
      )}

      {/* Add Reference Modal */}
      {showAddReferenceModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">Add Reference</h3>
              <button className="close-button" onClick={() => setShowAddReferenceModal(false)}>×</button>
            </div>
            <div className="form-group">
              <label className="form-label">Reference Link:</label>
              <input 
                type="text" 
                value={newReference} 
                onChange={(e) => setNewReference(e.target.value)} 
                className="form-control"
              />
            </div>
            <div className="form-actions">
              <button className="primary-button" onClick={handleSaveReference}>Save</button>
              <button className="secondary-button" onClick={() => setShowAddReferenceModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentControl;

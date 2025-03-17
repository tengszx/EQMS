import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import '../../../css/styles/admin/DocumentControl.css';
import UploadModal from '../../../js/modal/UploadModal';
import DraftModal from '../../../js/modal/DraftModal';
import { Document, Page } from 'react-pdf';

// Import the specific version of pdf.js that matches react-pdf
import { pdfjs } from 'react-pdf';
// Set the worker source to the correct version
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const DocumentControl = () => {
  const [selectedManual, setSelectedManual] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [scale, setScale] = useState(0.8); // Start with smaller scale
  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });
  const [documentInfo, setDocumentInfo] = useState({
    documentCode: '01-001-2025',
    revisionNumber: '3',
    pageNumber: '1',
    effectiveDate: '01/01/25'
  });

  // Mock revisions for preview
  const [revisions, setRevisions] = useState([
    { id: 1, subject: 'Foreword', revision: 'Page 1', date: 'Jan 24, 2025', selected: true },
    { id: 2, subject: 'Foreword', revision: 'Page 2', date: 'Jan 24, 2025', selected: false },
    { id: 3, subject: 'Foreword', revision: 'Page 3', date: 'Jan 24, 2025', selected: false }
  ]);

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

  // Function to handle page load success and get dimensions
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
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

  const handleRevisionSelect = (id) => {
    setRevisions(revisions.map(rev => ({
      ...rev,
      selected: rev.id === id
    })));
  };

  // File reader approach 
  const handleSetPdfFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPdfFile(e.target.result);
        setCurrentPage(1);
        setScale(0.8); // Reset zoom when loading a new file
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const [addedFiles, setAddedFiles] = useState([]);
  const [references, setReferences] = useState([]);
  const [showAddReferenceModal, setShowAddReferenceModal] = useState(false);
  const [newReference, setNewReference] = useState('');
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);

  const handleAddFile = () => {
    setIsAddingFile(true);
    toggleUploadModal();
  };

  const handleAddReference = () => {
    setShowAddReferenceModal(true);
  };

  const handleSaveReference = () => {
    setReferences([...references, newReference]);
    setNewReference('');
    setShowAddReferenceModal(false);
  };

  const handleAddFileToPdf = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPdfFile = e.target.result;
        const newNumPages = numPages + (endPage - startPage + 1);
        setNumPages(newNumPages);
        setPdfFile(newPdfFile);
        setCurrentPage(1);
        setScale(0.8); // Reset zoom when loading a new file
        setIsAddingFile(false);
        const newRevision = {
          id: revisions.length + 1,
          subject: selectedSubcategory,
          revision: `Pages ${startPage} to ${endPage}`,
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          selected: true
        };
        setRevisions([...revisions, newRevision]);
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
          <button className="add-button" onClick={handleAddFile}>
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
                disabled={isAddingFile}
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
                disabled={isAddingFile}
              >
                {subcategory}
              </button>
            ))}
          </div>
        )}

        {/* Document View Area */}
        {selectedSubcategory && (
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
                <span>Page {currentPage} of {numPages || 1}</span>
                <button 
                  onClick={nextPage} 
                  className="nav-button"
                  disabled={!numPages || currentPage >= numPages}
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
                <div className="info-label">Page Number</div>
                <div className="info-value">{currentPage} of {numPages || 1}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Effectivity Date</div>
                <div className="info-value">{documentInfo.effectiveDate}</div>
              </div>
            </div>

            {/* Save Button */}
            <div className="document-actions">
              <button className="save-button">SAVE</button>
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
          setPdfFile={isAddingFile ? handleAddFileToPdf : handleSetPdfFile}
          startPage={startPage}
          setStartPage={setStartPage}
          endPage={endPage}
          setEndPage={setEndPage}
          isAddingFile={isAddingFile}
        />
      )}

      {/* Draft Modal */}
      {showDraftModal && (
        <DraftModal 
          onClose={toggleDraftModal}
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

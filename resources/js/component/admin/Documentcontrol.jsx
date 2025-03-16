import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import '../../../css/styles/admin/DocumentControl.css';
import UploadModal from '../../../js/modal/UploadModal';
import DraftModal from '../../../js/modal/DraftModal';
import { pdfjs, Document, Page } from 'react-pdf';

// Initialize pdfjs worker using the matching version (2.16.105)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

const DocumentControl = () => {
  const [selectedManual, setSelectedManual] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfLoadError, setPdfLoadError] = useState(null);
  const [documentInfo, setDocumentInfo] = useState({
    documentCode: '01-001-2025',
    revisionNumber: '3',
    pageNumber: '1',
    effectiveDate: '01/01/25'
  });

  // Mock revisions for preview
  const [revisions, setRevisions] = useState([
    { id: 1, section: 'Foreword', revision: 'Initial number 1', date: 'Jan 24, 2025', selected: true },
    { id: 2, section: 'Foreword', revision: 'Initial number 2', date: 'Jan 24, 2025', selected: false },
    { id: 3, section: 'Foreword', revision: 'Initial number 3', date: 'Jan 24, 2025', selected: false }
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

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPdfLoadError(null);
  }

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

  const toggleUploadModal = () => {
    setShowUploadModal(!showUploadModal);
  };

  const toggleDraftModal = () => {
    setShowDraftModal(!showDraftModal);
  };

  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
  };

  const handleRevisionSelect = (id) => {
    setRevisions(revisions.map(rev => ({
      ...rev,
      selected: rev.id === id
    })));
  };

  const handleSetPdfFile = (file) => {
    if (file) {
      setPdfFile(URL.createObjectURL(file));
      setCurrentPage(1);
      setPdfLoadError(null);
    }
  };

  const handleAddPdfFile = (file) => {
    if (file) {
      // In a real implementation, you would merge PDF files here
      // For now, we'll just replace the current PDF with the new one
      setPdfFile(URL.createObjectURL(file));
      setCurrentPage(1);
      setPdfLoadError(null);
    }
  };

  const handlePdfLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setPdfLoadError(`Failed to load PDF: ${error.message}`);
  };

  // Reset PDF errors when changing sections
  useEffect(() => {
    setPdfLoadError(null);
  }, [selectedCategory, selectedSubcategory]);

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
          {pdfFile && (
            <button className="add-button" onClick={toggleAddModal}>
              Add
            </button>
          )}
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

            {/* PDF Viewer */}
            <div className="pdf-viewer">
              {pdfFile ? (
                <Document 
                  file={pdfFile} 
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={handlePdfLoadError}
                  options={{
                    cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/cmaps/',
                    cMapPacked: true,
                  }}
                >
                  {pdfLoadError ? (
                    <div className="pdf-error">
                      <p>{pdfLoadError}</p>
                      <p>Please try uploading the document again or contact support.</p>
                    </div>
                  ) : (
                    <Page 
                      pageNumber={currentPage}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      scale={1.2}
                    />
                  )}
                </Document>
              ) : (
                <div className="pdf-placeholder">
                  <p>No document selected. Please upload a PDF document.</p>
                </div>
              )}
            </div>

            {/* Page Navigation */}
            <div className="page-navigation">
              <button 
                onClick={prevPage} 
                className="nav-button"
                disabled={currentPage <= 1 || !pdfFile || pdfLoadError}
              >
                ◀
              </button>
              <span>Page {currentPage} of {numPages || 1}</span>
              <button 
                onClick={nextPage} 
                className="nav-button"
                disabled={!numPages || currentPage >= numPages || !pdfFile || pdfLoadError}
              >
                ▶
              </button>
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
                      <div className="revision-section">{revision.section}</div>
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
                <li className="reference-item">• Reference 1</li>
                <li className="reference-item">• Reference 2</li>
                <li className="reference-item">• Reference 3</li>
                <li className="reference-item">• Reference 4</li>
              </ul>
              <button className="add-reference-button">
                <PlusCircle size={16} />
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
          setPdfFile={handleSetPdfFile}
        />
      )}

      {/* Add Modal */}
      {showAddModal && (
        <UploadModal 
          onClose={toggleAddModal} 
          categories={manualCategories['Quality Manual']}
          subcategories={subcategories}
          setPdfFile={handleAddPdfFile}
          isAddMode={true}
          currentSection={selectedCategory}
          currentSubject={selectedSubcategory}
        />
      )}

      {/* Draft Modal */}
      {showDraftModal && (
        <DraftModal 
          onClose={toggleDraftModal}
        />
      )}
    </div>
  );
};

export default DocumentControl;
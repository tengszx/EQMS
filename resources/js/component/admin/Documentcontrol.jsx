import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import '../../../css/styles/admin/DocumentControl.css';
import { Document, Page, pdfjs } from 'react-pdf';
import UploadModal from '../../../js/modal/UploadModal';
import DraftModal from '../../../js/modal/DraftModal';
import { PDFDocument } from 'pdf-lib';

// Set the worker source to the correct version
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// Custom Add File Modal Component
const AddFileModal = ({ onClose, onAddFile }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    }
  };

  const handleAddFile = () => {
    if (file) {
      onAddFile(file);
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

        <div className="form-actions">
          <button 
            className="primary-button add-button" 
            style={{ backgroundColor: 'rgb(0, 123, 255)', color: 'white' }}
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

const DocumentControl = () => {
  const [selectedManual, setSelectedManual] = useState('Quality Manual');
  const [selectedCategory, setSelectedCategory] = useState('User Guide');
  const [selectedSubcategory, setSelectedSubcategory] = useState('Foreword');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [showAddFileModal, setShowAddFileModal] = useState(false);
  const [showDocumentView, setShowDocumentView] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [scale, setScale] = useState(0.8);
  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });
  const [isPortrait, setIsPortrait] = useState(false);
  const [documentInfo, setDocumentInfo] = useState({
    documentCode: '',
    revisionNumber: '',
    effectiveDate: ''
  });

  // Store drafted documents
  const [drafts, setDrafts] = useState([]);

  // Track all uploaded PDFs
  const [uploadedPdfs, setUploadedPdfs] = useState([]);
  
  // Track page ranges for each uploaded PDF
  const [pdfPageRanges, setPdfPageRanges] = useState([]);
  
  // Store metadata for each page
  const [pageMetadata, setPageMetadata] = useState([]);

  // Revisions state with startPage information
  const [revisions, setRevisions] = useState([]);

  // Files list for each subcategory
  const [filesList, setFilesList] = useState({});

  // Debug for filesList
  useEffect(() => {
    console.log('Updated filesList:', filesList);
  }, [filesList]);

  // Function to handle page load success and get dimensions
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    // Reset scale whenever a new document loads
    setScale(0.8);
    console.log(`Document loaded with ${numPages} pages`);
  }

  // Handle when the page renders to get its dimensions
  const onPageLoadSuccess = (page) => {
    const { width, height } = page;
    setPdfDimensions({ width, height });
    
    // Determine if the PDF is in portrait or landscape orientation
    const isPortraitOrientation = height > width;
    setIsPortrait(isPortraitOrientation);
    
    // Adjust scale based on orientation for better fit
    if (isPortraitOrientation) {
      // For portrait, use a larger initial scale
      setScale(0.9);
    } else {
      // For landscape, use a smaller initial scale
      setScale(0.8);
    }
    
    console.log(`Page dimensions: ${width}x${height}, orientation: ${isPortraitOrientation ? 'portrait' : 'landscape'}`);
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
    setShowDocumentView(false);
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setShowDocumentView(true);
    
    // Set document info based on selected file
    setDocumentInfo({
      documentCode: file.documentCode || '',
      revisionNumber: file.versionCode || '',
      effectiveDate: file.effectiveDate || ''
    });
    
    // Load the file here if needed
    if (file.pdfData) {
      setPdfFile(file.pdfData);
      setCurrentPage(1);
      
      // Reset uploaded PDFs to only include this file's data
      setUploadedPdfs([file.pdfData]);
      
      // Set page ranges for this file
      setPdfPageRanges([{
        start: 0,
        end: 0, // Will be updated after document loads
        pageCount: 0, // Will be updated after document loads
        startPageNumber: 1,
        fileName: file.name // Use the actual file name
      }]);
    }
  };

  const handleBackToList = () => {
    setShowDocumentView(false);
  };

  // Fixed navigation functions with prevent default to stop page reload
  const nextPage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentPage(prev => Math.min(prev + 1, numPages || 1));
  };

  const prevPage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  // Fixed zoom functions with prevent default
  const zoomIn = (e) => {
    e.preventDefault();
    setScale(prevScale => Math.min(prevScale + 0.1, 1.5));
  };

  const zoomOut = (e) => {
    e.preventDefault();
    setScale(prevScale => Math.max(prevScale - 0.1, 0.5));
  };

  const resetZoom = (e) => {
    e.preventDefault();
    // Set different default zoom based on orientation
    setScale(isPortrait ? 0.9 : 0.8);
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
    const selectedRevision = revisions.find(rev => rev.id === id);
    if (selectedRevision) {
      setCurrentPage(selectedRevision.startPage);
    }
    setRevisions(revisions.map(rev => ({
      ...rev,
      selected: rev.id === id
    })));
  };

  // Function to handle saving drafts from UploadModal
  const handleSaveDraft = (draftData) => {
    console.log("Saving draft:", draftData);
    
    // Check if draft already exists to update it, otherwise add new
    const existingDraftIndex = drafts.findIndex(draft => draft.id === draftData.id);
    
    if (existingDraftIndex !== -1) {
      // Update existing draft
      const updatedDrafts = [...drafts];
      updatedDrafts[existingDraftIndex] = draftData;
      setDrafts(updatedDrafts);
    } else {
      // Add new draft
      setDrafts([...drafts, draftData]);
    }
    
    // Close the upload modal
    setShowUploadModal(false);
  };

  // Improved function to combine PDF files using pdf-lib
  const combinePdfFiles = async (pdfDataArray) => {
    try {
      if (pdfDataArray.length === 0) return null;
      
      const mergedPdf = await PDFDocument.create();
      const pageRanges = [];
      
      let totalPages = 0;
      for (const pdfData of pdfDataArray) {
        // Load the PDF document
        const pdfDoc = await PDFDocument.load(pdfData);
        const pageCount = pdfDoc.getPageCount();
        
        // Copy all pages from the document
        const copiedPages = await mergedPdf.copyPages(pdfDoc, Array.from(Array(pageCount).keys()));
        for (const page of copiedPages) {
          mergedPdf.addPage(page);
        }
        
        // Track the page range for this document
        const startPage = totalPages;
        totalPages += pageCount;
        
        pageRanges.push({
          start: startPage,
          end: totalPages - 1,
          pageCount: pageCount,
          startPageNumber: startPage + 1, // Human-readable page number (1-based)
          fileName: selectedFile ? selectedFile.name : `PDF Document ${pageRanges.length + 1}` // Use selectedFile.name if available
        });
      }
      
      // Save the merged PDF
      const mergedPdfBytes = await mergedPdf.save();
      
      // Update page ranges state
      setPdfPageRanges(pageRanges);
      
      console.log('Combined PDFs successfully. Total pages:', totalPages);
      console.log('Page ranges:', pageRanges);
      
      return mergedPdfBytes.buffer;
    } catch (error) {
      console.error('Error combining PDFs:', error);
      return null;
    }
  };

  // File handler for upload modal
  const handleSetPdfFile = async (file, documentCode, versionCode, effectiveDate, section, subject) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileData = e.target.result;
        
        // Generate a unique ID for the file
        const fileId = Date.now();
        
        // Create a new file object
        const newFile = {
          id: fileId,
          name: file.name,
          effectiveDate: effectiveDate,
          documentCode,
          versionCode,
          pdfData: fileData,
          section,
          subject
        };

        console.log('Adding new file:', newFile);
        
        // Update filesList with the new file
        setFilesList(prevFilesList => {
          const updatedFilesList = { ...prevFilesList };
          
          if (!updatedFilesList[subject]) {
            updatedFilesList[subject] = [];
          }
          
          updatedFilesList[subject] = [...updatedFilesList[subject], newFile];
          
          return updatedFilesList;
        });
        
        // Auto-select the category and subcategory that were chosen during upload
        setSelectedCategory(section);
        setSelectedSubcategory(subject);
        setShowDocumentView(false);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Handle adding a file via the Add button
  const handleAddFile = async (file) => {
    if (file && pdfFile) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const newPdfData = e.target.result;
        
        // Add to uploadedPdfs
        const newUploadedPdfs = [...uploadedPdfs, newPdfData];
        setUploadedPdfs(newUploadedPdfs);
        
        // Combine PDFs and update the viewer
        const combined = await combinePdfFiles(newUploadedPdfs);
        if (combined) {
          setPdfFile(combined);
        }
        
        // Update the selected file's metadata to include the new addition
        if (selectedFile) {
          const updatedFile = {
            ...selectedFile,
            pdfData: combined
          };
          
          // Get the starting page for this document (which would be the total pages before adding this document)
          const startPage = pdfPageRanges.length > 0 
            ? pdfPageRanges[pdfPageRanges.length - 1].end + 1 
            : 1;
          
          // Add to revision list
          const newRevision = {
            id: revisions.length + 1,
            subject: selectedSubcategory || 'New Document',
            revision: `Additional File: ${file.name}`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            selected: true,
            startPage: startPage, // Add the starting page information
            fileName: file.name // Store the filename for display
          };
          
          // Update revisions and mark the new one as selected
          setRevisions(
            revisions.map(rev => ({ ...rev, selected: false })).concat(newRevision)
          );
          
          // Add fileName to the corresponding page range
          setPdfPageRanges(prevRanges => {
            const updatedRanges = [...prevRanges];
            if (updatedRanges.length > 0) {
              // Update the last added range with the file name
              updatedRanges[updatedRanges.length - 1].fileName = file.name;
            }
            return updatedRanges;
          });
          
          // Update the filesList with the combined PDF
          if (selectedSubcategory) {
            setFilesList(prevFilesList => {
              const updatedFilesList = { ...prevFilesList };
              
              if (updatedFilesList[selectedSubcategory]) {
                updatedFilesList[selectedSubcategory] = updatedFilesList[selectedSubcategory].map(f => 
                  f.id === selectedFile.id ? updatedFile : f
                );
              }
              
              return updatedFilesList;
            });
          }
          
          setSelectedFile(updatedFile);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleSave = () => {
    // Save the uploaded file
    console.log('File saved successfully!');
    
    // Update the file list with the current selected file
    if (pdfFile && selectedFile && selectedSubcategory) {
      const updatedFile = {
        ...selectedFile,
        pdfData: pdfFile
      };

      setFilesList(prevFilesList => {
        const updatedFilesList = { ...prevFilesList };
        
        if (updatedFilesList[selectedSubcategory]) {
          updatedFilesList[selectedSubcategory] = updatedFilesList[selectedSubcategory].map(f => 
            f.id === selectedFile.id ? updatedFile : f
          );
        }
        
        return updatedFilesList;
      });
      
      setSelectedFile(updatedFile);
    }
  };

  // Get subcategories for the selected manual
  const getSubcategories = () => {
    if (selectedManual === 'Quality Manual') {
      return ['User Guide', 'Context Organizational', 'Leadership', 
              'Planning', 'Support', 'Operation', 
              'Performance Evaluation', 'Improvement'];
    }
    return [];
  };

  // Get subjects for the selected category
  const getSubjects = () => {
    switch (selectedCategory) {
      case 'User Guide':
        return ['Foreword', 'Table of Contents', 'Objectives of the Quality Manual', 
                'Background Info of NRCP', 'Authorization', 'Distribution', 'Coding System'];
      case 'Context Organizational':
        return ['Overview', 'Organizational Context', 'Stakeholders', 'Scope'];
      case 'Leadership':
        return ['Leadership and Commitment', 'Policy', 'Organizational Roles, Responsibilities and Authorities'];
      case 'Planning':
        return ['Planning', 'Quality Objectives', 'Risk and Opportunities', 'Quality Management System and Processes'];
      case 'Support':
        return ['Support', 'Resources', 'Competence', 'Awareness', 'Communication', 'Documented Information'];
      case 'Operation':
        return ['Operation', 'Operational Planning and Control', 'Design and Development of Products and Services'];
      case 'Performance Evaluation':
        return ['Performance Evaluation', 'Monitoring, Measurement, Analysis and Evaluation', 'Internal Audit', 'Management Review'];
      case 'Improvement':
        return ['Improvement', 'Nonconformity and Corrective Action', 'Continual Improvement'];
      default:
        return [];
    }
  };

  // Prepare subcategories mapping for the UploadModal and DraftModal
  const getSubcategoriesWithSubjects = () => {
    const mapping = {};
    
    // Add Quality Manual categories
    mapping['Quality Manual'] = {};
    
    // For User Guide, add its specific subjects
    mapping['User Guide'] = ['Foreword', 'Table of Contents', 'Objectives of the Quality Manual', 
                           'Background Info of NRCP', 'Authorization', 'Distribution', 'Coding System'];
    
    // For other categories, add default subjects
    const otherCategories = ['Context Organizational', 'Leadership', 'Planning', 'Support', 
                           'Operation', 'Performance Evaluation', 'Improvement'];
    
    otherCategories.forEach(category => {
      switch (category) {
        case 'Context Organizational':
          mapping[category] = ['Overview', 'Organizational Context', 'Stakeholders', 'Scope'];
          break;
        case 'Leadership':
          mapping[category] = ['Leadership and Commitment', 'Policy', 'Organizational Roles, Responsibilities and Authorities'];
          break;
        case 'Planning':
          mapping[category] = ['Planning', 'Quality Objectives', 'Risk and Opportunities', 'Quality Management System and Processes'];
          break;
        case 'Support':
          mapping[category] = ['Support', 'Resources', 'Competence', 'Awareness', 'Communication', 'Documented Information'];
          break;
        case 'Operation':
          mapping[category] = ['Operation', 'Operational Planning and Control', 'Design and Development of Products and Services'];
          break;
        case 'Performance Evaluation':
          mapping[category] = ['Performance Evaluation', 'Monitoring, Measurement, Analysis and Evaluation', 'Internal Audit', 'Management Review'];
          break;
        case 'Improvement':
          mapping[category] = ['Improvement', 'Nonconformity and Corrective Action', 'Continual Improvement'];
          break;
        default:
          mapping[category] = [];
      }
    });
    
    return mapping;
  };

  // Find which PDF a specific page belongs to - FIXED FUNCTION
  const getDocumentForPage = (pageNumber) => {
    // Convert to zero-based index for internal calculations
    const zeroBasedPage = pageNumber - 1;
    
    for (let i = 0; i < pdfPageRanges.length; i++) {
      const range = pdfPageRanges[i];
      if (zeroBasedPage >= range.start && zeroBasedPage <= range.end) {
        return i; // Return the index of the document
      }
    }
    return 0; // Default to the first document if not found
  };

  // Get the file name for the current page - FIXED FUNCTION
  const getFileNameForCurrentPage = () => {
    if (!pdfFile || pdfPageRanges.length === 0) {
      return selectedFile ? selectedFile.name : "No document loaded";
    }
    
    const docIndex = getDocumentForPage(currentPage);
    
    // If we have a valid document index and filename
    if (docIndex >= 0 && docIndex < pdfPageRanges.length && pdfPageRanges[docIndex].fileName) {
      return pdfPageRanges[docIndex].fileName;
    }
    
    // If we have a selected file, return its name
    if (selectedFile && selectedFile.name) {
      return selectedFile.name;
    }
    
    // Find corresponding revision
    const revisionForPage = revisions.find(rev => 
      rev.startPage <= currentPage && 
      (!rev.endPage || rev.endPage >= currentPage)
    );
    
    if (revisionForPage && revisionForPage.fileName) {
      return revisionForPage.fileName;
    }
    
    // Fallback to selected file name
    return selectedFile ? selectedFile.name : "Document";
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
          <button 
            className="add-button" 
            style={{ backgroundColor: 'rgb(0, 123, 255)', color: 'white' }}
            onClick={toggleAddFileModal}
            disabled={!selectedSubcategory || !showDocumentView || !pdfFile}
          >
            Add
          </button>
          <button 
            className="upload-button" 
            style={{ backgroundColor: 'rgb(0, 123, 255)' }}
            onClick={toggleUploadModal}
          >
            Upload
          </button>
          <button 
            className="draft-button" 
            style={{ backgroundColor: 'rgb(0, 123, 255)' }}
            onClick={toggleDraftModal}
          >
            Drafts
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="document-content-area">
        {/* Categories Column */}
        <div className="categories-column">
          {getSubcategories().map((category, index) => (
            <button 
              key={index} 
              className={`category-button ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Subcategories Column */}
        <div className="subcategories-column">
          {getSubjects().map((subcategory, index) => (
            <button 
              key={index} 
              className={`subcategory-button ${selectedSubcategory === subcategory ? 'active' : ''}`}
              onClick={() => handleSubcategoryClick(subcategory)}
            >
              {subcategory}
            </button>
          ))}
        </div>

        {/* Files List */}
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
              {(filesList[selectedSubcategory] || []).map(file => (
                <tr key={file.id}>
                  <td>{file.name}</td>
                  <td>{file.effectiveDate}</td>
                  <td>{file.documentCode}</td>
                  <td>{file.versionCode}</td>
                  <td>
                    <button 
                      className="view-button" 
                      style={{ backgroundColor: 'rgb(0, 123, 255)' }}
                      onClick={() => handleFileClick(file)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {(!filesList[selectedSubcategory] || filesList[selectedSubcategory].length === 0) && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No files available. Upload a file to see it here.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Document View Area */}
        {showDocumentView && (
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
            <div className="pdf-container" style={{ 
              display: 'flex', 
              flexDirection: 'column',
              height: '100%',
              maxHeight: 'calc(100vh - 250px)',
              overflow: 'hidden'
            }}>
              {/* PDF Viewer with updated styles */}
              <div className="pdf-viewer" style={{
                flex: '1',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'auto',
                background: '#f5f5f5',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}>
                {pdfFile ? (
                  <Document 
                    file={pdfFile} 
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={(error) => console.error('Error loading PDF:', error)}
                    className="pdf-document"
                  >
                    <div style={{
                      padding: '5px',
                      background: 'white',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                      maxHeight: '100%',
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      <Page 
                        pageNumber={currentPage}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        scale={scale}
                        onLoadSuccess={onPageLoadSuccess}
                        className="pdf-page"
                        height={isPortrait ? window.innerHeight * 0.65 : null}
                        style={{
                          maxHeight: isPortrait ? '100%' : 'auto'
                        }}
                      />
                    </div>
                  </Document>
                ) : (
                  <div className="pdf-placeholder">
                    <p>No document selected. Please upload a PDF document.</p>
                  </div>
                )}
              </div>

              {/* Zoom Controls */}
              <div className="zoom-controls" style={{
                marginTop: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px'
              }}>
                <button onClick={zoomOut} className="zoom-button" title="Zoom Out" type="button">-</button>
                <span>{Math.round(scale * 100)}%</span>
                <button onClick={zoomIn} className="zoom-button" title="Zoom In" type="button">+</button>
                <button onClick={resetZoom} className="reset-zoom-button" title="Reset Zoom" type="button">Reset</button>
              </div>

              {/* Page Navigation with source indicator */}
              <div className="page-navigation" style={{
                marginTop: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px'
              }}>
                <button 
                  onClick={prevPage} 
                  className="nav-button"
                  disabled={currentPage <= 1}
                  type="button"
                >
                  ◀
                </button>
                <span>
                  Page {currentPage} of {numPages || 0}
                  {pdfFile && (
                    <span className="source-indicator">
                      {' '}({getFileNameForCurrentPage()})
                    </span>
                  )}
                </span>
                <button 
                  onClick={nextPage} 
                  className="nav-button"
                  disabled={currentPage >= (numPages || 0)}
                  type="button"
                >
                  ▶
                </button>
              </div>
            </div>

            {/* Previous Versions Section */}
            <div className="previous-versions-section">
              <h3 className="section-title">Previous Versions:</h3>
              <div className="revisions-list">
                {revisions.length > 0 ? (
                  revisions.map(revision => (
                    <div 
                      key={revision.id} 
                      className={`revision-item ${revision.selected ? 'selected' : ''}`}
                      onClick={() => handleRevisionSelect(revision.id)}
                    >
                      <div className="revision-details">
                        <div className="revision-subject">{revision.subject}</div>
                        <div className="revision-text">{revision.revision}</div>
                        <div className="revision-date">{revision.date}</div>
                        {/* Display the start page */}
                        <div className="revision-page-start">
                          Page Start: {revision.startPage || 1}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-revisions">No previous versions available.</div>
                )}
              </div>
            </div>

            {/* Document Info Section */}
            <div className="document-info-section">
              <div className="info-row">
                <div className="info-label">Document Code</div>
                <div className="info-value">{documentInfo.documentCode}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Version Number</div>
                <div className="info-value">{documentInfo.revisionNumber}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Effectivity Date</div>
                <div className="info-value">{documentInfo.effectiveDate}</div>
              </div>
            </div>

            {/* Back to List Button */}
            <div className="document-actions">
              <button 
                className="back-button" 
                style={{ backgroundColor: 'rgb(0, 123, 255)' }}
                onClick={handleBackToList}
                type="button"
              >
                Back to List
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal 
          onClose={toggleUploadModal} 
          categories={['Quality Manual']}
          subcategories={getSubcategoriesWithSubjects()}
          setPdfFile={handleSetPdfFile}
          onSaveDraft={handleSaveDraft}
        />
      )}

      {/* Draft Modal */}
      {showDraftModal && (
        <DraftModal
          onClose={toggleDraftModal}
          drafts={drafts}
          onSaveDraft={handleSaveDraft}
          categories={['Quality Manual']}
          subcategories={getSubcategoriesWithSubjects()}
          setPdfFile={handleSetPdfFile}
        />
      )}

      {/* Add File Modal */}
      {showAddFileModal && (
        <AddFileModal 
          onClose={toggleAddFileModal}
          onAddFile={handleAddFile}
        />
      )}
    </div>
  );
};

export default DocumentControl;

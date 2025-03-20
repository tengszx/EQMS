import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import '../../../css/styles/admin/DocumentControl.css';
import { Document, Page, pdfjs } from 'react-pdf';
import UploadModal from '../../../js/modal/UploadModal';
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
            className="primary-button" 
            style={{ backgroundColor: 'rgb(0, 123, 255)' }}
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
  const [scale, setScale] = useState(0.8);
  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });
  const [documentInfo, setDocumentInfo] = useState({
    documentCode: '',
    revisionNumber: '',
    effectiveDate: ''
  });

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
    }
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
          startPageNumber: startPage + 1 // Human-readable page number (1-based)
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
            startPage: startPage // Add the starting page information
          };
          
          // Update revisions and mark the new one as selected
          setRevisions(
            revisions.map(rev => ({ ...rev, selected: false })).concat(newRevision)
          );
          
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
    if (selectedCategory === 'User Guide') {
      return ['Foreword', 'Table of Contents', 'Objectives of the Quality Manual', 
              'Background Info of NRCP', 'Authorization', 'Distribution', 'Coding System'];
    } else if (selectedCategory) {
      // Return default subjects for other categories
      return ['Overview', 'Requirements', 'Process', 'Documentation'];
    }
    return [];
  };

  // Prepare subcategories mapping for the UploadModal
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
      mapping[category] = ['Overview', 'Requirements', 'Process', 'Documentation'];
    });
    
    return mapping;
  };

  // Find which PDF a specific page belongs to
  const getDocumentForPage = (pageNumber) => {
    for (let i = 0; i < pdfPageRanges.length; i++) {
      const range = pdfPageRanges[i];
      if (pageNumber >= range.start + 1 && pageNumber <= range.end + 1) {
        return i; // Return the index of the document
      }
    }
    return 0; // Default to the first document if not found
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
            style={{ backgroundColor: 'rgb(0, 123, 255)' }}
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
        {selectedManual && (
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
        )}

        {/* Subcategories Column */}
        {selectedCategory && (
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

              {/* Page Navigation with source indicator */}
              <div className="page-navigation">
                <button 
                  onClick={prevPage} 
                  className="nav-button"
                  disabled={currentPage <= 1}
                >
                  ◀
                </button>
                <span>
                  Page {currentPage} of {numPages || 0}
                  {pdfPageRanges.length > 1 && (
                    <span className="source-indicator">
                      {' '}(Document {getDocumentForPage(currentPage) + 1})
                    </span>
                  )}
                </span>
                <button 
                  onClick={nextPage} 
                  className="nav-button"
                  disabled={currentPage >= (numPages || 0)}
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
                      <input 
                        type="checkbox" 
                        checked={revision.selected} 
                        onChange={() => handleRevisionSelect(revision.id)}
                      />
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
              <button 
                className="back-button" 
                style={{ backgroundColor: 'rgb(0, 123, 255)' }}
                onClick={handleBackToList}
              >
                Back to List
              </button>
              <button 
                className="save-button" 
                style={{ backgroundColor: 'rgb(0, 123, 255)' }}
                onClick={handleSave}
              >
                Save
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
        />
      )}

      {/* Draft Modal */}
      {showDraftModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">Drafts</h3>
              <button className="close-button" onClick={toggleDraftModal}>×</button>
            </div>
            <div className="modal-body">
              <p>No drafts available.</p>
            </div>
            <div className="form-actions">
              <button className="secondary-button" onClick={toggleDraftModal}>Close</button>
            </div>
          </div>
        </div>
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

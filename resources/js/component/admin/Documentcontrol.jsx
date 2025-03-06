import React, { useState, useRef } from 'react';
import { Upload, FileText, Trash2, PlusCircle, Eye, Save } from 'lucide-react';
import '../../../css/styles/admin/DocumentControl.css';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';

const DocumentControl = () => {
  // Create plugin instances
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const zoomPluginInstance = zoomPlugin();

  const [documents, setDocuments] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showDraftForm, setShowDraftForm] = useState(false);
  const [showViewDocument, setShowViewDocument] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [formData, setFormData] = useState({
    fileName: "",
    version: "",
    accessName: "",
    section: "",
    startDate: "",
    endDate: "",
    documentCode: "",
    revisionNumber: "",
    pageNumber: "",
    references: [],
    fileUrl: null,
    folder: ""
  });
  
  // PDF viewer state
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [showFolderFilesModal, setShowFolderFilesModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const fileInputRef = useRef(null);
  const referenceFileInputRef = useRef(null);

  const sectionOptions = [
    "User Guide", 
    "Quality Management", 
    "Organize Context", 
    "Leadership",
    "Planning",
    "Support", 
    "Operation",
    "Performance Evaluation", 
    "Improvement"
  ];

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleRowClick = (id) => {
    setSelectedId(id);
    const doc = documents.find(d => d.id === id);
    if (doc) {
      setSelectedDocument(doc);
    }
  };

  const handleDocumentDoubleClick = (doc) => {
    setSelectedFolder(doc.folder);
    setShowFolderFilesModal(true);
  };

  const handleFileSelected = (doc) => {
    setSelectedDocument(doc);
    setShowFolderFilesModal(false);
    setShowViewDocument(true);
  };

  const handleUploadClick = () => {
    setFormData({
      fileName: "",
      version: "",
      accessName: "",
      section: "",
      startDate: "",
      endDate: "",
      documentCode: "",
      revisionNumber: "",
      pageNumber: "",
      references: [],
      fileUrl: null,
      folder: ""
    });
    setShowUploadForm(true);
  };

  const handleDraftClick = () => {
    setShowDraftForm(true);
  };

  const handleDeleteClick = () => {
    if (selectedId) {
      setDocuments(documents.filter(doc => doc.id !== selectedId));
      setSelectedId(null);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        fileName: file.name,
        fileUrl: fileUrl
      });
    }
  };

  const handleReferenceFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      // Add reference to the list
      const newReference = {
        id: Date.now(),
        name: file.name,
        file: URL.createObjectURL(file)
      };
      
      setFormData({
        ...formData,
        references: [...formData.references, newReference]
      });
    }
  };

  const handleRemoveReference = (id) => {
    setFormData({
      ...formData,
      references: formData.references.filter(ref => ref.id !== id)
    });
  };

  // Handle both Save and Save as Draft actions
  const handleFormSubmit = (isDraft) => {
    if (isDraft) {
      // Save as draft
      setDrafts([...drafts, { ...formData, id: Date.now() }]);
      setShowUploadForm(false);
    } else {
      // Check if folder is selected
      if (!formData.folder) {
        alert("Please select a folder");
        return;
      }
      
      // Create a new document with the selected folder
      const newDocument = {
        id: Date.now(),
        folder: formData.folder,
        name: formData.fileName,
        version: formData.version,
        section: formData.section,
        startDate: formData.startDate,
        endDate: formData.endDate,
        documentCode: formData.documentCode,
        revisionNumber: formData.revisionNumber,
        pageNumber: formData.pageNumber,
        references: formData.references,
        fileUrl: formData.fileUrl
      };
      
      setDocuments([...documents, newDocument]);
      setShowUploadForm(false);
    }

    // Reset form data
    setFormData({
      fileName: "",
      version: "",
      accessName: "",
      section: "",
      startDate: "",
      endDate: "",
      documentCode: "",
      revisionNumber: "",
      pageNumber: "",
      references: [],
      fileUrl: null,
      folder: ""
    });
  };

  const handleEditDraft = (draft) => {
    setFormData({
      ...draft
    });
    setShowUploadForm(true);
  };

  const handleDeleteDraft = (draftId) => {
    setDrafts(drafts.filter(draft => draft.id !== draftId));
  };

  const handleNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handlePrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleZoomIn = () => {
    setScale(scale + 0.1);
  };

  const handleZoomOut = () => {
    if (scale > 0.5) {
      setScale(scale - 0.1);
    }
  };

  // Get unique folders to avoid duplicates in dropdown
  const getUniqueFolders = () => {
    const folderSet = new Set();
    documents.forEach(doc => {
      if (doc.folder) {
        folderSet.add(doc.folder);
      }
    });
    return Array.from(folderSet);
  };

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(filter.toLowerCase()) ||
    doc.folder.toLowerCase().includes(filter.toLowerCase()) ||
    (doc.section && doc.section.toLowerCase().includes(filter.toLowerCase()))
  );

  // Get list of unique folders for dropdown
  const uniqueFolders = getUniqueFolders();
  
  const isFormEmpty = !formData.fileName;

  // Function to handle document load success
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const handleAddFolderClick = () => {
    setShowAddFolderModal(true);
  };

  const handleAddFolderSubmit = () => {
    // Check if folder already exists
    if (uniqueFolders.includes(folderName)) {
      alert("Folder already exists");
      return;
    }
    
    const newFolder = {
      id: Date.now(),
      folder: folderName,
      name: '',
      version: '',
      section: '',
      startDate: '',
      endDate: '',
      references: []
    };
    setDocuments([...documents, newFolder]);
    setShowAddFolderModal(false);
    setFolderName('');
  };

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
    setShowFolderFilesModal(true);
  };

  const handleBackToFolderFiles = () => {
    setShowViewDocument(false);
    setShowFolderFilesModal(true);
  };

  return (
    <div className="document-control-container">
      <div className="document-header">
        <h2>Document Control</h2>
        <div className="filter-container">
          <input 
            type="text" 
            placeholder="FILTER" 
            value={filter} 
            onChange={handleFilterChange}
            className="filter-input"
          />
        </div>
      </div>
      
      <div className="document-table">
        <div className="table-header">
          <div className="folder-col">Folder</div>
        </div>
        
        <div className="table-body">
          {filteredDocuments.length > 0 ? (
            // Group documents by folder and display each folder only once
            uniqueFolders.map((folderName) => (
              <div 
                key={folderName} 
                className={`table-row ${documents.find(doc => doc.folder === folderName && doc.id === selectedId) ? 'selected' : ''}`}
                onClick={() => {
                  const doc = documents.find(doc => doc.folder === folderName);
                  if (doc) handleRowClick(doc.id);
                }}
                onDoubleClick={() => handleFolderClick(folderName)}
              >
                <div className="folder-col">
                  <div className="folder-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.5 2.5H6.5L8 4H14.5V13.5H1.5V2.5Z" fill="#4d7dfc" />
                    </svg>
                  </div>
                  <span onClick={() => handleFolderClick(folderName)}>{folderName}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-files-message">
              No File Found
            </div>
          )}
        </div>
      </div>
      
      <div className="action-buttons-container">
        <button 
          className={`delete-button ${!selectedId ? 'disabled' : ''}`} 
          onClick={handleDeleteClick}
          disabled={!selectedId}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2H14V4H2V2Z" fill="#dc3545"/>
            <path d="M3 4H13V14C13 14.55 12.55 15 12 15H4C3.45 15 3 14.55 3 14V4Z" fill="#dc3545"/>
            <path d="M7 6V12H9V6H7Z" fill="white"/>
          </svg>
          <span>Delete</span>
        </button>
        <button className="draft-button" onClick={handleDraftClick}>
          <FileText size={16} />
          <span>Draft{drafts.length > 0 ? ` (${drafts.length})` : ''}</span>
        </button>
        <button className="upload-button" onClick={handleUploadClick}>
          <Upload size={16} />
          <span>Upload</span>
        </button>
        <button className="add-folder-button" onClick={handleAddFolderClick}>
          <PlusCircle size={16} />
          <span>Add Folder</span>
        </button>
      </div>

      {/* Enhanced Upload Form Modal with Save as Draft button */}
      {showUploadForm && (
        <div className="modal-overlay">
          <div className="modal-container upload-modal">
            <div className="modal-header">
              <h3>Upload Document</h3>
              <button className="close-button" onClick={() => setShowUploadForm(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group file-upload-group">
                  <label>File / Attachment *</label>
                  <div className="file-input-container">
                    <input 
                      type="text" 
                      value={formData.fileName}
                      placeholder="Select a file"
                      readOnly
                      onClick={() => fileInputRef.current.click()}
                    />
                    <button 
                      className="upload-btn"
                      onClick={() => fileInputRef.current.click()}
                    >
                      UPLOAD
                    </button>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Folder</label>
                  <select 
                    name="folder" 
                    value={formData.folder}
                    onChange={handleFormChange}
                  >
                    <option value="">Select a folder</option>
                    {uniqueFolders.map(folder => (
                      <option key={folder} value={folder}>{folder}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input 
                    type="text" 
                    name="accessName" 
                    value={formData.accessName}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Section *</label>
                  <select 
                    name="section" 
                    value={formData.section}
                    onChange={handleFormChange}
                  >
                    <option value="">Select a section</option>
                    {sectionOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Document Code</label>
                  <input 
                    type="text" 
                    name="documentCode" 
                    value={formData.documentCode}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Revision Number</label>
                  <input 
                    type="text" 
                    name="revisionNumber" 
                    value={formData.revisionNumber}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label>Page Number</label>
                  <input 
                    type="text" 
                    name="pageNumber" 
                    value={formData.pageNumber}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Element Name *</label>
                  <input 
                    type="text" 
                    name="version" 
                    value={formData.version}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label>Effectivity Date</label>
                  <input 
                    type="date" 
                    name="startDate" 
                    value={formData.startDate}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="form-group reference-section">
                <div className="reference-header">
                  <label>Reference:</label>
                  <button 
                    className="add-reference-btn"
                    onClick={() => referenceFileInputRef.current.click()}
                  >
                    <PlusCircle size={16} />
                    <span>Add Reference</span>
                  </button>
                  <input 
                    ref={referenceFileInputRef}
                    type="file" 
                    style={{ display: 'none' }}
                    onChange={handleReferenceFileChange}
                  />
                </div>
                <div className="reference-list">
                  {formData.references.length > 0 ? (
                    formData.references.map((ref) => (
                      <div key={ref.id} className="reference-item">
                        <div className="reference-name">{ref.name}</div>
                        <button 
                          className="remove-reference-btn"
                          onClick={() => handleRemoveReference(ref.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="no-references">No references added</div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {/* Added Save as Draft button */}
              <button 
                className="draft-save-button" 
                onClick={() => handleFormSubmit(true)}
                disabled={isFormEmpty}
              >
                <Save size={16} />
                <span>Save as Draft</span>
              </button>
              <button 
                className="save-button" 
                onClick={() => handleFormSubmit(false)}
                disabled={isFormEmpty}
              >
                SAVE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Draft Form Modal */}
      {showDraftForm && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Draft Documents</h3>
              <button className="close-button" onClick={() => setShowDraftForm(false)}>×</button>
            </div>
            <div className="modal-body draft-list">
              {drafts.length > 0 ? (
                drafts.map(draft => (
                  <div key={draft.id} className="draft-item">
                    <div className="draft-info">
                      <div className="draft-name">{draft.fileName || "Untitled"}</div>
                      <div className="draft-details">
                        <span>Version: {draft.version || "N/A"}</span>
                        <span>Access: {draft.accessName || "N/A"}</span>
                        {draft.section && <span>Section: {draft.section}</span>}
                      </div>
                    </div>
                    <div className="draft-actions">
                      <button 
                        className="draft-delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDraft(draft.id);
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                      <button 
                        className="edit-button"
                        onClick={() => {
                          handleEditDraft(draft);
                          setShowDraftForm(false);
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="upload-draft-button"
                        onClick={() => {
                          const newDocument = {
                            id: Date.now(),
                            folder: draft.folder,
                            name: draft.fileName,
                            version: draft.version,
                            section: draft.section,
                            startDate: draft.startDate,
                            endDate: draft.endDate,
                            documentCode: draft.documentCode,
                            revisionNumber: draft.revisionNumber,
                            pageNumber: draft.pageNumber,
                            references: draft.references,
                            fileUrl: draft.fileUrl
                          };
                          
                          setDocuments([...documents, newDocument]);
                          setDrafts(drafts.filter(d => d.id !== draft.id));
                          setShowDraftForm(false);
                        }}
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-drafts-message">
                  No drafts available
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button 
                className="secondary-button" 
                onClick={() => setShowDraftForm(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Folder Modal */}
      {showAddFolderModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Add Folder</h3>
              <button className="close-button" onClick={() => setShowAddFolderModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Folder Name</label>
                <input 
                  type="text" 
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="save-button" 
                onClick={handleAddFolderSubmit}
              >
                SAVE
              </button>
              <button 
                className="secondary-button" 
                onClick={() => setShowAddFolderModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Folder Files Modal */}
      {showFolderFilesModal && selectedFolder && (
        <div className="modal-overlay">
          <div className="modal-container folder-files-modal">
            <div className="modal-header">
              <h3>Files in {selectedFolder}</h3>
              <button className="close-button" onClick={() => setShowFolderFilesModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="folder-files-table">
                <div className="table-header">
                  <div className="name-col">Name</div>
                  <div className="version-col">Version</div>
                  <div className="section-col">Section</div>
                  <div className="revision-number-col">Revision Number</div>
                  <div className="subject-col">Subject</div>
                  <div className="element-name-col">Element Name</div>
                  <div className="document-code-col">Document Code</div>
                </div>
                <div className="table-body">
                  {documents.filter(doc => doc.folder === selectedFolder && doc.name).map((doc) => (
                    <div key={doc.id} className="table-row" onClick={() => handleFileSelected(doc)}>
                      <div className="name-col">{doc.name}</div>
                      <div className="version-col">{doc.version}</div>
                      <div className="section-col">{doc.section}</div>
                      <div className="revision-number-col">{doc.revisionNumber}</div>
                      <div className="subject-col">{doc.accessName}</div>
                      <div className="element-name-col">{doc.version}</div>
                      <div className="document-code-col">{doc.documentCode}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Document View Modal with PDF Viewer */}
      {showViewDocument && selectedDocument && (
        <div className="modal-overlay">
          <div className="modal-container view-document-modal">
            <div className="modal-header">
              <h3>{selectedDocument.name}</h3>
              <button 
                className="back-button"
                onClick={handleBackToFolderFiles}
              >
                Back
              </button>
            </div>
            <div className="modal-body">
              <div className="document-details">
                <div className="details-row">
                  <div className="detail-item">
                    <label>Section:</label>
                    <span>{selectedDocument.section || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <label>Document Code:</label>
                    <span>{selectedDocument.documentCode || "N/A"}</span>
                  </div>
                </div>
                <div className="details-row">
                  <div className="detail-item">
                    <label>Revision Number:</label>
                    <span>{selectedDocument.revisionNumber || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <label>Page Number:</label>
                    <span>{selectedDocument.pageNumber || "N/A"}</span>
                  </div>
                </div>
                <div className="details-row">
                  <div className="detail-item">
                    <label>Effectivity Date:</label>
                    <span>{selectedDocument.startDate || "N/A"}</span>
                  </div>
                </div>
              </div>
              
              {/* PDF Viewer */}
              <div className="pdf-viewer">
                {selectedDocument.name.toLowerCase().endsWith('.pdf') && selectedDocument.fileUrl ? (
                  <div className="pdf-container">
                    <div className="pdf-document">
                      <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                        <Viewer 
                          fileUrl={selectedDocument.fileUrl}
                          plugins={[defaultLayoutPluginInstance, zoomPluginInstance]}
                          onDocumentLoad={onDocumentLoadSuccess}
                          defaultScale={scale}
                        />
                      </Worker>
                    </div>
                  </div>
                ) : (
                  <div className="pdf-placeholder">
                    <FileText size={48} />
                    <p>Document Preview - {selectedDocument.name}</p>
                  </div>
                )}
              </div>

              {selectedDocument.references && selectedDocument.references.length > 0 && (
                <div className="references-section">
                  <h4>References</h4>
                  <div className="reference-items">
                    {selectedDocument.references.map(ref => (
                      <div key={ref.id} className="reference-view-item">
                        <FileText size={16} />
                        <span>{ref.name}</span>
                        <button className="view-reference-btn">
                          <Eye size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button 
                className="secondary-button" 
                onClick={() => setShowViewDocument(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentControl;
  import React, { useState } from 'react';
  import { Upload, FileText, Trash2 } from 'lucide-react'; // Importing Trash2 icon
  import '../../../css/styles/admin/DocumentControl.css';

  const DocumentControl = () => {
    const [documents, setDocuments] = useState([
      {
        id: 1,
        folder: "Documents",
        name: "companies_demo_export.xlsx",
        version: "2021-11-04 11:54",
        role: ""
      },
      {
        id: 2,
        folder: "Download Center",
        name: "demo_image.jpg",
        version: "2021-11-03 22:00",
        role: ""
      },
      {
        id: 3,
        folder: "Report",
        name: "sample_demo_export.xlsx",
        version: "2021-11-02 11:09",
        role: ""
      },
      {
        id: 4,
        folder: "Other",
        name: "visit_demo_export.xlsx",
        version: "2021-10-31 17:24",
        role: ""
      }
    ]);

    const [drafts, setDrafts] = useState([]);
    const [filter, setFilter] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [showDraftForm, setShowDraftForm] = useState(false);
    const [formData, setFormData] = useState({
      fileName: "",
      version: "",
      accessName: ""
    });

    const handleFilterChange = (e) => {
      setFilter(e.target.value);
    };

    const handleRowClick = (id) => {
      setSelectedId(id);
    };

    const handleUploadClick = () => {
      setFormData({
        fileName: "",
        version: "",
        accessName: ""
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

    const handleFormSubmit = (isDraft) => {
      if (isDraft) {
        setDrafts([...drafts, { ...formData, id: Date.now() }]);
        setShowUploadForm(false);
      } else {
        const newDocument = {
          id: documents.length + 1,
          folder: "Documents",
          name: formData.fileName,
          version: formData.version,
          role: formData.accessName
        };
        
        setDocuments([...documents, newDocument]);
        setShowUploadForm(false);
      }
      
      setFormData({
        fileName: "",
        version: "",
        accessName: ""
      });
    };

    const handleEditDraft = (draft) => {
      setFormData({
        fileName: draft.fileName,
        version: draft.version,
        accessName: draft.accessName
      });
      setShowUploadForm(true);
    };

    const handleDeleteDraft = (draftId) => {
      setDrafts(drafts.filter(draft => draft.id !== draftId));
    };

    const filteredDocuments = documents.filter(doc => 
      doc.name.toLowerCase().includes(filter.toLowerCase()) ||
      doc.folder.toLowerCase().includes(filter.toLowerCase())
    );

    const isFormEmpty = !formData.fileName && !formData.version && !formData.accessName;

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
            <div className="name-col">Name</div>
            <div className="version-col">Version</div>
            <div className="role-col">Role</div>
          </div>
          
          <div className="table-body">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <div 
                  key={doc.id} 
                  className={`table-row ${doc.id === selectedId ? 'selected' : ''}`}
                  onClick={() => handleRowClick(doc.id)}
                >
                  <div className="folder-col">
                    <div className="folder-icon">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.5 2.5H6.5L8 4H14.5V13.5H1.5V2.5Z" fill="#4d7dfc" />
                      </svg>
                    </div>
                    <span>{doc.folder}</span>
                  </div>
                  <div className="name-col">{doc.name}</div>
                  <div className="version-col">{doc.version}</div>
                  <div className="role-col">{doc.role}</div>
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
        </div>

        {/* Upload Form Modal */}
        {showUploadForm && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h3>Upload Document</h3>
                <button className="close-button" onClick={() => setShowUploadForm(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>File Name:</label>
                  <input 
                    type="text" 
                    name="fileName" 
                    value={formData.fileName}
                    onChange={handleFormChange}
                    placeholder="Enter file name"
                  />
                </div>
                <div className="form-group">
                  <label>Version:</label>
                  <input 
                    type="text" 
                    name="version" 
                    value={formData.version}
                    onChange={handleFormChange}
                    placeholder="Enter version"
                  />
                </div>
                <div className="form-group">
                  <label>Name who can access:</label>
                  <input 
                    type="text" 
                    name="accessName" 
                    value={formData.accessName}
                    onChange={handleFormChange}
                    placeholder="Enter access name"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="secondary-button" 
                  onClick={() => handleFormSubmit(true)}
                >
                  Save as Draft
                </button>
                <button 
                  className="primary-button" 
                  onClick={() => handleFormSubmit(false)}
                  disabled={isFormEmpty} // Disable if form is empty
                >
                  Done
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
                          <Trash2 size={16} /> {/* Using Trash2 icon */}
                        </button>
                        <button 
                          className="edit-button"
                          onClick={() => {
                            handleEditDraft(draft);
                            setShowDraftForm(false); // Close the draft modal
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className="upload-draft-button"
                          onClick={() => {
                            const newDocument = {
                              id: documents.length + 1,
                              folder: "Documents",
                              name: draft.fileName,
                              version: draft.version,
                              role: draft.accessName
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
      </div>
    );
  };

  export default DocumentControl;
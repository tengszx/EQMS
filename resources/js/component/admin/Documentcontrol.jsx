import React, { useState } from 'react';
import { Upload } from 'lucide-react';
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
    },
    {
      id: 5,
      folder: "Download Center",
      name: "demo_image.jpg",
      version: "2021-11-03 22:00",
      role: ""
    },
    {
      id: 6,
      folder: "Report",
      name: "sample_demo_export.xlsx",
      version: "2021-11-02 11:09",
      role: ""
    },
    {
      id: 7,
      folder: "Other",
      name: "visit_demo_export.xlsx",
      version: "2021-10-31 17:24",
      role: ""
    },
    {
      id: 8,
      folder: "Download Center",
      name: "demo_image.jpg",
      version: "2021-11-03 22:00",
      role: ""
    },
    {
      id: 9,
      folder: "Report",
      name: "sample_demo_export.xlsx",
      version: "2021-11-02 11:09",
      role: ""
    },
    {
      id: 10,
      folder: "Other",
      name: "visit_demo_export.xlsx",
      version: "2021-10-31 17:24",
      role: ""
    }
  ]);

  const [filter, setFilter] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleRowClick = (id) => {
    setSelectedId(id);
  };

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(filter.toLowerCase()) ||
    doc.folder.toLowerCase().includes(filter.toLowerCase())
  );

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
      
      <div className="upload-button-container">
        <button className="upload-button">
          <Upload size={16} />
          <span>Upload</span>
        </button>
      </div>
    </div>
  );
};

export default DocumentControl;
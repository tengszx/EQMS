import React, { useState, useEffect } from 'react';
import '../../css/styles/modal/UploadModal.css';

const UploadModal = ({ onClose, categories, subcategories, setPdfFile, draftToEdit = null, onSaveDraft }) => {
  const [selectedSection, setSelectedSection] = useState(draftToEdit ? draftToEdit.section : '');
  const [selectedSubject, setSelectedSubject] = useState(draftToEdit ? draftToEdit.subject : '');
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [file, setFile] = useState(draftToEdit ? draftToEdit.file : null);
  const [fileName, setFileName] = useState(draftToEdit ? draftToEdit.fileName : '');
  const [documentCode, setDocumentCode] = useState(draftToEdit ? draftToEdit.documentCode || '' : '');
  const [versionCode, setVersionCode] = useState(draftToEdit ? draftToEdit.versionCode || '' : '');
  const [effectiveDate, setEffectiveDate] = useState(draftToEdit ? draftToEdit.effectiveDate || '' : '');
  const [draftId, setDraftId] = useState(draftToEdit ? draftToEdit.id : null);
  const [isEditMode, setIsEditMode] = useState(Boolean(draftToEdit));
  const [formIsValid, setFormIsValid] = useState(false);
  
  useEffect(() => {
    const requiredFieldsFilled = Boolean(selectedSection && selectedSubject && file);
    setFormIsValid(requiredFieldsFilled);
  }, [selectedSection, selectedSubject, file]);

  useEffect(() => {
    if (selectedSection) {
      if (selectedSection === 'Quality Manual') {
        const allSubcategories = Object.keys(subcategories);
        setAvailableSubjects(allSubcategories);
      } else if (subcategories[selectedSection]) {
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
      setFileName(selectedFile.name);
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
    if (formIsValid) {
      setPdfFile(file, documentCode, versionCode, effectiveDate, selectedSection, selectedSubject);
      onClose();
    }
  };

  const handleSaveAsDraft = () => {
    if (formIsValid) {
      const draftData = {
        id: draftId || Date.now(),
        file: file,
        fileName: fileName,
        documentCode: documentCode,
        versionCode: versionCode,
        effectiveDate: effectiveDate,
        section: selectedSection,
        subject: selectedSubject,
        title: `${selectedSection} - ${selectedSubject}`,
        lastModified: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      };
      
      if (onSaveDraft) {
        onSaveDraft(draftData);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3 className="modal-title">{isEditMode ? 'Edit Draft Document' : 'Upload Document'}</h3>
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
                {availableSubjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
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
          {fileName && <div className="file-name">{fileName}</div>}
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
            onClick={handleUpload}
            disabled={!formIsValid}
          >
            Upload
          </button>
          <button 
            className="save-as-draft-button" 
            onClick={handleSaveAsDraft}
            disabled={!formIsValid}
          >
            {isEditMode ? 'Update Draft' : 'Save as Draft'}
          </button>
          <button className="secondary-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
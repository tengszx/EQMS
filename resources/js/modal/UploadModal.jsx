import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const UploadModal = ({ onClose, categories, subcategories, setPdfFile, isAddMode = false, currentSection = '', currentSubject = '' }) => {
  const [formData, setFormData] = useState({
    section: '',
    subject: '',
    file: null,
    effectiveDate: '',
  });
  
  // Initialize form data with current section and subject if in add mode
  useEffect(() => {
    if (isAddMode && currentSection && currentSubject) {
      setFormData(prev => ({
        ...prev,
        section: currentSection,
        subject: currentSubject
      }));
    }
  }, [isAddMode, currentSection, currentSubject]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'file' && files) {
      setFormData({
        ...formData,
        file: files[0]
      });
    } else if (name === 'section') {
      setFormData({
        ...formData,
        section: value,
        subject: '' // Reset subject when section changes
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.file) {
      // Process form submission logic would go here
      console.log('Submitting:', formData);
      
      // Set the PDF file in the parent component
      setPdfFile(formData.file);
      onClose();
    } else {
      alert('Please select a PDF file');
    }
  };
  
  const handleSaveAsDraft = () => {
    // Logic to save as draft would go here
    console.log('Saving as draft:', formData);
    onClose();
  };

  // Get available subjects based on selected section
  const availableSubjects = formData.section ? subcategories[formData.section] : [];
  
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">{isAddMode ? 'Add Document Pages' : 'Upload Document'}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label className="form-label">Section</label>
            <select 
              name="section" 
              className="form-control" 
              value={formData.section}
              onChange={handleChange}
              required
              disabled={isAddMode}
            >
              <option value="">Select Section</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Subject</label>
            <select 
              name="subject" 
              className="form-control" 
              value={formData.subject}
              onChange={handleChange}
              required
              disabled={!formData.section || isAddMode}
            >
              <option value="">Select Subject</option>
              {availableSubjects && availableSubjects.map((subject, index) => (
                <option key={index} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">{isAddMode ? 'Additional Pages (PDF)' : 'Document File (PDF)'}</label>
            <input 
              type="file" 
              name="file" 
              accept=".pdf" 
              className="form-control" 
              onChange={handleChange}
              required
            />
            {formData.file && (
              <div className="file-info">
                Selected file: {formData.file.name} ({Math.round(formData.file.size / 1024)} KB)
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">Effective Date</label>
            <input 
              type="date" 
              name="effectiveDate" 
              className="form-control" 
              value={formData.effectiveDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="secondary-button" 
              onClick={handleSaveAsDraft}
            >
              Save as Draft
            </button>
            <button 
              type="submit" 
              className="primary-button"
            >
              {isAddMode ? 'Add Pages' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
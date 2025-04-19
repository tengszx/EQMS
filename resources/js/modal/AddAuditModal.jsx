import React from 'react';
import '../../css/styles/modal/AddAuditModal.css';

const AddAuditModal = ({ 
  showModal, 
  closeModal, 
  newAudit, 
  handleInputChange, 
  handleSaveAudit, 
  isEditMode 
}) => {
  if (!showModal) return null;
  
  return (
    <div className="audit-modal-overlay">
      <div className="audit-modal-content">
        <div className="audit-modal-header">
          <h2>{isEditMode ? 'Edit Audit' : 'Add New Audit'}</h2>
          <button className="audit-close-button" onClick={closeModal}>×</button>
        </div>
        <div className="audit-modal-body">
          <div className="audit-form-grid">
            <div className="audit-form-group">
              <label htmlFor="id">Audit ID</label>
              <div className="audit-id-input-container">
                <span className="audit-id-prefix">AUD-</span>
                <input
                  type="text"
                  id="id"
                  name="id"
                  value={newAudit.id}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter numbers only"
                  className="audit-id-input"
                  disabled={isEditMode}
                />
              </div>
            </div>
            
            <div className="audit-form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newAudit.title}
                onChange={handleInputChange}
                required
                placeholder="Enter audit title"
              />
            </div>
            
            <div className="audit-form-group">
              <label htmlFor="type">Type</label>
              <select
                id="type"
                name="type"
                value={newAudit.type}
                onChange={handleInputChange}
                required
                className="audit-select"
              >
                <option value="Internal">Internal</option>
                <option value="External">External</option>
              </select>
            </div>
            
            <div className="audit-form-group">
              <label htmlFor="scope">Scope</label>
              <input
                type="text"
                id="scope"
                name="scope"
                value={newAudit.scope}
                onChange={handleInputChange}
                required
                placeholder="Enter audit scope"
              />
            </div>
            
            <div className="audit-form-group">
              <label htmlFor="auditor">Auditor</label>
              <input
                type="text"
                id="auditor"
                name="auditor"
                value={newAudit.auditor}
                onChange={handleInputChange}
                required
                placeholder="Text characters only"
              />
            </div>
            
            <div className="audit-form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={newAudit.date}
                onChange={handleInputChange}
                required
                className="audit-date-input"
              />
            </div>
            
            <div className="audit-form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={newAudit.status}
                onChange={handleInputChange}
                required
                className="audit-select"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Complete">Complete</option>
                <option value="Incomplete">Incomplete</option>
              </select>
            </div>
          </div>
        </div>
        <div className="audit-modal-footer">
          <button className="audit-cancel-button" onClick={closeModal}>Cancel</button>
          <button 
            className="audit-add-button"
            onClick={handleSaveAudit}
            disabled={!newAudit.title || !newAudit.scope || !newAudit.auditor || !newAudit.date}
          >
            {isEditMode ? 'Save Changes' : 'Add Audit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAuditModal;
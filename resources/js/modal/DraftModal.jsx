import React, { useState } from 'react';
import { X, Edit, Trash2, Upload } from 'lucide-react';

const DraftModal = ({ onClose }) => {
  // Mock drafts for demonstration
  const [drafts, setDrafts] = useState([
    {
      id: 1,
      title: 'User Guide - Foreword',
      section: 'User Guide',
      subject: 'Foreword',
      lastModified: 'Jan 20, 2025'
    },
    {
      id: 2,
      title: 'Planning - Quality Objectives',
      section: 'Planning',
      subject: 'Quality Objective and Planning',
      lastModified: 'Jan 18, 2025'
    },
    {
      id: 3,
      title: 'Leadership - Policy',
      section: 'Leadership',
      subject: 'Policy',
      lastModified: 'Jan 15, 2025'
    }
  ]);

  const handleEdit = (draftId) => {
    // Logic to edit draft
    console.log('Edit draft:', draftId);
    onClose();
  };

  const handleDelete = (draftId) => {
    // Filter out the draft to be deleted
    setDrafts(drafts.filter(draft => draft.id !== draftId));
  };

  const handleUpload = (draftId) => {
    // Logic to upload draft
    console.log('Upload draft:', draftId);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Draft Documents</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {drafts.length > 0 ? (
          <div className="draft-list">
            {drafts.map(draft => (
              <div key={draft.id} className="draft-item">
                <div className="draft-info">
                  <div className="draft-title">{draft.title}</div>
                  <div className="draft-metadata">
                    Section: {draft.section} | Subject: {draft.subject} | Last Modified: {draft.lastModified}
                  </div>
                </div>
                <div className="draft-actions">
                  <button 
                    className="draft-button" 
                    onClick={() => handleEdit(draft.id)}
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className="draft-button" 
                    onClick={() => handleDelete(draft.id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button 
                    className="draft-button" 
                    onClick={() => handleUpload(draft.id)}
                    title="Upload"
                  >
                    <Upload size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-drafts-message">
            <p>No draft documents available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DraftModal;
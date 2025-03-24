import React, { useState, useEffect } from 'react';
import { X, Edit, Trash2 } from 'lucide-react';
import '../../css/styles/modal/DraftModal.css';
import UploadModal from './UploadModal';

const DraftModal = ({ onClose, onSaveDraft, categories, subcategories, setPdfFile, drafts: initialDrafts = [] }) => {
  const [drafts, setDrafts] = useState(initialDrafts.length > 0 ? initialDrafts : []);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    if (initialDrafts.length > 0) {
      setDrafts(initialDrafts);
    }
  }, [initialDrafts]);

  const handleEdit = (draft) => {
    setSelectedDraft(draft);
    setShowUploadModal(true);
  };

  const handleDelete = (draftId) => {
    setDrafts(drafts.filter(draft => draft.id !== draftId));
  };

  const handleSaveDraft = (draftData) => {
    if (drafts.some(draft => draft.id === draftData.id)) {
      setDrafts(drafts.map(draft =>
        draft.id === draftData.id ? draftData : draft
      ));
    } else {
      setDrafts([...drafts, draftData]);
    }

    if (onSaveDraft) {
      onSaveDraft(drafts);
    }

    setShowUploadModal(false);
    setSelectedDraft(null);
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    setSelectedDraft(null);
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h3 className="modal-title">Draft Documents</h3>
            <button className="close-button" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {drafts.length > 0 ? (
            <div className="draft-list">
              {drafts.map(draft => (
                <div
                  key={draft.id}
                  className="draft-item"
                  onMouseEnter={() => setHoveredItem(draft.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="draft-info">
                    <div className="draft-title">{draft.title}</div>
                    <div className="draft-metadata">
                      Section: {draft.section} | Subject: {draft.subject} | Last Modified: {draft.lastModified}
                    </div>
                  </div>
                  <div className="draft-actions">
                    <button
                      className={`draft-button delete-button ${hoveredItem === draft.id ? 'hovered' : ''}`}
                      onClick={() => handleDelete(draft.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      className={`draft-button edit-button ${hoveredItem === draft.id ? 'hovered' : ''}`}
                      onClick={() => handleEdit(draft)}
                      title="Edit"
                    >
                      <Edit size={16} />
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

      {showUploadModal && (
        <UploadModal
          onClose={handleCloseUploadModal}
          categories={categories}
          subcategories={subcategories}
          setPdfFile={setPdfFile}
          draftToEdit={selectedDraft}
          onSaveDraft={handleSaveDraft}
        />
      )}
    </>
  );
};

export default DraftModal;

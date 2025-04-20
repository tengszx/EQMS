import React, { useState } from 'react';
import { Plus, Eye, Edit, ChevronRight } from 'lucide-react';
import '../../../css/styles/admin/AuditSystem.css';
import AddAuditModal from '../../modal/AddAuditModal';

const AuditSystem = () => {
  const [auditRecords, setAuditRecords] = useState([]);

  const [auditSchedule, setAuditSchedule] = useState([]);

  const [showAddAuditModal, setShowAddAuditModal] = useState(false);
  const [nextAuditId, setNextAuditId] = useState(4);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentAuditIndex, setCurrentAuditIndex] = useState(null);

  const [newAudit, setNewAudit] = useState({
    id: '',
    title: '',
    type: 'Internal',
    scope: '',
    auditor: '',
    date: '',
    status: 'Scheduled'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validation for auditor field (text only)
    if (name === 'auditor' && /\d/.test(value)) {
      return;
    }

    // If the field is id, only allow numbers and preserve the AUD- prefix
    if (name === 'id') {
      if (/^\d*$/.test(value)) {
        setNewAudit({
          ...newAudit,
          id: value
        });
      }
      return;
    }

    setNewAudit({
      ...newAudit,
      [name]: value
    });
  };

  const openAddModal = () => {
    const formattedId = String(nextAuditId).padStart(3, '0');
    
    setNewAudit({
      id: formattedId,
      title: '',
      type: 'Internal',
      scope: '',
      auditor: '',
      date: '',
      status: 'Scheduled'
    });
    
    setIsEditMode(false);
    setShowAddAuditModal(true);
  };

  const openEditModal = (index) => {
    const auditToEdit = auditRecords[index];
    const idNumber = auditToEdit.id.replace('AUD-', '');
    
    setNewAudit({
      ...auditToEdit,
      id: idNumber
    });
    
    setCurrentAuditIndex(index);
    setIsEditMode(true);
    setShowAddAuditModal(true);
  };

  const closeModal = () => {
    setShowAddAuditModal(false);
  };

  const handleSaveAudit = () => {
    const completeAudit = {
      ...newAudit,
      id: `AUD-${newAudit.id.padStart(3, '0')}`
    };

    if (isEditMode && currentAuditIndex !== null) {
      // Update existing audit
      const updatedRecords = [...auditRecords];
      updatedRecords[currentAuditIndex] = completeAudit;
      setAuditRecords(updatedRecords);
    } else {
      // Add to schedule only (not to audit records)
      const scheduleItem = {
        title: completeAudit.title,
        date: completeAudit.date,
        type: completeAudit.type,
        scope: completeAudit.scope,
        auditor: completeAudit.auditor,
        status: completeAudit.status,
        id: completeAudit.id
      };
      
      setAuditSchedule([...auditSchedule, scheduleItem]);
      setNextAuditId(nextAuditId + 1);
    }

    // Reset and close modal
    setShowAddAuditModal(false);
    setNewAudit({
      id: '',
      title: '',
      type: 'Internal',
      scope: '',
      auditor: '',
      date: '',
      status: 'Scheduled'
    });
    setIsEditMode(false);
    setCurrentAuditIndex(null);
  };

  const moveToAuditRecords = (index) => {
    const scheduledAudit = auditSchedule[index];

    // Move from schedule to audit records
    setAuditRecords([...auditRecords, scheduledAudit]);

    // Remove from schedule
    const updatedSchedule = [...auditSchedule];
    updatedSchedule.splice(index, 1);
    setAuditSchedule(updatedSchedule);
  };

  return (
    <div className="audit-system-container">
      <div className="audit-section audit-records">
        <div className="section-header">
          <h2>Audit Records</h2>
          <button className="add-button" onClick={openAddModal}>
            <Plus size={16} />
            <span>Add New Audit</span>
          </button>
        </div>

        <div className="table-container">
          <table className="audit-table">
            <thead>
              <tr>
                <th>Audit ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Scope</th>
                <th>Auditor</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {auditRecords.map((audit, index) => (
                <tr key={index}>
                  <td>{audit.id}</td>
                  <td>{audit.title}</td>
                  <td>{audit.type}</td>
                  <td>{audit.scope}</td>
                  <td>{audit.auditor}</td>
                  <td>{audit.date}</td>
                  <td>
                    <span className={`status-badge ${audit.status.toLowerCase()}`}>
                      {audit.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="icon-button view-button">
                      <Eye size={16} />
                    </button>
                    <button className="icon-button edit-button" onClick={() => openEditModal(index)}>
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="audit-section audit-schedule">
        <div className="section-header">
          <h2>Audit Schedule</h2>
        </div>

        <div className="schedule-container">
          {auditSchedule.map((audit, index) => (
            <div className="schedule-item" key={index}>
              <div className="schedule-info">
                <h3>{audit.title}</h3>
                <p>Scheduled Date: {audit.date}</p>
                <p>Type: {audit.type} | Auditor: {audit.auditor}</p>
              </div>
              <button
                className="move-button"
                onClick={() => moveToAuditRecords(index)}
              >
                <span>Move to Audit Records</span>
                <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <AddAuditModal
        showModal={showAddAuditModal}
        closeModal={closeModal}
        newAudit={newAudit}
        handleInputChange={handleInputChange}
        handleSaveAudit={handleSaveAudit}
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default AuditSystem;
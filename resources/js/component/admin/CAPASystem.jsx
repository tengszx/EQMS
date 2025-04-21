import React, { useState } from 'react';
import { Search, Edit, Eye, Trash2, Plus, FileText } from 'lucide-react';
import '../../../css/styles/admin/CAPASystem.css';
import NewCAPAModal from '../../modal/NewCAPAModal';
const CAPASystem = () => {
    const [capaData, setCAPAData] = useState([
        {
            id: 'CAPA001',
            title: 'Equipment Malfunction',
            type: 'Corrective',
            status: 'In Progress',
            owner: 'John Doe',
            date: '2025-04-15',
            category: 'Equipment',
            pdfFile: null
        },
        {
            id: 'CAPA002',
            title: 'Process Improvement',
            type: 'Preventive',
            status: 'Complete',
            owner: 'Jane Smith',
            date: '2025-04-10',
            category: 'Process',
            pdfFile: null
        },
    ]);
    const [showNewModal, setShowNewModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false); // Fixed: Added missing '=' sign
    const [selectedCAPA, setSelectedCAPA] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [nextId, setNextId] = useState(3);

    const filteredData = capaData.filter(capa => {
        const matchesSearch = Object.values(capa).some(value =>
            value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
        const matchesStatus = statusFilter === '' || capa.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleAddCAPA = (newCAPA) => {
        const capaId = `CAPA${String(nextId).padStart(3, '0')}`;
        setCAPAData([...capaData, { ...newCAPA, id: capaId }]);
        setNextId(nextId + 1);
        setShowNewModal(false);
    };

    const handleUpdateCAPA = (updatedCAPA) => {
        setCAPAData(capaData.map(capa =>
            capa.id === updatedCAPA.id ? updatedCAPA : capa
        ));
        setShowEditModal(false);
    };

    const handleViewCAPA = (capa) => {
        setSelectedCAPA(capa);
        setShowViewModal(true);
    };

    const handleEditCAPA = (capa) => {
        setSelectedCAPA(capa);
        setShowEditModal(true);
    };

    const handleDeleteCAPA = (id) => {
        if (window.confirm('Are you sure you want to delete this CAPA?')) {
            setCAPAData(capaData.filter(capa => capa.id !== id));
        }
    };

    return (
        <div className="capa-container">
            <div className="capa-header">
                <h1>Corrective and Preventive Action (CAPA)</h1>
                <button className="new-capa-btn" onClick={() => setShowNewModal(true)}>
                    <Plus size={18} /> New CAPA
                </button>
            </div>
            <div className="capa-filters">
                <div className="search-container">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="filter-container">
                    <label>Status:</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="status-filter"
                    >
                        <option value="">All</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Complete">Complete</option>
                    </select>
                </div>
            </div>
            <div className="capa-table-container">
                <table className="capa-table">
                    <thead>
                        <tr>
                            <th>CAPA ID</th>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Owner</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((capa) => (
                            <tr key={capa.id}>
                                <td>{capa.id}</td>
                                <td>{capa.title}</td>
                                <td>{capa.type}</td>
                                <td>
                                    <span className={`status-badge ${capa.status.toLowerCase().replace(' ', '-')}`}>
                                        {capa.status}
                                    </span>
                                </td>
                                <td>{capa.owner}</td>
                                <td>{capa.category}</td>
                                <td>{capa.date}</td>
                                <td className="action-buttons">
                                    <button className="action-btn view-btn" onClick={() => handleViewCAPA(capa)} title="View">
                                        <Eye size={18} />
                                    </button>
                                    <button className="action-btn edit-btn" onClick={() => handleEditCAPA(capa)} title="Edit">
                                        <Edit size={18} />
                                    </button>
                                    <button className="action-btn delete-btn" onClick={() => handleDeleteCAPA(capa.id)} title="Delete">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showNewModal && (
                <NewCAPAModal
                    onClose={() => setShowNewModal(false)}
                    onSave={handleAddCAPA}
                    nextId={`CAPA${String(nextId).padStart(3, '0')}`}
                />
            )}
            {showViewModal && selectedCAPA && (
                <div className="modal-backdrop">
                    <div className="modal-container view-modal">
                        <div className="modal-header">
                            <h2>View CAPA Details - {selectedCAPA.id}</h2>
                            <button className="close-btn" onClick={() => setShowViewModal(false)}>×</button>
                        </div>
                        <div className="modal-body view-modal-body">
                            <div className="capa-details">
                                <div className="detail-item">
                                    <label>CAPA ID:</label>
                                    <span>{selectedCAPA.id}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Title:</label>
                                    <span>{selectedCAPA.title}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Type:</label>
                                    <span>{selectedCAPA.type}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Status:</label>
                                    <span className={`status-badge ${selectedCAPA.status.toLowerCase().replace(' ', '-')}`}>
                                        {selectedCAPA.status}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <label>Owner:</label>
                                    <span>{selectedCAPA.owner}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Category:</label>
                                    <span>{selectedCAPA.category}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Date:</label>
                                    <span>{selectedCAPA.date}</span>
                                </div>
                            </div>
                            <div className="pdf-viewer">
                                {selectedCAPA.pdfFile ? (
                                    <iframe src={selectedCAPA.pdfFile} width="100%" height="400px" title="CAPA Document" />
                                ) : (
                                    <div className="pdf-placeholder">
                                        <FileText size={48} />
                                        <p>No PDF Document Uploaded</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="edit-btn-large"
                                onClick={() => {
                                    setShowViewModal(false);
                                    setShowEditModal(true);
                                }}
                            >
                                <Edit size={18} /> Edit
                            </button>
                            <button className="close-modal-btn" onClick={() => setShowViewModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
            {showEditModal && selectedCAPA && (
                <div className="modal-backdrop">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h2>Edit CAPA - {selectedCAPA.id}</h2>
                            <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const updatedCAPA = {
                                    ...selectedCAPA,
                                    title: formData.get('title'),
                                    type: formData.get('type'),
                                    status: formData.get('status'),
                                    owner: formData.get('owner'),
                                    category: formData.get('category'),
                                    date: formData.get('date')
                                };
                                handleUpdateCAPA(updatedCAPA);
                            }}>
                                <div className="form-group">
                                    <label>CAPA ID:</label>
                                    <input type="text" value={selectedCAPA.id} disabled />
                                </div>
                                <div className="form-group">
                                    <label>Title:</label>
                                    <input
                                        type="text"
                                        name="title"
                                        defaultValue={selectedCAPA.title}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Type:</label>
                                    <select name="type" defaultValue={selectedCAPA.type}>
                                        <option value="Corrective">Corrective</option>
                                        <option value="Preventive">Preventive</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Status:</label>
                                    <select name="status" defaultValue={selectedCAPA.status}>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Complete">Complete</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Owner:</label>
                                    <input
                                        type="text"
                                        name="owner"
                                        defaultValue={selectedCAPA.owner}
                                        pattern="[A-Za-z\s]+"
                                        title="Only letters and spaces allowed"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category:</label>
                                    <select name="category" defaultValue={selectedCAPA.category}>
                                        <option value="Equipment">Equipment</option>
                                        <option value="Process">Process</option>
                                        <option value="Documentation">Documentation</option>
                                        <option value="Training">Training</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Date:</label>
                                    <input
                                        type="date"
                                        name="date"
                                        defaultValue={selectedCAPA.date}
                                        required
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="save-btn">Save Changes</button>
                                    <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CAPASystem;
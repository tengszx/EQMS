// NewCAPAModal.jsx
import React, { useState, useRef } from 'react';
import '../../css/styles/modal/NewCAPAModal.css';
import { FileText } from 'lucide-react';

const NewCAPAModal = ({ onClose, onSave, nextId }) => {
    const [formData, setFormData] = useState({
        title: '',
        type: 'Corrective',
        status: 'In Progress',
        owner: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        pdfFile: null
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const capaNumberRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({
                ...formData,
                pdfFile: reader.result
            });
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let capaId = nextId;
        if (capaNumberRef.current && capaNumberRef.current.value) {
            const numericValue = capaNumberRef.current.value;
            capaId = `CAPA${numericValue.padStart(3, '0')}`;
        }

        onSave({
            ...formData,
            id: capaId
        });
    };

    const validateOwner = (value) => {
        return /^[A-Za-z\s]+$/.test(value) || value === '';
    };

    const extractNumberFromId = (id) => {
        return id.replace('CAPA', '');
    };

    return (
        <div className="modal-backdrop">
            <div className="new-capa-modal">
                <div className="modal-header">
                    <h2>New CAPA</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group capa-id-group">
                            <label>CAPA ID:</label>
                            <div className="capa-id-container">
                                <span className="capa-id-prefix">CAPA-</span>
                                <input
                                    type="text"
                                    ref={capaNumberRef}
                                    defaultValue={extractNumberFromId(nextId)}
                                    className="capa-id-input"
                                    onKeyPress={(e) => {
                                        if (!/[0-9]/.test(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="title-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Type:</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="type-dropdown"
                            >
                                <option value="Corrective">Corrective</option>
                                <option value="Preventive">Preventive</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Status:</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="status-dropdown"
                            >
                                <option value="In Progress">In Progress</option>
                                <option value="Complete">Complete</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Owner:</label>
                            <input
                                type="text"
                                name="owner"
                                value={formData.owner}
                                onChange={(e) => {
                                    if (validateOwner(e.target.value)) {
                                        handleChange(e);
                                    }
                                }}
                                required
                                pattern="[A-Za-z\s]+"
                                title="Only letters and spaces allowed"
                                className="owner-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Category:</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="category-dropdown"
                            >
                                <option value="" disabled>Select a category</option>
                                <option value="Equipment">Equipment</option>
                                <option value="Process">Process</option>
                                <option value="Documentation">Documentation</option>
                                <option value="Training">Training</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Due Date:</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="date-picker"
                            />
                        </div>

                        <div className="form-group">
                            <label>Upload PDF:</label>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                className="pdf-uploader"
                            />
                            {selectedFile && (
                                <div className="selected-file-info">
                                    <FileText size={20} className="pdf-icon" />
                                    <span>{selectedFile.name}</span>
                                </div>
                            )}
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="save-btn">Save</button>
                            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewCAPAModal;

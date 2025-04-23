import React, { useState, useEffect } from 'react';
import '../../css/styles/modal/UploadModal.css';

const UploadModal = ({ onClose, categories, subcategories, setPdfFile, draftToEdit = null, onSaveDraft }) => {
    const [selectedManual, setSelectedManual] = useState(draftToEdit ? draftToEdit.manual : '');
    const [selectedSection, setSelectedSection] = useState(draftToEdit ? draftToEdit.section : '');
    const [selectedSubject, setSelectedSubject] = useState(draftToEdit ? draftToEdit.subject : '');
    const [availableSections, setAvailableSections] = useState([]);
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
        const requiredFieldsFilled = Boolean(selectedManual && selectedSection && selectedSubject && file && versionCode);
        setFormIsValid(requiredFieldsFilled);
    }, [selectedManual, selectedSection, selectedSubject, file, versionCode]);

    useEffect(() => {
        if (categories) {
            setAvailableSections(categories);
        }
    }, [categories]);

    useEffect(() => {
        if (selectedManual && subcategories && subcategories[selectedManual]) {
            const sections = Object.keys(subcategories[selectedManual]);
            setAvailableSections(sections);
        } else {
            setAvailableSections([]);
            setAvailableSubjects([]);
            setSelectedSection('');
            setSelectedSubject('');
        }
    }, [selectedManual, subcategories]);

    useEffect(() => {
        if (selectedSection && subcategories && subcategories[selectedManual] && subcategories[selectedManual][selectedSection]) {
            setAvailableSubjects(subcategories[selectedManual][selectedSection]);
        } else {
            setAvailableSubjects([]);
            setSelectedSubject('');
        }
    }, [selectedSection, subcategories, selectedManual]);

    const handleManualChange = (e) => {
        setSelectedManual(e.target.value);
        setSelectedSection('');
        setSelectedSubject('');
    };

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
            const today = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
            setPdfFile(file, documentCode, versionCode, today, selectedSection, selectedSubject);
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
                manual: selectedManual,
                title: `${selectedManual} - ${selectedSection} - ${selectedSubject}`,
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

                <div className="form-group">
                    <label className="form-label">Manual:</label>
                    <select
                        value={selectedManual}
                        onChange={handleManualChange}
                        className="form-control"
                    >
                        <option value="">Select Manual</option>
                        {categories.map((manual) => (
                            <option key={manual} value={manual}>{manual}</option>
                        ))}
                    </select>
                </div>

                <div className="form-row">
                    <div className="form-col">
                        <div className="form-group">
                            <label className="form-label">Section:</label>
                            <select
                               value={selectedSection}
                               onChange={handleSectionChange}
                               className="form-control"
                               disabled={!selectedManual}
                            >
                                <option value="">Select Section</option>
                                {availableSections.map((section) => (
                                    <option key={section} value={section}>{section}</option>
                                ))}
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
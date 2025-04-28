import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import '../../../css/styles/admin/DocumentControl.css';
import UploadModal from '../../modal/UploadModal';
import DraftModal from '../../modal/DraftModal';
import AddFileModal from '../../modal/AddFileModal';
import { FaEye, FaSearchPlus, FaSearchMinus, FaAngleLeft, FaAngleRight } from 'react-icons/fa';

// Set PDF.js worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const DocumentControl = () => {
    const [selectedManual, setSelectedManual] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showDraftModal, setShowDraftModal] = useState(false);
    const [showAddFileModal, setShowAddFileModal] = useState(false);
    const [showDocumentView, setShowDocumentView] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [pdfFileUrl, setPdfFileUrl] = useState(null);
    const [documentInfo, setDocumentInfo] = useState({
        documentCode: '',
        revisionNumber: '',
        effectiveDate: ''
    });
    const [drafts, setDrafts] = useState([]);
    const [filesList, setFilesList] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    // PDF viewer specific states
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    // We'll use a single array to track PDFs
    const [pdfDocuments, setPdfDocuments] = useState([]);

    const [containerHeight, setContainerHeight] = useState('500px'); // Initial height

    const pdfContainerRef = useRef(null); // Ref for the container

    useEffect(() => {
        if (selectedFile && selectedFile.pdfData) {
            const blob = new Blob([selectedFile.pdfData], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setPdfFileUrl(url);
            
            // Reset to page 1 when selecting a new file
            setPageNumber(1);
        }
    }, [selectedFile]);

    // Update container height based on scale
    useEffect(() => {
        if (pdfContainerRef.current) {
            // Calculate the base height of the PDF
            const baseHeight = 500; // Adjust this based on your initial PDF size
            const newHeight = baseHeight * scale;
            setContainerHeight(`${newHeight}px`);
        }
    }, [scale]);

    const handleManualChange = (e) => {
        setSelectedManual(e.target.value);
        setSelectedCategory('');
        setSelectedSubcategory('');
        setShowDocumentView(false);
        setErrorMessage('');
        setPdfDocuments([]);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setSelectedSubcategory('');
        setShowDocumentView(false);
        setErrorMessage('');
        setPdfDocuments([]);
    };

    const handleSubcategoryChange = (e) => {
        setSelectedSubcategory(e.target.value);
        setShowDocumentView(false);
        setErrorMessage('');
        setPdfDocuments([]);
    };

    const handleFileClick = (file) => {
        console.log("File clicked:", file.name, file.id);
        setErrorMessage('');
        setSelectedFile(file);

        setDocumentInfo({
            documentCode: file.documentCode || 'N/A',
            revisionNumber: file.versionCode || 'N/A',
            effectiveDate: file.effectiveDate || 'N/A'
        });

        if (file.pdfData) {
            const blob = new Blob([file.pdfData], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setPdfFileUrl(url);
            setShowDocumentView(true);
            
            // Reset documents array with just this file
            setPdfDocuments([{
                id: file.id,
                url: url,
                name: file.name,
                version: file.versionCode
            }]);
            
            // Reset to page 1
            setPageNumber(1);
        } else {
            console.warn("Selected file has no PDF data.");
            setPdfFileUrl(null);
            setErrorMessage("Selected file is missing PDF data.");
            setShowDocumentView(false);
        }
    };

    const handleBackToList = () => {
        setShowDocumentView(false);
        setSelectedFile(null);
        setPdfFileUrl(null);
        setDocumentInfo({ documentCode: '', revisionNumber: '', effectiveDate: '' });
        setErrorMessage('');
        setPdfDocuments([]);
    };

    const handleSetPdfFile = (file, documentCode, versionCode, effectiveDate, category, subcategory) => {
        if (!file) {
            setErrorMessage("No file provided for upload.");
            return;
        }
        setErrorMessage('');

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const fileData = e.target.result;
                const fileId = `file_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

                const subcategoryFiles = filesList[subcategory] || [];
                const existingFileIndex = subcategoryFiles.findIndex(f => f.name === file.name && !f.isPreviousVersion);
                if (existingFileIndex !== -1) {
                    setErrorMessage(`Error: A file with the name "${file.name}" already exists as a current version in this subcategory. Please rename the file before uploading.`);
                    return;
                }

                const newFile = {
                    id: fileId,
                    name: file.name,
                    effectiveDate: effectiveDate || new Date().toISOString().split('T')[0],
                    documentCode: documentCode || 'N/A',
                    versionCode: versionCode || '1.0',
                    pdfData: fileData,
                    category: category,
                    subcategory: subcategory,
                    isPreviousVersion: false,
                    createdAt: new Date().toISOString(),
                };

                console.log('Adding new file via UploadModal:', newFile.name, newFile.id);

                setFilesList(prevFilesList => ({
                    ...prevFilesList,
                    [subcategory]: [...(prevFilesList[subcategory] || []), newFile]
                }));

                setSelectedManual(manual => manual || category);
                setSelectedCategory(category);
                setSelectedSubcategory(subcategory);
                setShowDocumentView(false);
                setShowUploadModal(false);
                console.log('New file uploaded successfully:', newFile.name);

            } catch (error) {
                console.error("Error processing uploaded file:", error);
                setErrorMessage(`Error processing file: ${error.message}`);
            }
        };
        reader.onerror = (error) => {
            console.error("Error reading file:", error);
            setErrorMessage("Error reading the uploaded file.");
        };
        reader.readAsArrayBuffer(file);
    };

    const handleAddFileRevision = async (newRevisionFile, manualVersionCode) => {
        if (!newRevisionFile || !selectedFile || !selectedSubcategory || !showDocumentView) {
            setErrorMessage("Cannot add revision: Missing context or not viewing a file.");
            console.error("Internal Error: handleAddFileRevision called without proper context.");
            return;
        }
        setErrorMessage('');

        console.log(`Adding revision: "${newRevisionFile.name}" to replace current version of "${selectedFile.name}" (v${selectedFile.versionCode})`);

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const newPdfData = e.target.result;

                const previousVersion = {
                    ...selectedFile,
                    isPreviousVersion: true,
                };

                const updatedFile = {
                    ...selectedFile,
                    id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
                    name: newRevisionFile.name,
                    versionCode: manualVersionCode,
                    effectiveDate: new Date().toISOString().split('T')[0],
                    pdfData: newPdfData,
                    isPreviousVersion: false,
                    createdAt: new Date().toISOString(),
                };

                setFilesList(prevFilesList => {
                    const currentSubcategoryFiles = prevFilesList[selectedSubcategory] || [];
                    const updatedSubcategoryFiles = currentSubcategoryFiles
                        .filter(f => f.id !== selectedFile.id)
                        .concat([previousVersion, updatedFile]);

                    return {
                        ...prevFilesList,
                        [selectedSubcategory]: updatedSubcategoryFiles
                    };
                });

                setSelectedFile(updatedFile);

                const blob = new Blob([newPdfData], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                
                // Add the new revision to our PDF documents array
                setPdfDocuments(prevDocs => {
                    // Create a new array with both documents
                    const newDocsArray = [
                        // Keep the original file
                        ...prevDocs,
                        // Add the new revision
                        {
                            id: updatedFile.id,
                            url: url,
                            name: newRevisionFile.name,
                            version: manualVersionCode
                        }
                    ];
                    return newDocsArray;
                });

                setPdfFileUrl(url);

                setDocumentInfo({
                    documentCode: updatedFile.documentCode,
                    revisionNumber: updatedFile.versionCode,
                    effectiveDate: updatedFile.effectiveDate
                });

                console.log(`Revision ${manualVersionCode} (${updatedFile.name}) added successfully.`);
                
                // Update numPages after adding a document
                setNumPages(prevNumPages => {
                    const newNumPages = prevNumPages ? prevNumPages + 1 : 2;
                    return newNumPages;
                });

            } catch (error) {
                console.error("Error processing added revision file:", error);
                setErrorMessage(`Error adding revision: ${error.message}`);
            }
        };
        reader.onerror = (error) => {
            console.error("Error reading file for revision:", error);
            setErrorMessage("Error reading the file selected for revision.");
        };
        reader.readAsArrayBuffer(newRevisionFile);
    };

    const handleSaveDraft = (draftData) => {
        console.log("Saving draft:", draftData.id || "New Draft");
        setDrafts(prevDrafts => {
            const existingIndex = prevDrafts.findIndex(d => d.id === draftData.id);
            if (existingIndex > -1) {
                const updatedDrafts = [...prevDrafts];
                updatedDrafts[existingIndex] = draftData; 
                return updatedDrafts;
            } else {
                const newDraft = { ...draftData, id: draftData.id || `draft_${Date.now()}` };
                return [...prevDrafts, newDraft];
            }
        });
        setShowUploadModal(false);
    };

    const toggleUploadModal = () => setShowUploadModal(prev => !prev);
    const toggleDraftModal = () => setShowDraftModal(prev => !prev);
    const toggleAddFileModal = () => {
        if (selectedFile && showDocumentView) {
            setErrorMessage('');
            setShowAddFileModal(prev => !prev);
        } else {
            setErrorMessage("Please select and view a file first to add a revision.");
        }
    };

    // PDF Viewer functions
    const onDocumentLoadSuccess = ({ numPages: loadedNumPages }) => {
        // Only set numPages if we don't already have multiple documents
        if (pdfDocuments.length <= 1) {
            setNumPages(loadedNumPages);
        } else {
            // For multiple documents, numPages is the number of documents
            setNumPages(pdfDocuments.length);
        }
    };

    const zoomIn = () => {
        setScale(prevScale => Math.min(prevScale + 0.2, 3.0));
    };

    const zoomOut = () => {
        setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
    };

    const goToPreviousPage = () => {
        if (pageNumber > 1) {
            setPageNumber(prevPage => prevPage - 1);
        }
    };

    const goToNextPage = () => {
        if (pageNumber < numPages) {
            setPageNumber(prevPage => prevPage + 1);
        }
    };

    // Get the appropriate PDF URL based on page number
    const getCurrentPdfUrl = () => {
        if (pdfDocuments.length === 0) {
            return pdfFileUrl;
        }
        
        // If we have only one document or the page number is 1, return the first document
        if (pdfDocuments.length === 1 || pageNumber === 1) {
            return pdfDocuments[0].url;
        }
        
        // If we have multiple documents, return the document corresponding to the page
        // We subtract 1 because pages are 1-indexed but arrays are 0-indexed
        const docIndex = Math.min(pageNumber - 1, pdfDocuments.length - 1);
        return pdfDocuments[docIndex].url;
    };

    // Similar functions for getting the name and version based on page number
    const getCurrentPdfName = () => {
        if (pdfDocuments.length === 0) {
            return selectedFile?.name || '';
        }
        
        if (pdfDocuments.length === 1 || pageNumber === 1) {
            return pdfDocuments[0].name;
        }
        
        const docIndex = Math.min(pageNumber - 1, pdfDocuments.length - 1);
        return pdfDocuments[docIndex].name;
    };

    const getCurrentPdfVersion = () => {
        if (pdfDocuments.length === 0) {
            return selectedFile?.versionCode || '';
        }
        
        if (pdfDocuments.length === 1 || pageNumber === 1) {
            return pdfDocuments[0].version;
        }
        
        const docIndex = Math.min(pageNumber - 1, pdfDocuments.length - 1);
        return pdfDocuments[docIndex].version;
    };

    const getCategories = () => {
        if (selectedManual === 'Quality Manual') { return ['User Guide', 'Context Organizational', 'Leadership', 'Planning', 'Support', 'Operation', 'Performance Evaluation', 'Improvement']; }
        else if (selectedManual === 'Procedure Manual') { return ['Audit', 'User\'s Guide', 'Context Organizational', 'Leadership', 'Planning', 'Support', 'Operation', 'Performance Evaluation', 'Improvement']; }
        return [];
    };

    const getSubcategories = () => {
        switch (selectedManual) {
            case 'Quality Manual':
                switch (selectedCategory) {
                    case 'User Guide': return ['Foreword', 'Table of Contents', 'Objectives of the Quality Manual', 'Background Info of NRCP', 'Authorization', 'Distribution', 'Coding System'];
                    case 'Context Organizational': return ['Overview', 'Organizational Context', 'Stakeholders', 'Scope'];
                    case 'Leadership': return ['Leadership and Commitment', 'Policy', 'Organizational Roles, Responsibilities and Authorities'];
                    case 'Planning': return ['Planning', 'Quality Objectives', 'Risk and Opportunities', 'Quality Management System and Processes'];
                    case 'Support': return ['Support', 'Resources', 'Competence', 'Awareness', 'Communication', 'Documented Information'];
                    case 'Operation': return ['Operation', 'Operational Planning and Control', 'Design and Development of Products and Services'];
                    case 'Performance Evaluation': return ['Performance Evaluation', 'Monitoring, Measurement, Analysis and Evaluation', 'Internal Audit', 'Management Review'];
                    case 'Improvement': return ['Improvement', 'Nonconformity and Corrective Action', 'Continual Improvement'];
                    default: return [];
                }
            case 'Procedure Manual':
                switch (selectedCategory) {
                    case 'Audit': return ['Table of Contents', 'Objectives of the Procedures Manual', 'Authorization for the Implementation /Updating Responsibility Distribution of the Procedures Manual', 'Coding System for the Procedures Manual'];
                    case 'User\'s Guide': return ['Table of Contents', 'Objectives of the Procedures Manual', 'Authorization for the Implementation /Updating Responsibility Distribution of the Procedures Manual', 'Coding System for the Procedures Manual'];
                    case 'Context Organizational': return ['Understanding the NRCP and its Context'];
                    case 'Leadership': return ['Leadership and Commitment', 'Research/Technical Policy Review and Development'];
                    case 'Planning': return ['Risk Management Process', 'Strategic Planning', 'Operational Planning'];
                    case 'Support': return ['Control of Maintained Documents', 'Property and Asset Management', 'Utilization of NRCP Vehicle', 'Procurement of Goods and Services', 'Budget Management', 'Procedure for Processing of Disbursement Voucher', 'Payment Process', 'Recruitment, Selection, and Placement', 'Learning and Development', 'Performance Management of Personnel', 'Records Management', 'Preventive Maintenance of ICT Infrastructure', 'Provision of IT Technical Support', 'Performance Monitoring and Evaluation', 'Procedure for Processing of Facilitation and Approval of Documents', 'Procedure for the Facilitation of the Core Management Team (CMT) Meeting'];
                    case 'Operation': return ['Control of Nonconforming Output', 'Handling Client Complaints', 'Research Grants-In-Aid', 'Membership Application Processing', 'Processing of Requests under the NRCP Expert Engagement Program (NEEP)', 'NRCP Achievement Award', 'Library Service', 'Publication of NRCP Research Journal', 'Dissemination Of NRCP Publications', 'Research Information Translation and Promotion'];
                    case 'Performance Evaluation': return ['Client Satisfaction Measurement', 'Internal Audit', 'Management Review'];
                    case 'Improvement': return ['Corrective Action'];
                    default: return [];
                }
            default: return [];
        }
    };

    const getSubcategoriesWithSubjects = () => {
        const mapping = {};
        mapping['Quality Manual'] = { "User Guide": ['Foreword', 'Table of Contents', 'Objectives of the Quality Manual', 'Background Info of NRCP', 'Authorization', 'Distribution', 'Coding System'], "Context Organizational": ['Overview', 'Organizational Context', 'Stakeholders', 'Scope'], "Leadership": ['Leadership and Commitment', 'Policy', 'Organizational Roles, Responsibilities and Authorities'], "Planning": ['Planning', 'Quality Objectives', 'Risk and Opportunities', 'Quality Management System and Processes'], "Support": ['Support', 'Resources', 'Competence', 'Awareness', 'Communication', 'Documented Information'], "Operation": ['Operation', 'Operational Planning and Control', 'Design and Development of Products and Services'], "Performance Evaluation": ['Performance Evaluation', 'Monitoring, Measurement, Analysis and Evaluation', 'Internal Audit', 'Management Review'], "Improvement": ['Improvement', 'Nonconformity and Corrective Action', 'Continual Improvement'] };
        mapping['Procedure Manual'] = { "Audit": ['Table of Contents', 'Objectives of the Procedures Manual', 'Authorization for the Implementation /Updating Responsibility Distribution of the Procedures Manual', 'Coding System for the Procedures Manual'], "User's Guide": ['Table of Contents', 'Objectives of the Procedures Manual', 'Authorization for the Implementation /Updating Responsibility Distribution of the Procedures Manual', 'Coding System for the Procedures Manual'], "Context Organizational": ['Understanding the NRCP and its Context'], "Leadership": ['Leadership and Commitment', 'Research/Technical Policy Review and Development'], "Planning": ['Risk Management Process', 'Strategic Planning', 'Operational Planning'], "Support": ['Control of Maintained Documents', 'Property and Asset Management', 'Utilization of NRCP Vehicle', 'Procurement of Goods and Services', 'Budget Management', 'Procedure for Processing of Disbursement Voucher', 'Payment Process', 'Recruitment, Selection, and Placement', 'Learning and Development', 'Performance Management of Personnel', 'Records Management', 'Preventive Maintenance of ICT Infrastructure', 'Provision of IT Technical Support', 'Performance Monitoring and Evaluation', 'Procedure for Processing of Facilitation and Approval of Documents', 'Procedure for the Facilitation of the Core Management Team (CMT) Meeting'], "Operation": ['Control of Nonconforming Output', 'Handling Client Complaints', 'Research Grants-In-Aid', 'Membership Application Processing', 'Processing of Requests under the NRCP Expert Engagement Program (NEEP)', 'NRCP Achievement Award', 'Library Service', 'Publication of NRCP Research Journal', 'Dissemination Of NRCP Publications', 'Research Information Translation and Promotion'], "Performance Evaluation": ['Client Satisfaction Measurement', 'Internal Audit', 'Management Review'], "Improvement": ['Corrective Action'] };
        return mapping;
    };

    const existingFilenamesForModal = selectedFile ? (filesList[selectedSubcategory] || [])
        .filter(file => !file.isPreviousVersion && file.id !== selectedFile.id)
        .map(file => file.name) : [];

    const handleAddFileRevisionWithVersion = (newRevisionFile, manualVersionCode) => {
        handleAddFileRevision(newRevisionFile, manualVersionCode);
        setShowAddFileModal(false); // Close the modal after adding the revision
    };

    return (
        <div className="document-control-container">
            {errorMessage && (
                <div className="error-message global-error">{errorMessage}</div>
            )}

            <div className="manual-selection-container">
                <div className="select-manual-wrapper">
                    <select value={selectedManual} onChange={handleManualChange} className="manual-select">
                        <option value="">Select Manual</option>
                        <option value="Quality Manual">Quality Manual</option>
                        <option value="Procedure Manual">Procedure Manual</option>
                    </select>
                </div>
                <div className="category-dropdown-wrapper">
                    <select value={selectedCategory} onChange={handleCategoryChange} className="category-select" disabled={!selectedManual}>
                        <option value="">Select Category</option>
                        {getCategories().map((category, index) => (
                            <option key={`${category}-${index}`} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
                <div className="subcategory-dropdown-wrapper">
                    <select value={selectedSubcategory} onChange={handleSubcategoryChange} className="subcategory-select" disabled={!selectedCategory}>
                        <option value="">Select Subcategory</option>
                        {getSubcategories().map((subcategory, index) => (
                            <option key={`${subcategory}-${index}`} value={subcategory}>{subcategory}</option>
                        ))}
                    </select>
                </div>
                <div className="document-control-buttons">
                    <button
                        className="add-button primary-button"
                        style={{ backgroundColor: 'rgb(40, 167, 69)', color: 'white' }}
                        onClick={toggleAddFileModal}
                        disabled={!selectedSubcategory || !showDocumentView || !selectedFile}
                        title={!selectedSubcategory || !showDocumentView || !selectedFile ? "Select and view a file first to add a revision" : `Add a new version to ${selectedFile?.name || 'selected file'}`}
                    >
                        Add Revision
                    </button>
                    <button
                        className="upload-button primary-button"
                        style={{ backgroundColor: 'rgb(0, 123, 255)' }}
                        onClick={toggleUploadModal}
                        title="Upload a new document"
                    >
                        Upload File
                    </button>
                    <button
                        className="draft-button secondary-button"
                        style={{ backgroundColor: 'rgb(108, 117, 125)' }}
                        onClick={toggleDraftModal}
                        title="View saved drafts"
                    >
                        Drafts ({drafts.length})
                    </button>
                </div>
            </div>

            <div className="document-content-area">
                {!showDocumentView && selectedSubcategory && (
                    <div className="files-list">
                        <h3 className="section-title">Files in: {selectedSubcategory}</h3>
                        <table className="files-table">
                            <thead>
                                <tr>
                                    <th>File Name</th>
                                    <th>Effective Date</th>
                                    <th>Document Code</th>
                                    <th>Version Code</th>
                                    <th className="actions-header">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(filesList[selectedSubcategory] || [])
                                    .filter(file => !file.isPreviousVersion)
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .map(file => (
                                        <tr key={file.id}>
                                            <td>{file.name}</td>
                                            <td>{file.effectiveDate}</td>
                                            <td>{file.documentCode}</td>
                                            <td>{file.versionCode}</td>
                                            <td>
                                                <button className="view-button" onClick={() => handleFileClick(file)} title={`View ${file.name} (Version: ${file.versionCode})`}>
                                                    <FaEye />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                {(!filesList[selectedSubcategory] || filesList[selectedSubcategory].filter(file => !file.isPreviousVersion).length === 0) && (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', fontStyle: 'italic', padding: '20px' }}>
                                            No current files found. Use 'Upload New'.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                {!showDocumentView && !selectedSubcategory && (
                    <div className="files-list-placeholder">
                        <p>Please select a Manual, Category, and Subcategory.</p>
                    </div>
                )}

                {showDocumentView && selectedFile && (
                    <div className="document-view-area">
                        <div className="document-headers">
                            <div className="document-header-item">
                                <span className="header-label">Category:</span>
                                <span className="header-value">{selectedCategory}</span>
                            </div>
                            <div className="document-header-item">
                                <span className="header-label">Subcategory:</span>
                                <span className="header-value">{selectedSubcategory}</span>
                            </div>
                        </div>
                        <div className="pdf-viewer-container" style={{ height: containerHeight, position: 'relative' }} ref={pdfContainerRef}>

                            <div className="pdf-viewer-header">
                                <div className="zoom-controls">
                                    <button onClick={zoomOut} className="zoom-button" title="Zoom Out">
                                        <FaSearchMinus />
                                    </button>
                                    <span className="zoom-level">{Math.round(scale * 100)}%</span>
                                    <button onClick={zoomIn} className="zoom-button" title="Zoom In">
                                        <FaSearchPlus />
                                    </button>
                                </div>
                            </div>

                            <div className="pdf-document-container" style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
                                <Document
                                    file={getCurrentPdfUrl()}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    onLoadError={(error) => console.error("Error loading PDF:", error)}
                                >
                                    <Page
                                        pageNumber={1} // Always show page 1 of each document
                                        renderTextLayer={false}
                                        renderAnnotationLayer={false}
                                        className="pdf-page"
                                    />
                                </Document>
                            </div>

                            {/* Fixed position footer at the bottom */}
                            <div className="pdf-viewer-footer" style={{ position: 'absolute', bottom: '10px', left: '0', right: '0', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.9)', padding: '8px 0', borderTop: '1px solid #ddd' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
                                    <button 
                                        onClick={goToPreviousPage} 
                                        disabled={pageNumber <= 1} 
                                        className="page-nav-button" 
                                        title="Previous Version"
                                        style={{ fontSize: '16px', padding: '4px 8px' }}
                                    >
                                        <FaAngleLeft />
                                    </button>
                                    <span className="page-info" style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                        Page {pageNumber} of {numPages || 1}
                                    </span>
                                    <button 
                                        onClick={goToNextPage} 
                                        disabled={pageNumber >= numPages} 
                                        className="page-nav-button" 
                                        title="Next Version"
                                        style={{ fontSize: '16px', padding: '4px 8px' }}
                                    >
                                        <FaAngleRight />
                                    </button>
                                </div>
                                <div className="current-pdf-info" style={{ fontSize: '13px', marginTop: '5px' }}>
                                    <span>File: <strong>{getCurrentPdfName()}</strong> | Version: <strong>{getCurrentPdfVersion()}</strong></span>
                                </div>
                            </div>
                        </div>
                        <div className="document-side-panel">
                            <div className="document-info-section">
                                <h3 className="section-title">Document Details</h3>
                                <div className="info-grid">
                                    <div className="info-label">Document Code:</div><div className="info-value">{documentInfo.documentCode}</div>
                                    <div className="info-label">Current Version:</div><div className="info-value">{documentInfo.revisionNumber}</div>
                                    <div className="info-label">Effective Date:</div><div className="info-value">{documentInfo.effectiveDate}</div>
                                    <div className="info-label">Filename:</div><div className="info-value">{selectedFile.name}</div>
                                </div>
                            </div>
                            <div className="previous-versions-section">
                                <h3 className="section-title">Previous Versions</h3>
                                <div className="revisions-list">
                                    {(filesList[selectedSubcategory] || [])
                                        .filter(file => file.isPreviousVersion && file.documentCode === selectedFile.documentCode && file.subcategory === selectedSubcategory)
                                        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                                        .map(file => (
                                            <div key={file.id} className="revision-item">
                                                <div className="revision-details">
                                                    <div className="revision-text">Version: {file.versionCode}</div>
                                                    <div className="revision-date">Effective: {file.effectiveDate}</div>
                                                    <div className="revision-filename">Filename: {file.name}</div>
                                                </div>
                                            </div>
                                        ))}
                                    {((filesList[selectedSubcategory] || []).filter(file => file.isPreviousVersion && file.documentCode === selectedFile.documentCode && file.subcategory === selectedSubcategory).length === 0) && (
                                        <div className="no-revisions">No previous versions found.</div>
                                    )}
                                </div>
                            </div>
                            <div className="document-actions">
                                <button className="back-button secondary-button" onClick={handleBackToList}>
                                    Back to Files List
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showDocumentView && selectedFile && !pdfFileUrl && (
                    <div className="pdf-placeholder">
                        <p>Loading preview or no data...</p>
                    </div>
                )}
            </div>

            {showUploadModal && (
                <UploadModal
                    onClose={toggleUploadModal}
                    categories={['Quality Manual', 'Procedure Manual']}
                    subcategories={getSubcategoriesWithSubjects()}
                    setPdfFile={handleSetPdfFile}
                    onSaveDraft={handleSaveDraft}
                />
            )}
            {showDraftModal && (
                <DraftModal
                    onClose={toggleDraftModal}
                    drafts={drafts}
                    onSaveDraft={handleSaveDraft}
                    categories={['Quality Manual', 'Procedure Manual']}
                    subcategories={getSubcategoriesWithSubjects()}
                    setUploadedFile={handleSetPdfFile}
                />
            )}
            {showAddFileModal && selectedFile && (
                <AddFileModal
                    onClose={toggleAddFileModal}
                    onAddFile={handleAddFileRevisionWithVersion}
                    existingFilenames={existingFilenamesForModal}
                    currentFilename={selectedFile.name}
                    currentVersionCode={selectedFile.versionCode}
                />
            )}
        </div>
    );
};

export default DocumentControl;
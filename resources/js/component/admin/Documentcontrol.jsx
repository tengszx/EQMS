import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle } from 'lucide-react';
import '../../../css/styles/admin/DocumentControl.css';
import { Document, Page, pdfjs } from 'react-pdf';
import UploadModal from '../../modal/UploadModal';
import DraftModal from '../../modal/DraftModal';
import { PDFDocument } from 'pdf-lib';
import { FaEye } from 'react-icons/fa'; // Import the eye icon

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const AddFileModal = ({ onClose, onAddFile }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
        }
    };

    const handleAddFile = () => {
        if (file) {
            onAddFile(file);
            onClose();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h3 className="modal-title">Add File</h3>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="form-group">
                    <label className="form-label">Upload PDF:</label>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="form-control"
                    />
                </div>

                <div className="form-actions">
                    <button
                        className="primary-button add-button"
                        style={{ backgroundColor: 'rgb(0, 123, 255)', color: 'white' }}
                        onClick={handleAddFile}
                        disabled={!file}
                    >
                        Add
                    </button>
                    <button className="secondary-button" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

const DocumentControl = () => {
    const [selectedManual, setSelectedManual] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showDraftModal, setShowDraftModal] = useState(false);
    const [showAddFileModal, setShowAddFileModal] = useState(false);
    const [showDocumentView, setShowDocumentView] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [numPages, setNumPages] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [scale, setScale] = useState(1); // Start with a scale of 1
    const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });
    const [isPortrait, setIsPortrait] = useState(false);
    const [documentInfo, setDocumentInfo] = useState({
        documentCode: '',
        revisionNumber: '',
        effectiveDate: ''
    });

    const [drafts, setDrafts] = useState([]);
    const [uploadedPdfs, setUploadedPdfs] = useState([]);
    const [pdfPageRanges, setPdfPageRanges] = useState([]);
    const [pageMetadata, setPageMetadata] = useState([]);
    const [revisions, setRevisions] = useState([]);
    const [filesList, setFilesList] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const pdfViewerRef = useRef(null); // Ref to the PDF viewer container

    useEffect(() => {
        console.log('Updated filesList:', filesList);
    }, [filesList]);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        adjustScale(); // Adjust scale after document loads
        console.log(`Document loaded with ${numPages} pages`);
    }

    const onPageLoadSuccess = (page) => {
        const { width, height } = page;
        setPdfDimensions({ width, height });
        const isPortraitOrientation = height > width;
        setIsPortrait(isPortraitOrientation);
        adjustScale(); // Adjust scale after page loads
        console.log(`Page dimensions: ${width}x${height}, orientation: ${isPortraitOrientation ? 'portrait' : 'landscape'}`);
    };

    const adjustScale = () => {
        if (!pdfViewerRef.current || !pdfDimensions.width || !pdfDimensions.height) return;

        const viewerWidth = pdfViewerRef.current.offsetWidth;
        const viewerHeight = pdfViewerRef.current.offsetHeight;

        let newScale = 1;

        if (isPortrait) {
            newScale = Math.min(1, viewerWidth / pdfDimensions.width); // Fit to width for portrait
        } else {
            newScale = Math.min(1, viewerHeight / pdfDimensions.height); // Fit to height for landscape
        }

        setScale(newScale);
    };

    const handleManualChange = (e) => {
        const manual = e.target.value;
        setSelectedManual(manual);
        setSelectedCategory('');
        setSelectedSubcategory('');
    };

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        setSelectedSubcategory('');
    };

    const handleSubcategoryChange = (e) => {
        setSelectedSubcategory(e.target.value);
        setShowDocumentView(false);
    };

    const handleFileClick = (file) => {
        setSelectedFile(file);
        setShowDocumentView(true);

        setDocumentInfo({
            documentCode: file.documentCode || '',
            revisionNumber: file.versionCode || '',
            effectiveDate: file.effectiveDate || ''
        });

        if (file.pdfData) {
            setPdfFile(file.pdfData);
            setCurrentPage(1);
            setUploadedPdfs([file.pdfData]);

            setPdfPageRanges([{
                start: 0,
                end: 0,
                pageCount: 0,
                startPageNumber: 1,
                fileName: file.name
            }]);
        }
    };

    const handleBackToList = () => {
        setShowDocumentView(false);
    };

    const nextPage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentPage(prev => Math.min(prev + 1, numPages || 1));
    };

    const prevPage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const zoomIn = (e) => {
        e.preventDefault();
        setScale(prevScale => Math.min(prevScale + 0.1, 1.5));
    };

    const zoomOut = (e) => {
        e.preventDefault();
        setScale(prevScale => Math.max(prevScale - 0.1, 0.5));
    };

    const resetZoom = (e) => {
        e.preventDefault();
        adjustScale(); // Reset zoom to initial fit
    };

    const toggleUploadModal = () => {
        setShowUploadModal(!showUploadModal);
    };

    const toggleDraftModal = () => {
        setShowDraftModal(!showDraftModal);
    };

    const toggleAddFileModal = () => {
        setShowAddFileModal(!showAddFileModal);
    };

    const handleRevisionSelect = (id) => {
        const selectedRevision = revisions.find(rev => rev.id === id);
        if (selectedRevision) {
            setCurrentPage(selectedRevision.startPage);
        }
        setRevisions(revisions.map(rev => ({
            ...rev,
            selected: rev.id === id
        })));
    };

    const handleSaveDraft = (draftData) => {
        console.log("Saving draft:", draftData);

        const existingDraftIndex = drafts.findIndex(draft => draft.id === draftData.id);

        if (existingDraftIndex !== -1) {
            const updatedDrafts = [...drafts];
            updatedDrafts[existingDraftIndex] = draftData;
            setDrafts(updatedDrafts);
        } else {
            setDrafts([...drafts, draftData]);
        }

        setShowUploadModal(false);
    };

    const combinePdfFiles = async (pdfDataArray) => {
        try {
            if (pdfDataArray.length === 0) return null;

            const mergedPdf = await PDFDocument.create();
            const pageRanges = [];

            let totalPages = 0;
            for (const pdfData of pdfDataArray) {
                const pdfDoc = await PDFDocument.load(pdfData);
                const pageCount = pdfDoc.getPageCount();

                const copiedPages = await mergedPdf.copyPages(pdfDoc, Array.from(Array(pageCount).keys()));
                for (const page of copiedPages) {
                    mergedPdf.addPage(page);
                }

                const startPage = totalPages;
                totalPages += pageCount;

                pageRanges.push({
                    start: startPage,
                    end: totalPages - 1,
                    pageCount: pageCount,
                    startPageNumber: startPage + 1,
                    fileName: selectedFile ? selectedFile.name : `PDF Document ${pageRanges.length + 1}`
                });
            }

            const mergedPdfBytes = await mergedPdf.save();
            setPdfPageRanges(pageRanges);

            console.log('Combined PDFs successfully. Total pages:', totalPages);
            console.log('Page ranges:', pageRanges);

            return mergedPdfBytes.buffer;
        } catch (error) {
            console.error('Error combining PDFs:', error);
            return null;
        }
    };

    const handleSetPdfFile = async (file, documentCode, versionCode, effectiveDate, category, subcategory) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const fileData = e.target.result;

                const fileId = Date.now();

                // Check if a file with the same name already exists in the subcategory
                const existingFileIndex = filesList[subcategory] ? filesList[subcategory].findIndex(f => f.name === file.name) : -1;

                if (existingFileIndex !== -1) {
                    setErrorMessage('File with the same name already exists in this subcategory.');
                    return; // Prevent upload
                } else {
                    setErrorMessage(''); // Clear any previous error message
                }

                const newFile = {
                    id: fileId,
                    name: file.name,
                    effectiveDate: effectiveDate,
                    documentCode,
                    versionCode: versionCode, // Use version code from UploadModal
                    pdfData: fileData,
                    category,
                    subcategory
                };

                console.log('Adding new file:', newFile);

                setFilesList(prevFilesList => {
                    const updatedFilesList = { ...prevFilesList };

                    if (!updatedFilesList[subcategory]) {
                        updatedFilesList[subcategory] = [];
                    }

                    updatedFilesList[subcategory] = [...updatedFilesList[subcategory], newFile];

                    return updatedFilesList;
                });

                setSelectedCategory(category);
                setSelectedSubcategory(subcategory);
                setShowDocumentView(false);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleAddFile = async (file) => {
        if (file && selectedFile) { // Ensure selectedFile exists

            // Check if a file with the same name already exists in the subcategory
            const existingFileIndex = filesList[selectedSubcategory] ? filesList[selectedSubcategory].findIndex(f => f.name === file.name && !f.isPreviousVersion) : -1;

            if (existingFileIndex !== -1) {
                setErrorMessage('File with the same name already exists in this subcategory. Please rename the file.');
                setShowAddFileModal(false); // Close the modal
                return; // Prevent upload
            } else {
                setErrorMessage(''); // Clear any previous error message
            }

            const reader = new FileReader();
            reader.onload = async (e) => {
                const newPdfData = e.target.result;

                // Function to generate a unique version code
                const generateUniqueVersionCode = () => {
                    return Date.now().toString(36); // Convert timestamp to base36 string
                };

                const newVersionCode = generateUniqueVersionCode();

                const newUploadedPdfs = [...uploadedPdfs, newPdfData];
                setUploadedPdfs(newUploadedPdfs);

                const combined = await combinePdfFiles(newUploadedPdfs);
                if (combined) {
                    setPdfFile(combined);
                }

                // Create a copy of the selectedFile for the previous version
                const previousVersion = { ...selectedFile, isPreviousVersion: true };

                const updatedFile = {
                    ...selectedFile,
                    pdfData: combined,
                    versionCode: newVersionCode // Update the version code
                };

                const startPage = pdfPageRanges.length > 0
                    ? pdfPageRanges[pdfPageRanges.length - 1].end + 1
                    : 1;

                const newRevision = {
                    id: Date.now(),
                    subject: selectedSubcategory || 'New Document',
                    revision: `Additional File: ${file.name} - Version ${newVersionCode}`, // Include version in revision
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    selected: true,
                    startPage: startPage,
                    fileName: file.name,
                    versionCode: selectedFile.versionCode // Store the previous version code
                };

                setRevisions(
                    revisions.map(rev => ({ ...rev, selected: false })).concat(newRevision)
                );

                setPdfPageRanges(prevRanges => {
                    const updatedRanges = [...prevRanges];
                    if (updatedRanges.length > 0) {
                        updatedRanges[updatedRanges.length - 1].fileName = file.name;
                    }
                    return updatedRanges;
                });

                if (selectedSubcategory) {
                    setFilesList(prevFilesList => {
                        const updatedFilesList = { ...prevFilesList };

                        if (updatedFilesList[selectedSubcategory]) {
                            // Find the index of the selected file
                            const selectedFileIndex = updatedFilesList[selectedSubcategory].findIndex(f => f.id === selectedFile.id);

                            if (selectedFileIndex !== -1) {
                                // Insert the previous version before the updated file
                                updatedFilesList[selectedSubcategory].splice(selectedFileIndex, 0, previousVersion);

                                // Update the selected file
                                updatedFilesList[selectedSubcategory][selectedFileIndex + 1] = updatedFile;
                            } else {
                                // If the selected file is not found, just add the updated file
                                updatedFilesList[selectedSubcategory] = [...updatedFilesList[selectedSubcategory], updatedFile];
                            }
                        }

                        return updatedFilesList;
                    });
                }

                setSelectedFile(updatedFile);
                setDocumentInfo(prevInfo => ({
                    ...prevInfo,
                    revisionNumber: newVersionCode // Update the displayed version number
                }));
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleSave = () => {
        console.log('File saved successfully!');

        if (pdfFile && selectedFile && selectedSubcategory) {
            const updatedFile = {
                ...selectedFile,
                pdfData: pdfFile
            };

            setFilesList(prevFilesList => {
                const updatedFilesList = { ...prevFilesList };

                if (updatedFilesList[selectedSubcategory]) {
                    updatedFilesList[selectedSubcategory] = updatedFilesList[selectedSubcategory].map(f =>
                        f.id === selectedFile.id ? updatedFile : f
                    );
                }

                return updatedFilesList;
            });

            setSelectedFile(updatedFile);
        }
    };

    const getCategories = () => {
        if (selectedManual === 'Quality Manual') {
            return ['User Guide', 'Context Organizational', 'Leadership',
                'Planning', 'Support', 'Operation',
                'Performance Evaluation', 'Improvement'];
        } else if (selectedManual === 'Procedure Manual') {
            return ['Audit', 'User\'s Guide', 'Context Organizational', 'Leadership', 'Planning', 'Support', 'Operation', 'Performance Evaluation', 'Improvement'];
        }
        return [];
    };

    const getSubcategories = () => {
        switch (selectedCategory) {
            case 'User Guide':
                return ['Foreword', 'Table of Contents', 'Objectives of the Quality Manual',
                    'Background Info of NRCP', 'Authorization', 'Distribution', 'Coding System'];
            case 'Context Organizational':
                return ['Understanding the NRCP and its Context'];
            case 'Leadership':
                return ['Leadership and Commitment', 'Research/Technical Policy Review and Development'];
            case 'Planning':
                return ['Risk Management Process', 'Strategic Planning', 'Operational Planning'];
            case 'Support':
                return ['Control of Maintained Documents', 'Property and Asset Management', 'Utilization of NRCP Vehicle', 'Procurement of Goods and Services', 'Budget Management', 'Procedure for Processing of Disbursement Voucher', 'Payment Process', 'Recruitment, Selection, and Placement', 'Learning and Development', 'Performance Management of Personnel', 'Records Management', 'Preventive Maintenance of ICT Infrastructure', 'Provision of IT Technical Support', 'Performance Monitoring and Evaluation', 'Procedure for Processing of Facilitation and Approval of Documents', 'Procedure for the Facilitation of the Core Management Team (CMT) Meeting'];
            case 'Operation':
                return ['Control of Nonconforming Output', 'Handling Client Complaints', 'Research Grants-In-Aid', 'Membership Application Processing', 'Processing of Requests under the NRCP Expert Engagement Program (NEEP)', 'NRCP Achievement Award', 'Library Service', 'Publication of NRCP Research Journal', 'Dissemination Of NRCP Publications', 'Research Information Translation and Promotion'];
            case 'Performance Evaluation':
                return ['Client Satisfaction Measurement', 'Internal Audit', 'Management Review'];
            case 'Improvement':
                return ['Corrective Action'];
            //Procedure Manual
            case 'Audit':
                return ['Table of Contents', 'Objectives of the Procedures Manual', 'Authorization for the Implementation /Updating Responsibility Distribution of the Procedures Manual', 'Coding System for the Procedures Manual'];
            case 'User\'s Guide':
                return ['Table of Contents', 'Objectives of the Procedures Manual', 'Authorization for the Implementation /Updating Responsibility Distribution of the Procedures Manual', 'Coding System for the Procedures Manual'];
            case 'Context Organizational':
                return ['Understanding the NRCP and its Context'];
            case 'Leadership':
                return ['Leadership and Commitment', 'Research/Technical Policy Review and Development'];
            case 'Planning':
                return ['Risk Management Process', 'Strategic Planning', 'Operational Planning'];
            case 'Support':
                return ['Control of Maintained Documents', 'Property and Asset Management', 'Utilization of NRCP Vehicle', 'Procurement of Goods and Services', 'Budget Management', 'Procedure for Processing of Disbursement Voucher', 'Payment Process', 'Recruitment, Selection, and Placement', 'Learning and Development', 'Performance Management of Personnel', 'Records Management', 'Preventive Maintenance of ICT Infrastructure', 'Provision of IT Technical Support', 'Performance Monitoring and Evaluation', 'Procedure for Processing of Facilitation and Approval of Documents', 'Procedure for the Facilitation of the Core Management Team (CMT) Meeting'];
            case 'Operation':
                return ['Control of Nonconforming Output', 'Handling Client Complaints', 'Research Grants-In-Aid', 'Membership Application Processing', 'Processing of Requests under the NRCP Expert Engagement Program (NEEP)', 'NRCP Achievement Award', 'Library Service', 'Publication of NRCP Research Journal', 'Dissemination Of NRCP Publications', 'Research Information Translation and Promotion'];
            case 'Performance Evaluation':
                return ['Client Satisfaction Measurement', 'Internal Audit', 'Management Review'];
            case 'Improvement':
                return ['Corrective Action'];
            default:
                return [];
        }
    };

    const getSubcategoriesWithSubjects = () => {
        const mapping = {};

        mapping['Quality Manual'] = {
            "User Guide": ['Foreword', 'Table of Contents', 'Objectives of the Quality Manual',
                'Background Info of NRCP', 'Authorization', 'Distribution', 'Coding System'],
            "Context Organizational": ['Overview', 'Organizational Context', 'Stakeholders', 'Scope'],
            "Leadership": ['Leadership and Commitment', 'Policy', 'Organizational Roles, Responsibilities and Authorities'],
            "Planning": ['Planning', 'Quality Objectives', 'Risk and Opportunities', 'Quality Management System and Processes'],
            "Support": ['Support', 'Resources', 'Competence', 'Awareness', 'Communication', 'Documented Information'],
            "Operation": ['Operation', 'Operational Planning and Control', 'Design and Development of Products and Services'],
            "Performance Evaluation": ['Performance Evaluation', 'Monitoring, Measurement, Analysis and Evaluation', 'Internal Audit', 'Management Review'],
            "Improvement": ['Improvement', 'Nonconformity and Corrective Action', 'Continual Improvement']
        };

        mapping['Procedure Manual'] = {
            "Audit": ['Table of Contents', 'Objectives of the Procedures Manual', 'Authorization for the Implementation /Updating Responsibility Distribution of the Procedures Manual', 'Coding System for the Procedures Manual'],
            "User's Guide": ['Table of Contents', 'Objectives of the Procedures Manual', 'Authorization for the Implementation /Updating Responsibility Distribution of the Procedures Manual', 'Coding System for the Procedures Manual'],
            "Context Organizational": ['Understanding the NRCP and its Context'],
            "Leadership": ['Leadership and Commitment', 'Research/Technical Policy Review and Development'],
            "Planning": ['Risk Management Process', 'Strategic Planning', 'Operational Planning'],
            "Support": ['Control of Maintained Documents', 'Property and Asset Management', 'Utilization of NRCP Vehicle', 'Procurement of Goods and Services', 'Budget Management', 'Procedure for Processing of Disbursement Voucher', 'Payment Process', 'Recruitment, Selection, and Placement', 'Learning and Development', 'Performance Management of Personnel', 'Records Management', 'Preventive Maintenance of ICT Infrastructure', 'Provision of IT Technical Support', 'Performance Monitoring and Evaluation', 'Procedure for Processing of Facilitation and Approval of Documents', 'Procedure for the Facilitation of the Core Management Team (CMT) Meeting'],
            "Operation": ['Control of Nonconforming Output', 'Handling Client Complaints', 'Research Grants-In-Aid', 'Membership Application Processing', 'Processing of Requests under the NRCP Expert Engagement Program (NEEP)', 'NRCP Achievement Award', 'Library Service', 'Publication of NRCP Research Journal', 'Dissemination Of NRCP Publications', 'Research Information Translation and Promotion'],
            "Performance Evaluation": ['Client Satisfaction Measurement', 'Internal Audit', 'Management Review'],
            "Improvement": ['Corrective Action']
        };

        return mapping;
    };

    const getDocumentForPage = (pageNumber) => {
        const zeroBasedPage = pageNumber - 1;

        for (let i = 0; i < pdfPageRanges.length; i++) {
            const range = pdfPageRanges[i];
            if (zeroBasedPage >= range.start && zeroBasedPage <= range.end) {
                return i;
            }
        }
        return 0;
    };

    const getFileNameForCurrentPage = () => {
        if (!pdfFile || pdfPageRanges.length === 0) {
            return selectedFile ? selectedFile.name : "No document loaded";
        }

        const docIndex = getDocumentForPage(currentPage);

        if (docIndex >= 0 && docIndex < pdfPageRanges.length && pdfPageRanges[docIndex].fileName) {
            return pdfPageRanges[docIndex].fileName;
        }

        if (selectedFile && selectedFile.name) {
            return selectedFile.name;
        }

        const revisionForPage = revisions.find(rev =>
            rev.startPage <= currentPage &&
            (!rev.endPage || rev.endPage >= currentPage)
        );

        if (revisionForPage && revisionForPage.fileName) {
            return revisionForPage.fileName;
        }

        return selectedFile ? selectedFile.name : "Document";
    };

    return (
        <div className="document-control-container">
            {errorMessage && (
                <div className="error-message">{errorMessage}</div>
            )}
            {/* Manual Selection and Buttons */}
            <div className="manual-selection-container">
                <div className="select-manual-wrapper">
                    <select
                        value={selectedManual}
                        onChange={handleManualChange}
                        className="manual-select"
                    >
                        <option value="">Select Manual</option>
                        <option value="Quality Manual">Quality Manual</option>
                        <option value="Procedure Manual">Procedure Manual</option>
                    </select>
                </div>

                {/* Category Dropdown */}
                <div className="category-dropdown-wrapper">
                    <select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="category-select"
                        disabled={!selectedManual}
                    >
                        <option value="">Select Category</option>
                        {getCategories().map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                {/* Subcategory Dropdown */}
                <div className="subcategory-dropdown-wrapper">
                    <select
                        value={selectedSubcategory}
                        onChange={handleSubcategoryChange}
                        className="subcategory-select"
                        disabled={!selectedCategory}
                    >
                        <option value="">Select Subcategory</option>
                        {getSubcategories().map((subcategory, index) => (
                            <option key={index} value={subcategory}>{subcategory}</option>
                        ))}
                    </select>
                </div>

                <div className="document-control-buttons">
                    <button
                        className="add-button"
                        style={{ backgroundColor: 'rgb(0, 123, 255)', color: 'white' }}
                        onClick={toggleAddFileModal}
                        disabled={!selectedSubcategory || !showDocumentView || !pdfFile}
                    >
                        Add
                    </button>
                    <button
                        className="upload-button"
                        style={{ backgroundColor: 'rgb(0, 123, 255)' }}
                        onClick={toggleUploadModal}
                    >
                        Upload
                    </button>
                    <button
                        className="draft-button"
                        style={{ backgroundColor: 'rgb(0, 123, 255)' }}
                        onClick={toggleDraftModal}
                    >
                        Drafts
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="document-content-area">
                {/* Files List */}
                {!showDocumentView && (
                    <div className="files-list">
                        <h3 className="section-title">Files:</h3>
                        <table className="files-table">
                            <thead>
                                <tr>
                                    <th>File Name</th>
                                    <th>Effective Date</th>
                                    <th>Document Code</th>
                                    <th>Version Code</th>
                                    <th className="actions-header">Actions</th> {/* Added class for styling */}
                                </tr>
                            </thead>
                            <tbody>
                                {(filesList[selectedSubcategory] || []).filter(file => !file.isPreviousVersion).map(file => (
                                    <tr key={file.id}>
                                        <td>{file.name}</td>
                                        <td>{file.effectiveDate}</td>
                                        <td>{file.documentCode}</td>
                                        <td>{file.versionCode}</td>
                                        <td>
                                            <button
                                                className="view-button"
                                                onClick={() => handleFileClick(file)}
                                                title="View"
                                            >
                                                <FaEye /> {/* Use the eye icon */}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {(!filesList[selectedSubcategory] || filesList[selectedSubcategory].filter(file => !file.isPreviousVersion).length === 0) && (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center' }}>No files available. Upload a file to see it here.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Document View Area */}
                {showDocumentView && (
                    <div className="document-view-area">
                        {/* Section and Subject headers */}
                        <div className="document-headers">
                            <div className="document-header-item">
                                <div className="header-label">Section</div>
                                <div className="header-value">{selectedCategory}</div>
                            </div>
                            <div className="document-header-item">
                                <div className="header-label">Subject</div>
                                <div className="header-value">{selectedSubcategory}</div>
                            </div>
                        </div>

                        {/* PDF Viewer Container */}
                        <div className="pdf-container">
                            {/* PDF Viewer with updated styles */}
                            <div className="pdf-viewer" ref={pdfViewerRef}>
                                {pdfFile ? (
                                    <Document
                                        file={pdfFile}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                        onLoadError={(error) => console.error('Error loading PDF:', error)}
                                        className="pdf-document"
                                    >
                                        <div className="pdf-page-wrapper">
                                            <Page
                                                pageNumber={currentPage}
                                                renderTextLayer={false}
                                                renderAnnotationLayer={false}
                                                scale={scale}
                                                onLoadSuccess={onPageLoadSuccess}
                                                className="pdf-page"
                                            />
                                        </div>
                                    </Document>
                                ) : (
                                    <div className="pdf-placeholder">
                                        <p>No document selected. Please upload a PDF document.</p>
                                    </div>
                                )}
                            </div>

                            {/* Zoom Controls */}
                            <div className="zoom-controls">
                                <button onClick={zoomOut} className="zoom-button" title="Zoom Out" type="button">-</button>
                                <span>{Math.round(scale * 100)}%</span>
                                <button onClick={zoomIn} className="zoom-button" title="Zoom In" type="button">+</button>
                                <button onClick={resetZoom} className="reset-zoom-button" title="Reset Zoom" type="button">Reset</button>
                            </div>

                            {/* Page Navigation with source indicator */}
                            <div className="page-navigation">
                                <button
                                    onClick={prevPage}
                                    className="nav-button"
                                    disabled={currentPage <= 1}
                                    type="button"
                                >
                                    ◀
                                </button>
                                <span>
                                    Page {currentPage} of {numPages || 0}
                                    {pdfFile && (
                                        <span className="source-indicator">
                                            {' '}({getFileNameForCurrentPage()})
                                        </span>
                                    )}
                                </span>
                                <button
                                    onClick={nextPage}
                                    className="nav-button"
                                    disabled={currentPage >= (numPages || 0)}
                                    type="button"
                                >
                                    ▶
                                </button>
                            </div>
                        </div>

                        {/* Previous Versions Section */}
                        <div className="previous-versions-section">
                            <h3 className="section-title">Previous Versions:</h3>
                            <div className="revisions-list" style={{ overflowY: 'auto', maxHeight: '200px' }}>
                                {(filesList[selectedSubcategory] || [])
                                    .filter(file => file.isPreviousVersion)
                                    .sort((a, b) => new Date(b.effectiveDate) - new Date(a.effectiveDate)) // Sort by date descending
                                    .map(file => (
                                        <div
                                            key={file.id}
                                            className="revision-item"
                                        >
                                            <div className="revision-details">
                                                <div className="revision-subject">{file.name}</div>
                                                <div className="revision-text">Version: {file.versionCode}</div>
                                                <div className="revision-date">{file.effectiveDate}</div>
                                            </div>
                                        </div>
                                    ))}
                                {((filesList[selectedSubcategory] || []).filter(file => file.isPreviousVersion).length === 0) && (
                                    <div className="no-revisions">No previous versions available.</div>
                                )}
                            </div>
                        </div>

                        {/* Document Info Section */}
                        <div className="document-info-section">
                            <div className="info-row">
                                <div className="info-label">Document Code</div>
                                <div className="info-value">{documentInfo.documentCode}</div>
                            </div>
                            <div className="info-row">
                                <div className="info-label">Version Number</div>
                                <div className="info-value">{documentInfo.revisionNumber}</div>
                            </div>
                            <div className="info-row">
                                <div className="info-label">Effectivity Date</div>
                                <div className="info-value">{documentInfo.effectiveDate}</div>
                            </div>
                        </div>

                        {/* Back to List Button */}
                        <div className="document-actions">
                            <button
                                className="back-button"
                                style={{ backgroundColor: 'rgb(0, 123, 255)' }}
                                onClick={handleBackToList}
                                type="button"
                            >
                                Back to List
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <UploadModal
                    onClose={toggleUploadModal}
                    categories={['Quality Manual', 'Procedure Manual']}
                    subcategories={getSubcategoriesWithSubjects()}
                    setPdfFile={handleSetPdfFile}
                    onSaveDraft={handleSaveDraft}
                />
            )}

            {/* Draft Modal */}
            {showDraftModal && (
                <DraftModal
                    onClose={toggleDraftModal}
                    drafts={drafts}
                    onSaveDraft={handleSaveDraft}
                    categories={['Quality Manual', 'Procedure Manual']}
                    subcategories={getSubcategoriesWithSubjects()}
                    setPdfFile={handleSetPdfFile}
                />
            )}

            {/* Add File Modal */}
            {showAddFileModal && (
                <AddFileModal
                    onClose={toggleAddFileModal}
                    onAddFile={handleAddFile}
                />
            )}
        </div>
    );
};

export default DocumentControl;

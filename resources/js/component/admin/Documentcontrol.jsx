import React, { useState, useEffect } from 'react';
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
    const [scale, setScale] = useState(0.8);
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

    useEffect(() => {
        console.log('Updated filesList:', filesList);
    }, [filesList]);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setScale(0.8);
        console.log(`Document loaded with ${numPages} pages`);
    }

    const onPageLoadSuccess = (page) => {
        const { width, height } = page;
        setPdfDimensions({ width, height });
        const isPortraitOrientation = height > width;
        setIsPortrait(isPortraitOrientation);

        // Adjust scale based on orientation for better initial readability
        if (isPortraitOrientation) {
            setScale(0.5); // Smaller initial scale for portrait
        } else {
            setScale(0.8); // Default scale for landscape
        }

        console.log(`Page dimensions: ${width}x${height}, orientation: ${isPortraitOrientation ? 'portrait' : 'landscape'}`);
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
        setScale(isPortrait ? 0.9 : 0.8);
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

    const handleSetPdfFile = async (file, documentCode, versionCode, effectiveDate, section, subject) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const fileData = e.target.result;

                const fileId = Date.now();

                const newFile = {
                    id: fileId,
                    name: file.name,
                    effectiveDate: effectiveDate,
                    documentCode,
                    versionCode,
                    pdfData: fileData,
                    section,
                    subject
                };

                console.log('Adding new file:', newFile);

                setFilesList(prevFilesList => {
                    const updatedFilesList = { ...prevFilesList };

                    if (!updatedFilesList[subject]) {
                        updatedFilesList[subject] = [];
                    }

                    updatedFilesList[subject] = [...updatedFilesList[subject], newFile];

                    return updatedFilesList;
                });

                setSelectedCategory(section);
                setSelectedSubcategory(subject);
                setShowDocumentView(false);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleAddFile = async (file) => {
        if (file && pdfFile) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const newPdfData = e.target.result;

                const newUploadedPdfs = [...uploadedPdfs, newPdfData];
                setUploadedPdfs(newUploadedPdfs);

                const combined = await combinePdfFiles(newUploadedPdfs);
                if (combined) {
                    setPdfFile(combined);
                }

                if (selectedFile) {
                    const updatedFile = {
                        ...selectedFile,
                        pdfData: combined
                    };

                    const startPage = pdfPageRanges.length > 0
                        ? pdfPageRanges[pdfPageRanges.length - 1].end + 1
                        : 1;

                    const newRevision = {
                        id: revisions.length + 1,
                        subject: selectedSubcategory || 'New Document',
                        revision: `Additional File: ${file.name}`,
                        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        selected: true,
                        startPage: startPage,
                        fileName: file.name
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
                                updatedFilesList[selectedSubcategory] = updatedFilesList[selectedSubcategory].map(f =>
                                    f.id === selectedFile.id ? updatedFile : f
                                );
                            }

                            return updatedFilesList;
                        });
                    }

                    setSelectedFile(updatedFile);
                }
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

    const getSubcategories = () => {
        if (selectedManual === 'Quality Manual') {
            return ['User Guide', 'Context Organizational', 'Leadership',
                'Planning', 'Support', 'Operation',
                'Performance Evaluation', 'Improvement'];
        }
        return [];
    };

    const getSubjects = () => {
        switch (selectedCategory) {
            case 'User Guide':
                return ['Foreword', 'Table of Contents', 'Objectives of the Quality Manual',
                    'Background Info of NRCP', 'Authorization', 'Distribution', 'Coding System'];
            case 'Context Organizational':
                return ['Overview', 'Organizational Context', 'Stakeholders', 'Scope'];
            case 'Leadership':
                return ['Leadership and Commitment', 'Policy', 'Organizational Roles, Responsibilities and Authorities'];
            case 'Planning':
                return ['Planning', 'Quality Objectives', 'Risk and Opportunities', 'Quality Management System and Processes'];
            case 'Support':
                return ['Support', 'Resources', 'Competence', 'Awareness', 'Communication', 'Documented Information'];
            case 'Operation':
                return ['Operation', 'Operational Planning and Control', 'Design and Development of Products and Services'];
            case 'Performance Evaluation':
                return ['Performance Evaluation', 'Monitoring, Measurement, Analysis and Evaluation', 'Internal Audit', 'Management Review'];
            case 'Improvement':
                return ['Improvement', 'Nonconformity and Corrective Action', 'Continual Improvement'];
            default:
                return [];
        }
    };

    const getSubcategoriesWithSubjects = () => {
        const mapping = {};

        mapping['Quality Manual'] = {};

        mapping['User Guide'] = ['Foreword', 'Table of Contents', 'Objectives of the Quality Manual',
            'Background Info of NRCP', 'Authorization', 'Distribution', 'Coding System'];

        const otherCategories = ['Context Organizational', 'Leadership', 'Planning', 'Support',
            'Operation', 'Performance Evaluation', 'Improvement'];

        otherCategories.forEach(category => {
            switch (category) {
                case 'Context Organizational':
                    mapping[category] = ['Overview', 'Organizational Context', 'Stakeholders', 'Scope'];
                    break;
                case 'Leadership':
                    mapping[category] = ['Leadership and Commitment', 'Policy', 'Organizational Roles, Responsibilities and Authorities'];
                    break;
                case 'Planning':
                    mapping[category] = ['Planning', 'Quality Objectives', 'Risk and Opportunities', 'Quality Management System and Processes'];
                    break;
                case 'Support':
                    mapping[category] = ['Support', 'Resources', 'Competence', 'Awareness', 'Communication', 'Documented Information'];
                    break;
                case 'Operation':
                    mapping[category] = ['Operation', 'Operational Planning and Control', 'Design and Development of Products and Services'];
                    break;
                case 'Performance Evaluation':
                    mapping[category] = ['Performance Evaluation', 'Monitoring, Measurement, Analysis and Evaluation', 'Internal Audit', 'Management Review'];
                    break;
                case 'Improvement':
                    mapping[category] = ['Improvement', 'Nonconformity and Corrective Action', 'Continual Improvement'];
                    break;
                default:
                    mapping[category] = [];
            }
        });

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
                        {getSubcategories().map((category, index) => (
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
                        {getSubjects().map((subcategory, index) => (
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
                                {(filesList[selectedSubcategory] || []).map(file => (
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
                                {(!filesList[selectedSubcategory] || filesList[selectedSubcategory].length === 0) && (
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
                            <div className="pdf-viewer">
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
                                                height={isPortrait ? window.innerHeight * 0.65 : null}
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
                            <div className="revisions-list">
                                {revisions.length > 0 ? (
                                    revisions.map(revision => (
                                        <div
                                            key={revision.id}
                                            className={`revision-item ${revision.selected ? 'selected' : ''}`}
                                            onClick={() => handleRevisionSelect(revision.id)}
                                        >
                                            <div className="revision-details">
                                                <div className="revision-subject">{revision.subject}</div>
                                                <div className="revision-text">{revision.revision}</div>
                                                <div className="revision-date">{revision.date}</div>
                                                <div className="revision-page-start">
                                                    Page Start: {revision.startPage || 1}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
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
                    categories={['Quality Manual']}
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
                    categories={['Quality Manual']}
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

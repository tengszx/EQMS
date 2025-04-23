import React, { useState, useEffect } from 'react'; // Added useEffect
import '../../css/styles/modal/AddFileModal.css';

const AddFileModal = ({ onClose, onAddFile, existingFilenames, currentFilename, currentVersionCode }) => {
    const [file, setFile] = useState(null);
    const [filenameDisplay, setFilenameDisplay] = useState('');
    const [filenameError, setFilenameError] = useState('');
    const [versionNumber, setVersionNumber] = useState('');
    const [versionError, setVersionError] = useState('');

    // Reset errors when modal opens or critical props change
    useEffect(() => {
        setFilenameError('');
        setVersionError('');
        setFile(null);
        setFilenameDisplay('');
        setVersionNumber('');
    }, [currentFilename, currentVersionCode]); // Depend on props that define the context

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(null); // Reset file state first
        setFilenameDisplay('');
        setFilenameError(''); // Clear previous error on new selection

        if (selectedFile) {
            setFilenameDisplay(selectedFile.name); // Show the selected filename

            if (selectedFile.type !== 'application/pdf') {
                setFilenameError('Please select a PDF file.');
            } else {
                // Perform the preliminary check right away for UI feedback
                if (selectedFile.name !== currentFilename && existingFilenames.includes(selectedFile.name)) {
                    // Set an error message in the UI
                    setFilenameError(`Filename "${selectedFile.name}" already exists for another document. Please rename.`);
                }
                 // If passes preliminary checks, set the file
                setFile(selectedFile);
            }
        }
    };

    const handleVersionChange = (e) => {
        const value = e.target.value;
        setVersionNumber(value);
        setVersionError(''); // Clear previous error

        if (!value) {
             setVersionError('Please enter a version number.');
             return;
        }

        if (!/^\d+(\.\d+)?$/.test(value)) {
            setVersionError('Invalid version format (e.g., 1, 1.0, 2.5).');
        } else if (value === String(currentVersionCode)) { // Ensure comparison is correct (string vs string/number)
             setVersionError('Version number must be different from the current version.');
        }
        // Optional: Check if version is numerically lower than current
        // else if (parseFloat(value) < parseFloat(currentVersionCode)) {
        //     setVersionError('New version should generally be higher than the current version.');
        // }
    };

    const handleAddFileClick = () => {
        let hasError = false;
         setFilenameError(''); // Clear previous submit errors
         setVersionError(''); // Clear previous submit errors

        // --- Run all validations before proceeding ---

        // 1. File selected?
        if (!file) {
            setFilenameError('Please select a PDF file to add as a revision.');
            hasError = true;
        }

        // 2. Version entered?
        if (!versionNumber) {
            setVersionError('Please enter a version number.');
            hasError = true;
        } else {
             // 2a. Re-validate version format and comparison on submit
             if (!/^\d+(\.\d+)?$/.test(versionNumber)) {
                setVersionError('Invalid version format (e.g., 1, 1.0, 2.5).');
                hasError = true;
             } else if (versionNumber === String(currentVersionCode)) {
                 setVersionError('Version number must be different from the current version.');
                 hasError = true;
             }
             // Optional check for lower version
             // else if (parseFloat(versionNumber) < parseFloat(currentVersionCode)) {
             //     setVersionError('New version should generally be higher than the current version.');
             //     hasError = true;
             // }
        }

        // 3. *** PRELIMINARY Filename Check (Modal Level) ***
        // This provides immediate alert feedback before calling the parent.
        if (file && file.name !== currentFilename && existingFilenames.includes(file.name)) {
            // Show the alert box as requested
            alert("The filename already exists for another current document in this subcategory. Please rename the file and try uploading again. Thank you.");
            // Also update the UI error state
            setFilenameError(`Filename "${file.name}" already exists. Please rename.`);
            hasError = true; // Mark that there's an error
        }

        // 4. If any validation failed, stop here.
        if (hasError) {
            return;
        }

        // 5. If all modal-level checks pass, call the parent function (`onAddFile`)
        // The parent (`DocumentControl`) will perform the *final* duplicate check before updating state.
        onAddFile(file, versionNumber);

        // 6. *** DO NOT CLOSE THE MODAL HERE ***
        // The parent (`DocumentControl`) is now responsible for closing the modal
        // via `setShowAddFileModal(false)` only after its own checks pass and the state is successfully updated.
        // onClose(); // REMOVED
    };

    return (
        <div className="add-file-modal-overlay">
            <div className="add-file-modal-container">
                <div className="add-file-modal-header">
                    <h3 className="add-file-modal-title">Add File Revision</h3>
                    <button className="add-file-close-button" onClick={onClose}>×</button>
                </div>

                <div className="add-file-modal-body">
                    <p className="add-file-modal-info">Upload a new version for the document: <strong>{currentFilename}</strong></p>

                    <div className="add-file-form-group">
                        <label className="add-file-form-label" htmlFor="versionNumberInputAdd">Enter New Version Number:</label>
                        <input
                            id="versionNumberInputAdd"
                            type="text"
                            value={versionNumber}
                            onChange={handleVersionChange}
                            className={`add-file-form-control ${versionError ? 'input-error' : ''}`} // Add 'input-error' class if error
                            placeholder={`Must be different from current: ${currentVersionCode}`}
                            aria-invalid={!!versionError} // Accessibility
                            aria-describedby={versionError ? "version-error-msg" : undefined}
                        />
                        {versionError && (
                            <div id="version-error-msg" className="add-file-error-message-box" role="alert">
                                {versionError}
                            </div>
                        )}
                    </div>

                    <div className="add-file-form-group">
                        <label className="add-file-form-label" htmlFor="fileInputAdd">Select New PDF Version:</label>
                        <input
                            id="fileInputAdd"
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className={`add-file-form-control ${filenameError ? 'input-error' : ''}`} // Add 'input-error' class if error
                            aria-invalid={!!filenameError} // Accessibility
                            aria-describedby={filenameError ? "filename-error-msg" : undefined}
                        />
                         {filenameDisplay && !filenameError && (
                             <div className="add-file-selected-filename">Selected: {filenameDisplay}</div>
                         )}
                        {filenameError && (
                            <div id="filename-error-msg" className="add-file-error-message-box" role="alert">
                                {filenameError}
                            </div>
                        )}
                    </div>
                </div>

                <div className="add-file-modal-footer">
                    <button
                        className="add-file-primary-button"
                        style={{ backgroundColor: 'rgb(40, 167, 69)', color: 'white' }}
                        onClick={handleAddFileClick}
                        // Disable button based on initial validation state (file selected, version entered)
                        // The click handler performs the more detailed checks.
                        disabled={!file || !versionNumber}
                        title={!file ? "Select a PDF file first" : (!versionNumber ? "Enter a version number" : "Add this file as a new revision")}
                    >
                        Add Revision
                    </button>
                    <button className="add-file-secondary-button" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default AddFileModal;

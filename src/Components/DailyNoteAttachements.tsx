import { useState } from 'react';

function DailyNoteAttachments() {
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleEventChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
        event.target.value = '';
    };

    const handleRemoveFile = (indexToRemove) => {
        setSelectedFiles((prevFiles) =>
            prevFiles.filter((_, index) => index !== indexToRemove)
        );
    };

    return (
        <div className="container mt-4" style={{ maxWidth: '500px' }}>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label fw-bold">Note Title</label>
                    <input type="text" id="title" className="form-control" />
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label fw-bold">Description :</label>
                    <textarea 
                        id="description" 
                        rows={4} 
                        className="form-control" 
                        placeholder="Enter Description here"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="file-upload" className="form-label fw-bold">Attach Files:</label>
                    {/* form-control-sm reduces the file input and button size in Bootstrap */}
                    <input
                        id="file-upload"
                        type="file"
                        multiple
                        onChange={handleEventChange}
                        className="form-control form-control-sm"
                    />
                </div>

                {/* Selected Files Preview List */}
                {selectedFiles.length > 0 && (
                    <div className="mb-3">
                        <h6 className="fw-bold mb-2">Selected ({selectedFiles.length}):</h6>
                        <ul className="list-group">
                            {selectedFiles.map((file, index) => (
                                <li 
                                    key={`${file.name}-${index}`} 
                                    className="list-group-item d-flex justify-content-between align-items-center py-1 px-3 fs-6"
                                >
                                    <span className="text-truncate me-2" style={{ maxWidth: '300px' }}>
                                        {file.name} <small className="text-muted">({(file.size / 1024).toFixed(1)} KB)</small>
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFile(index)}
                                        className="btn btn-sm btn-outline-danger border-0 px-1 py-0"
                                        aria-label="Remove file"
                                    >
                                        ✕
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default DailyNoteAttachments;
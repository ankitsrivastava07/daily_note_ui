import { useState } from 'react';

function CreateWorkspace({ onWorkspaceCreated }) {
    const [workspaceName, setWorkspaceName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = workspaceName.trim();
        if (!trimmed) return;

        console.log('Workspace Created:', trimmed);
        
        if (onWorkspaceCreated) {
            onWorkspaceCreated(trimmed);
        }

        setWorkspaceName('');
    };

    return (
        <div className="card shadow-sm border-0 p-3" style={{ maxWidth: '400px' }}>
            <h6 className="fw-bold mb-3">Create Workspace</h6>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="workspaceName" className="form-label fw-semibold small">
                        Workspace Name <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        id="workspaceName"
                        className="form-control form-control-sm"
                        placeholder="e.g. Marketing, Development, Personal"
                        value={workspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                        required
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-sm btn-primary px-3">
                        Create
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateWorkspace;
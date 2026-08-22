import { useState } from 'react';

function CreateNotePage() {
    const getCurrentDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    const [formData, setFormData] = useState({
        title: '',
        category: 'Work',
        priority: 'Medium',
        status: 'Draft',
        isPinned: false,
        isConfidential: false,
        isRecurring: false,
        recurringFrequency: 'Weekly',
        colorAccent: '#0d6efd',
        assignee: '',
        location: '',
        project: 'General',
        visibility: 'Team',
        version: 'v1.0',
        reminderAlert: '15_mins',
        customReminderDateTime: getCurrentDateTime(),
        estimatedTime: '',
        createdDateTime: getCurrentDateTime(),
        dueDateTime: '',
        tags: '',
        referenceUrl: '',
        keyTakeaways: '',
        description: '',
    });

    const [todoList, setTodoList] = useState([]);
    const [todoInput, setTodoInput] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handlePrioritySelect = (priorityValue) => {
        setFormData((prev) => ({ ...prev, priority: priorityValue }));
    };

    const handleAddTodo = () => {
        if (!todoInput.trim()) return;
        setTodoList((prev) => [...prev, { text: todoInput, done: false }]);
        setTodoInput('');
    };

    const handleToggleTodo = (index) => {
        setTodoList((prev) =>
            prev.map((item, i) => (i === index ? { ...item, done: !item.done } : item))
        );
    };

    const handleRemoveTodo = (index) => {
        setTodoList((prev) => prev.filter((_, i) => i !== index));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
        e.target.value = '';
    };

    const handleRemoveFile = (indexToRemove) => {
        setSelectedFiles((prevFiles) =>
            prevFiles.filter((_, index) => index !== indexToRemove)
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted Note Payload:", { ...formData, todos: todoList, files: selectedFiles });
        alert("Note created successfully!");
    };

    const priorityOptions = [
        { label: 'Low', value: 'Low', activeClass: 'btn-success', inactiveClass: 'btn-outline-success' },
        { label: 'Medium', value: 'Medium', activeClass: 'btn-warning text-dark', inactiveClass: 'btn-outline-warning' },
        { label: 'High', value: 'High', activeClass: 'btn-danger', inactiveClass: 'btn-outline-danger' },
    ];

    const colorPresets = ['#0d6efd', '#6f42c1', '#d63384', '#fd7e14', '#198754', '#20c997'];

    return (
        <div className="container py-4" style={{ maxWidth: '760px' }}>
            <div 
                className="card shadow border-0 rounded-3 overflow-hidden" 
                style={{ borderTop: `6px solid ${formData.colorAccent}` }}
            >
                {/* Header */}
                <div className="card-header bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="mb-0 fw-bold text-dark">Create New Note</h5>
                        <small className="text-muted">Detailed task, project, and meeting notes</small>
                    </div>
                    
                    <div className="d-flex gap-2">
                        <div className="form-check form-switch bg-light border px-3 py-1 rounded-pill">
                            <input
                                className="form-check-input me-1"
                                type="checkbox"
                                id="isConfidential"
                                name="isConfidential"
                                checked={formData.isConfidential}
                                onChange={handleInputChange}
                            />
                            <label className="form-check-label small fw-semibold cursor-pointer text-danger" htmlFor="isConfidential">
                                {formData.isConfidential ? '🔒 Confidential' : 'Confidential'}
                            </label>
                        </div>

                        <div className="form-check form-switch bg-light border px-3 py-1 rounded-pill">
                            <input
                                className="form-check-input me-1"
                                type="checkbox"
                                id="isPinned"
                                name="isPinned"
                                checked={formData.isPinned}
                                onChange={handleInputChange}
                            />
                            <label className="form-check-label small fw-semibold cursor-pointer" htmlFor="isPinned">
                                {formData.isPinned ? '📌 Pinned' : 'Pin'}
                            </label>
                        </div>
                    </div>
                </div>

                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        
                        {/* Title & Color Accent */}
                        <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <label htmlFor="title" className="form-label fw-semibold mb-0 fs-6">
                                    Title <span className="text-danger">*</span>
                                </label>
                                
                                <div className="d-flex align-items-center gap-1">
                                    <small className="text-muted me-1">Theme Color:</small>
                                    {colorPresets.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setFormData((prev) => ({ ...prev, colorAccent: color }))}
                                            className="btn p-0 rounded-circle"
                                            style={{
                                                backgroundColor: color,
                                                width: '18px',
                                                height: '18px',
                                                border: formData.colorAccent === color ? '2px solid #000' : 'none',
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleInputChange}
                                className="form-control form-control-lg fs-6"
                                placeholder="e.g., Q3 Marketing Roadmap Sync"
                            />
                        </div>

                        {/* Priority Selector */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold small d-block mb-1">Priority Level</label>
                            <div className="btn-group w-100" role="group">
                                {priorityOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handlePrioritySelect(option.value)}
                                        className={`btn btn-sm ${
                                            formData.priority === option.value
                                                ? option.activeClass
                                                : option.inactiveClass
                                        } fw-semibold`}
                                    >
                                        {formData.priority === option.value ? '✓ ' : ''}{option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category, Status, Project & Visibility */}
                        <div className="row g-2 mb-3">
                            <div className="col-sm-3">
                                <label htmlFor="category" className="form-label fw-semibold small mb-1">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="form-select form-select-sm"
                                >
                                    <option value="Work">💼 Work</option>
                                    <option value="Personal">🏠 Personal</option>
                                    <option value="Ideas">💡 Ideas</option>
                                    <option value="Meeting">📅 Meeting</option>
                                    <option value="Research">🔍 Research</option>
                                </select>
                            </div>

                            <div className="col-sm-3">
                                <label htmlFor="status" className="form-label fw-semibold small mb-1">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="form-select form-select-sm"
                                >
                                    <option value="Draft">📝 Draft</option>
                                    <option value="In Progress">⏳ In Progress</option>
                                    <option value="Completed">✅ Completed</option>
                                </select>
                            </div>

                            <div className="col-sm-3">
                                <label htmlFor="project" className="form-label fw-semibold small mb-1">Project / Board</label>
                                <select
                                    id="project"
                                    name="project"
                                    value={formData.project}
                                    onChange={handleInputChange}
                                    className="form-select form-select-sm"
                                >
                                    <option value="General">General</option>
                                    <option value="Sprint 42">Sprint 42</option>
                                    <option value="Website Redesign">Website Redesign</option>
                                    <option value="Product Launch">Product Launch</option>
                                </select>
                            </div>

                            <div className="col-sm-3">
                                <label htmlFor="visibility" className="form-label fw-semibold small mb-1">Visibility</label>
                                <select
                                    id="visibility"
                                    name="visibility"
                                    value={formData.visibility}
                                    onChange={handleInputChange}
                                    className="form-select form-select-sm"
                                >
                                    <option value="Private">🔒 Private</option>
                                    <option value="Team">👥 Team</option>
                                    <option value="Public">🌐 Public</option>
                                </select>
                            </div>
                        </div>

                        {/* Assignee, Location & Version */}
                        <div className="row g-2 mb-3">
                            <div className="col-sm-5">
                                <label htmlFor="assignee" className="form-label fw-semibold small mb-1">Assignee / Owner</label>
                                <input
                                    type="text"
                                    id="assignee"
                                    name="assignee"
                                    value={formData.assignee}
                                    onChange={handleInputChange}
                                    className="form-control form-control-sm"
                                    placeholder="e.g. John Doe"
                                />
                            </div>

                            <div className="col-sm-4">
                                <label htmlFor="location" className="form-label fw-semibold small mb-1">Location / Venue</label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="form-control form-control-sm"
                                    placeholder="e.g. Zoom / Conf Room B"
                                />
                            </div>

                            <div className="col-sm-3">
                                <label htmlFor="version" className="form-label fw-semibold small mb-1">Version</label>
                                <input
                                    type="text"
                                    id="version"
                                    name="version"
                                    value={formData.version}
                                    onChange={handleInputChange}
                                    className="form-control form-control-sm"
                                    placeholder="e.g. v1.0"
                                />
                            </div>
                        </div>

                        {/* Custom Date & Time Fields */}
                        <div className="row g-2 mb-3">
                            <div className="col-sm-4">
                                <label htmlFor="createdDateTime" className="form-label fw-semibold small mb-1">
                                    Created Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    id="createdDateTime"
                                    name="createdDateTime"
                                    value={formData.createdDateTime}
                                    onChange={handleInputChange}
                                    className="form-control form-control-sm"
                                />
                            </div>

                            <div className="col-sm-4">
                                <label htmlFor="dueDateTime" className="form-label fw-semibold small mb-1">
                                    Due Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    id="dueDateTime"
                                    name="dueDateTime"
                                    value={formData.dueDateTime}
                                    onChange={handleInputChange}
                                    className="form-control form-control-sm"
                                />
                            </div>

                            <div className="col-sm-4">
                                <label htmlFor="estimatedTime" className="form-label fw-semibold small mb-1">Est. Time (mins)</label>
                                <input
                                    type="number"
                                    id="estimatedTime"
                                    name="estimatedTime"
                                    value={formData.estimatedTime}
                                    onChange={handleInputChange}
                                    className="form-control form-control-sm"
                                    placeholder="e.g. 45"
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Reminder Settings (Includes Custom DateTime Option) */}
                        <div className="row g-2 mb-3 align-items-center">
                            <div className="col-sm-5">
                                <label htmlFor="reminderAlert" className="form-label fw-semibold small mb-1">
                                    Reminder Alert
                                </label>
                                <select
                                    id="reminderAlert"
                                    name="reminderAlert"
                                    value={formData.reminderAlert}
                                    onChange={handleInputChange}
                                    className="form-select form-select-sm"
                                >
                                    <option value="none">None</option>
                                    <option value="15_mins">15 mins before</option>
                                    <option value="1_hour">1 hour before</option>
                                    <option value="1_day">1 day before</option>
                                    <option value="custom">⏰ Custom Date & Time...</option>
                                </select>
                            </div>

                            {formData.reminderAlert === 'custom' && (
                                <div className="col-sm-7">
                                    <label htmlFor="customReminderDateTime" className="form-label fw-semibold small mb-1">
                                        Custom Reminder Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="customReminderDateTime"
                                        name="customReminderDateTime"
                                        value={formData.customReminderDateTime}
                                        onChange={handleInputChange}
                                        className="form-control form-control-sm border-primary"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Recurring Toggle */}
                        <div className="row g-2 mb-3 align-items-center">
                            <div className="col-auto">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="isRecurring"
                                        name="isRecurring"
                                        checked={formData.isRecurring}
                                        onChange={handleInputChange}
                                    />
                                    <label className="form-check-label small fw-semibold" htmlFor="isRecurring">
                                        Repeat Note Automatically
                                    </label>
                                </div>
                            </div>
                            {formData.isRecurring && (
                                <div className="col-auto">
                                    <select
                                        name="recurringFrequency"
                                        value={formData.recurringFrequency}
                                        onChange={handleInputChange}
                                        className="form-select form-select-sm"
                                    >
                                        <option value="Daily">Daily</option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="Monthly">Monthly</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Key Takeaways */}
                        <div className="mb-3">
                            <label htmlFor="keyTakeaways" className="form-label fw-semibold small mb-1">
                                Key Takeaways / Highlights
                            </label>
                            <input
                                type="text"
                                id="keyTakeaways"
                                name="keyTakeaways"
                                value={formData.keyTakeaways}
                                onChange={handleInputChange}
                                className="form-control form-control-sm"
                                placeholder="e.g., Agreed on launch date for Oct 15th"
                            />
                        </div>

                        {/* Description */}
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label fw-semibold small mb-1">Description / Detailed Content</label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleInputChange}
                                className="form-control form-control-sm"
                                placeholder="Type your detailed note body here..."
                            />
                        </div>

                        {/* Checklist */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold small mb-1">Checklist / Action Items</label>
                            <div className="input-group input-group-sm mb-2">
                                <input
                                    type="text"
                                    value={todoInput}
                                    onChange={(e) => setTodoInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTodo())}
                                    className="form-control"
                                    placeholder="Add task and press Enter..."
                                />
                                <button type="button" onClick={handleAddTodo} className="btn btn-outline-primary">
                                    + Add Item
                                </button>
                            </div>

                            {todoList.length > 0 && (
                                <ul className="list-group rounded-2 mb-2">
                                    {todoList.map((todo, idx) => (
                                        <li key={idx} className="list-group-item d-flex justify-content-between align-items-center py-1 px-3 bg-light">
                                            <div className="form-check m-0">
                                                <input
                                                    type="checkbox"
                                                    checked={todo.done}
                                                    onChange={() => handleToggleTodo(idx)}
                                                    className="form-check-input me-2"
                                                    id={`todo-${idx}`}
                                                />
                                                <label
                                                    htmlFor={`todo-${idx}`}
                                                    className={`form-check-label small ${todo.done ? 'text-decoration-line-through text-muted' : ''}`}
                                                >
                                                    {todo.text}
                                                </label>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTodo(idx)}
                                                className="btn btn-sm text-danger border-0 p-0"
                                            >
                                                ✕
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Tags & Reference URL */}
                        <div className="row g-2 mb-3">
                            <div className="col-sm-6">
                                <label htmlFor="tags" className="form-label fw-semibold small mb-1">Tags</label>
                                <input
                                    type="text"
                                    id="tags"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                    className="form-control form-control-sm"
                                    placeholder="e.g. design, urgent"
                                />
                            </div>

                            <div className="col-sm-6">
                                <label htmlFor="referenceUrl" className="form-label fw-semibold small mb-1">Reference URL</label>
                                <input
                                    type="url"
                                    id="referenceUrl"
                                    name="referenceUrl"
                                    value={formData.referenceUrl}
                                    onChange={handleInputChange}
                                    className="form-control form-control-sm"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        {/* Attachments */}
                        <div className="mb-3">
                            <label htmlFor="file-upload" className="form-label fw-semibold small mb-1">Attach Files</label>
                            <input
                                id="file-upload"
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="form-control form-control-sm"
                            />
                        </div>

                        {selectedFiles.length > 0 && (
                            <div className="mb-3">
                                <span className="small fw-semibold text-muted d-block mb-2">
                                    Selected Files ({selectedFiles.length}):
                                </span>
                                <ul className="list-group">
                                    {selectedFiles.map((file, index) => (
                                        <li
                                            key={`${file.name}-${index}`}
                                            className="list-group-item d-flex justify-content-between align-items-center py-1 px-3 bg-light"
                                        >
                                            <span className="text-truncate small" style={{ maxWidth: '350px' }}>
                                                📄 {file.name} <small className="text-muted">({(file.size / 1024).toFixed(1)} KB)</small>
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFile(index)}
                                                className="btn btn-sm btn-outline-danger border-0 px-1 py-0"
                                            >
                                                ✕
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Form Actions */}
                        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                            <button type="button" className="btn btn-sm btn-outline-secondary px-3">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-sm btn-primary px-4 fw-semibold">
                                Save Note
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateNotePage;
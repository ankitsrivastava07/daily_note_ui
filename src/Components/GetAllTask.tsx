import React, { useEffect, useState } from "react";
import "./CSS/GetAllTask.css";

// Interface defining the shape of a Task object returned by the API
interface Task {
    id: string;
    title?: string;
    name?: string;
    description?: string;
    content?: string;
    priority?: string;
    status?: string;
    dueDate?: string;
    dueTime?: string;
    meridiem?: string;
}

// Interface for API Response envelope if applicable
interface ApiResponse {
    data?: Task[];
    message?: string;
}

function GetAllTask() {
    // Explicitly typed state variables
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const [limit, setLimit] = useState<number>(5);
    const [search, setSearch] = useState<string>("");

    const [nextLastId, setNextLastId] = useState<string>("");
    const [currentLastId, setCurrentLastId] = useState<string>("");

    const [cursorHistory, setCursorHistory] = useState<string[]>([]);

    const [pageNumber, setPageNumber] = useState<number>(1);

    const userId = localStorage.getItem("userId") || "ankit0397";

    // =========================================
    // GET TASKS
    // =========================================
    const getAllTasks = async (
        lastId: string = "",
        searchValue: string = search
    ) => {
        try {
            setLoading(true);
            setMessage("");

            const url =
                `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/${userId}/task` +
                `?limit=${limit}` +
                `&lastId=${encodeURIComponent(lastId)}` +
                `&search=${encodeURIComponent(searchValue)}`;

            console.log("API CALL:", url);
            console.log("LAST ID SENT:", lastId);
            console.log("SEARCH:", searchValue);

            const response = await fetch(url, {
                method: "GET"
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch tasks. Status: ${response.status}`
                );
            }

            const result: ApiResponse = await response.json();

            console.log("API RESPONSE:", result);

            // =========================================
            // API DATA HANDLER
            // =========================================
            if (Array.isArray(result?.data)) {
                setTasks(result.data);

                // =====================================
                // GET LAST RECORD ID
                // =====================================
                if (result.data.length > 0) {
                    const lastRecord = result.data[result.data.length - 1];
                    const newLastId = lastRecord?.id || "";

                    console.log("NEW LAST ID:", newLastId);

                    if (result.data.length < limit) {
                        setNextLastId("");
                    } else {
                        setNextLastId(newLastId);
                    }
                } else {
                    setNextLastId("");
                }
            } else {
                setTasks([]);
                setNextLastId("");
            }

            setCurrentLastId(lastId);

        } catch (error) {
            console.error("Error fetching tasks:", error);
            setTasks([]);
            setNextLastId("");
            setMessage("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    // =========================================
    // INITIAL LOAD / LIMIT CHANGE
    // =========================================
    useEffect(() => {
        setPageNumber(1);
        setCursorHistory([]);
        setCurrentLastId("");
        setNextLastId("");

        getAllTasks("", search);
    }, [limit]);

    // =========================================
    // SEARCH HANDLERS
    // =========================================
    const handleSearch = () => {
        setPageNumber(1);
        setCursorHistory([]);
        setCurrentLastId("");
        setNextLastId("");

        getAllTasks("", search);
    };

    const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    const handleClearSearch = () => {
        setSearch("");
        setPageNumber(1);
        setCursorHistory([]);
        setCurrentLastId("");
        setNextLastId("");

        getAllTasks("", "");
    };

    // =========================================
    // PAGINATION HANDLERS
    // =========================================
    const handleNext = () => {
        console.log("NEXT LAST ID:", nextLastId);

        if (!nextLastId) return;

        setCursorHistory((previous) => [...previous, currentLastId]);
        setPageNumber((previous) => previous + 1);

        getAllTasks(nextLastId, search);
    };

    const handlePrevious = () => {
        if (cursorHistory.length === 0) return;

        const historyCopy = [...cursorHistory];
        const previousCursor = historyCopy.pop();

        setCursorHistory(historyCopy);
        setPageNumber((previous) => Math.max(1, previous - 1));

        getAllTasks(previousCursor || "", search);
    };

    const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = Number(event.target.value);
        setLimit(newLimit);
    };

    const handleRefresh = () => {
        setPageNumber(1);
        setCursorHistory([]);
        setCurrentLastId("");
        setNextLastId("");

        getAllTasks("", search);
    };

    return (
        <div className="get-all-task-container">
            {/* HEADER */}
            <div className="get-all-task-header">
                <div>
                    <h2>All Tasks</h2>
                    <p>View and manage your tasks</p>
                </div>

                <button
                    type="button"
                    className="refresh-button"
                    onClick={handleRefresh}
                    disabled={loading}
                >
                    Refresh
                </button>
            </div>

            {/* TOOLBAR */}
            <div className="task-toolbar">
                {/* PAGE SIZE */}
                <div className="page-size-container">
                    <span>Show</span>
                    <select
                        value={limit}
                        onChange={handleLimitChange}
                        disabled={loading}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                    <span>entries</span>
                </div>

                {/* SEARCH */}
                <div className="task-search-container">
                    <input
                        type="text"
                        value={search}
                        placeholder="Search tasks..."
                        className="task-search-input"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            setSearch(event.target.value)
                        }
                        onKeyDown={handleSearchKeyDown}
                    />

                    <button
                        type="button"
                        className="task-search-button"
                        onClick={handleSearch}
                        disabled={loading}
                    >
                        Search
                    </button>

                    {search && (
                        <button
                            type="button"
                            className="task-clear-button"
                            onClick={handleClearSearch}
                            disabled={loading}
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* LOADING */}
            {loading && <div className="task-loading">Loading tasks...</div>}

            {/* ERROR */}
            {message && <div className="task-error">{message}</div>}

            {/* NO DATA */}
            {!loading && !message && tasks.length === 0 && (
                <div className="no-task">No tasks found</div>
            )}

            {/* TABLE */}
            {!loading && tasks.length > 0 && (
                <>
                    <div className="task-table-wrapper">
                        <table className="task-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Due Date</th>
                                    <th>Due Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task, index) => (
                                    <tr key={task.id}>
                                        <td>
                                            {(pageNumber - 1) * limit + index + 1}
                                        </td>
                                        <td className="task-title-cell">
                                            {task.title || task.name || "-"}
                                        </td>
                                        <td className="task-description-cell">
                                            {task.description || task.content || "-"}
                                        </td>
                                        <td>
                                            <span
                                                className={`priority-badge priority-${task.priority?.toLowerCase()}`}
                                            >
                                                {task.priority || "-"}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className={`status-badge status-${task.status?.toLowerCase()}`}
                                            >
                                                {task.status || "-"}
                                            </span>
                                        </td>
                                        <td>{task.dueDate || "-"}</td>
                                        <td>
                                            {task.dueTime
                                                ? `${task.dueTime} ${task.meridiem || ""}`
                                                : "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    <div className="pagination-container">
                        <button
                            type="button"
                            className="pagination-button"
                            onClick={handlePrevious}
                            disabled={pageNumber === 1 || loading}
                        >
                            Previous
                        </button>

                        <button
                            type="button"
                            className="page-number-button active"
                            disabled
                        >
                            {pageNumber}
                        </button>

                        <button
                            type="button"
                            className="pagination-button"
                            onClick={handleNext}
                            disabled={!nextLastId || loading}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default GetAllTask;
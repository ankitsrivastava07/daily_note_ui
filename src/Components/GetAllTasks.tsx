import { useEffect, useState } from "react";
import "./CSS/GetAllTask.css";

function GetAllTask() {

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [limit, setLimit] = useState(5);
    const [search, setSearch] = useState("");

    const [nextLastId, setNextLastId] = useState("");
    const [currentLastId, setCurrentLastId] = useState("");

    const [cursorHistory, setCursorHistory] = useState([]);

    const [pageNumber, setPageNumber] = useState(1);

    const userId =
        localStorage.getItem("userId") || "ankit0397";


    // =========================================
    // GET TASKS
    // =========================================

    const getAllTasks = async (
        lastId = "",
        searchValue = search
    ) => {

        try {

            setLoading(true);
            setMessage("");

            const url =
                `http://localhost:9091/api/v1/user/${userId}/task` +
                `?limit=${limit}` +
                `&lastId=${encodeURIComponent(lastId)}` +
                `&search=${encodeURIComponent(searchValue)}`;

            console.log("API CALL:", url);
            console.log("LAST ID SENT:", lastId);
            console.log("SEARCH:", searchValue);

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {

                throw new Error(
                    `Failed to fetch tasks. Status: ${response.status}`
                );
            }

            const result = await response.json();

            console.log("API RESPONSE:", result);


            // =========================================
            // YOUR API RETURNS DATA AS ARRAY
            // =========================================

            if (Array.isArray(result?.data)) {

                setTasks(result.data);


                // =====================================
                // GET LAST RECORD ID
                // =====================================

                if (result.data.length > 0) {

                    const lastRecord =
                        result.data[
                        result.data.length - 1
                        ];

                    const newLastId =
                        lastRecord?.id || "";

                    console.log(
                        "NEW LAST ID:",
                        newLastId
                    );


                    /*
                     * If records are less than limit,
                     * no more records available
                     */
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

            console.error(
                "Error fetching tasks:",
                error
            );

            setTasks([]);

            setNextLastId("");

            setMessage(
                "Failed to load tasks"
            );

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
    // SEARCH
    // =========================================

    const handleSearch = () => {

        setPageNumber(1);

        setCursorHistory([]);

        setCurrentLastId("");

        setNextLastId("");

        getAllTasks("", search);
    };


    // =========================================
    // ENTER KEY SEARCH
    // =========================================

    const handleSearchKeyDown = (event) => {

        if (event.key === "Enter") {

            handleSearch();
        }
    };


    // =========================================
    // CLEAR SEARCH
    // =========================================

    const handleClearSearch = () => {

        setSearch("");

        setPageNumber(1);

        setCursorHistory([]);

        setCurrentLastId("");

        setNextLastId("");

        getAllTasks("", "");
    };


    // =========================================
    // NEXT PAGE
    // =========================================

    const handleNext = () => {

        console.log(
            "NEXT LAST ID:",
            nextLastId
        );

        if (!nextLastId) {
            return;
        }


        // Store cursor that loaded current page
        setCursorHistory(
            (previous) => [
                ...previous,
                currentLastId
            ]
        );


        setPageNumber(
            (previous) =>
                previous + 1
        );


        // Send latest lastId
        getAllTasks(
            nextLastId,
            search
        );
    };


    // =========================================
    // PREVIOUS PAGE
    // =========================================

    const handlePrevious = () => {

        if (cursorHistory.length === 0) {
            return;
        }


        const historyCopy =
            [...cursorHistory];


        const previousCursor =
            historyCopy.pop();


        setCursorHistory(
            historyCopy
        );


        setPageNumber(
            (previous) =>
                Math.max(
                    1,
                    previous - 1
                )
        );


        getAllTasks(
            previousCursor || "",
            search
        );
    };


    // =========================================
    // PAGE SIZE
    // =========================================

    const handleLimitChange = (event) => {

        const newLimit =
            Number(event.target.value);

        setLimit(newLimit);
    };


    // =========================================
    // REFRESH
    // =========================================

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

                    <h2>
                        All Tasks
                    </h2>

                    <p>
                        View and manage your tasks
                    </p>

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


            {/* ========================================= */}
            {/* TOOLBAR */}
            {/* ========================================= */}

            <div className="task-toolbar">


                {/* PAGE SIZE */}

                <div className="page-size-container">

                    <span>
                        Show
                    </span>

                    <select
                        value={limit}
                        onChange={handleLimitChange}
                        disabled={loading}
                    >

                        <option value={5}>
                            5
                        </option>

                        <option value={10}>
                            10
                        </option>

                        <option value={20}>
                            20
                        </option>

                        <option value={50}>
                            50
                        </option>

                    </select>

                    <span>
                        entries
                    </span>

                </div>


                {/* SEARCH */}

                <div className="task-search-container">

                    <input
                        type="text"
                        value={search}
                        placeholder="Search tasks..."
                        className="task-search-input"
                        onChange={(event) =>
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

            {loading && (

                <div className="task-loading">

                    Loading tasks...

                </div>

            )}


            {/* ERROR */}

            {message && (

                <div className="task-error">

                    {message}

                </div>

            )}


            {/* NO DATA */}

            {!loading &&
                !message &&
                tasks.length === 0 && (

                    <div className="no-task">

                        No tasks found

                    </div>

                )}


            {/* ========================================= */}
            {/* TABLE */}
            {/* ========================================= */}

            {!loading &&
                tasks.length > 0 && (

                    <>

                        <div className="task-table-wrapper">

                            <table className="task-table">

                                <thead>

                                    <tr>

                                        <th>
                                            #
                                        </th>

                                        <th>
                                            Title
                                        </th>

                                        <th>
                                            Description
                                        </th>

                                        <th>
                                            Priority
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Due Date
                                        </th>

                                        <th>
                                            Due Time
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {tasks.map(
                                        (task, index) => (

                                            <tr key={task.id}>

                                                {/* SERIAL NUMBER */}

                                                <td>

                                                    {
                                                        ((pageNumber - 1)
                                                            * limit)
                                                        + index
                                                        + 1
                                                    }

                                                </td>


                                                {/* TITLE */}

                                                <td className="task-title-cell">

                                                    {
                                                        task.title ||
                                                        task.name ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* DESCRIPTION */}

                                                <td className="task-description-cell">

                                                    {
                                                        task.description ||
                                                        task.content ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* PRIORITY */}

                                                <td>

                                                    <span
                                                        className={
                                                            `priority-badge priority-${task.priority?.toLowerCase()}`
                                                        }
                                                    >

                                                        {
                                                            task.priority ||
                                                            "-"
                                                        }

                                                    </span>

                                                </td>


                                                {/* STATUS */}

                                                <td>

                                                    <span
                                                        className={
                                                            `status-badge status-${task.status?.toLowerCase()}`
                                                        }
                                                    >

                                                        {
                                                            task.status ||
                                                            "-"
                                                        }

                                                    </span>

                                                </td>


                                                {/* DUE DATE */}

                                                <td>

                                                    {
                                                        task.dueDate ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* DUE TIME */}

                                                <td>

                                                    {
                                                        task.dueTime
                                                            ? `${task.dueTime} ${task.meridiem || ""}`
                                                            : "-"
                                                    }

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>


                        {/* ================================= */}
                        {/* PAGINATION */}
                        {/* ================================= */}

                        <div className="pagination-container">


                            {/* PREVIOUS */}

                            <button
                                type="button"
                                className="pagination-button"
                                onClick={handlePrevious}
                                disabled={
                                    pageNumber === 1 ||
                                    loading
                                }
                            >
                                Previous
                            </button>


                            {/* CURRENT PAGE NUMBER */}

                            <button
                                type="button"
                                className="page-number-button active"
                                disabled
                            >
                                {pageNumber}
                            </button>


                            {/* NEXT */}

                            <button
                                type="button"
                                className="pagination-button"
                                onClick={handleNext}
                                disabled={
                                    !nextLastId ||
                                    loading
                                }
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
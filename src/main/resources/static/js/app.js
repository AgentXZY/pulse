const API = "/api/projects";

let editingId = null;


// LOAD PROJECTS

async function loadProjects() {

    try {

        const response = await fetch(API);

        if (!response.ok) {
            throw new Error("Could not load projects");
        }

        const projects = await response.json();

        updateStats(projects);
        displayProjects(projects);

    } catch (error) {

        console.error(error);
        showToast("Failed to connect to server");

    }
}


// UPDATE DASHBOARD STATISTICS

function updateStats(projects) {

    document.getElementById("totalProjects").textContent =
        projects.length;

    document.getElementById("activeProjects").textContent =
        projects.filter(p => p.status === "IN_PROGRESS").length;

    document.getElementById("completedProjects").textContent =
        projects.filter(p => p.status === "COMPLETED").length;

    document.getElementById("plannedProjects").textContent =
        projects.filter(p => p.status === "PLANNED").length;
}


// DISPLAY PROJECT CARDS

function displayProjects(projects) {

    const container = document.getElementById("projectList");

    const filter = document.getElementById("filterStatus").value;

    if (filter !== "ALL") {
        projects = projects.filter(p => p.status === filter);
    }

    if (projects.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                No projects found. Create your first project!
            </div>
        `;

        return;
    }

    container.innerHTML = projects.map(project => `

        <div class="project-card">

            <div class="card-top">

                <div class="project-symbol">
                    ${escapeHTML(project.name.charAt(0).toUpperCase())}
                </div>

                <div class="card-menu">

                    <button onclick="editProject(${project.id})">
                        Edit
                    </button>

                    <button onclick="deleteProject(${project.id})">
                        Delete
                    </button>

                </div>

            </div>

            <h3>${escapeHTML(project.name)}</h3>

            <p>${escapeHTML(project.description || "No description provided.")}</p>

            <span class="status ${project.status}">
                ${formatStatus(project.status)}
            </span>

            <div class="deadline">
                Deadline: ${project.deadline || "Not set"}
            </div>

            <div class="card-footer">

                <span>Project status</span>

                <select class="status-select"
                    onchange="changeStatus(${project.id}, this.value)">

                    <option value="PLANNED"
                        ${project.status === "PLANNED" ? "selected" : ""}>
                        Planned
                    </option>

                    <option value="IN_PROGRESS"
                        ${project.status === "IN_PROGRESS" ? "selected" : ""}>
                        In Progress
                    </option>

                    <option value="COMPLETED"
                        ${project.status === "COMPLETED" ? "selected" : ""}>
                        Completed
                    </option>

                </select>

            </div>

        </div>

    `).join("");

}


// FORMAT STATUS

function formatStatus(status) {

    return status.replace("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());

}


// PREVENT HTML INJECTION

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);

}


// OPEN MODAL

function openModal() {

    editingId = null;

    document.getElementById("projectForm").reset();

    document.getElementById("modalTitle").textContent =
        "Create Project";

    document.getElementById("projectModal").classList.add("show");

}


// CLOSE MODAL

function closeModal() {

    document.getElementById("projectModal").classList.remove("show");

}


// CREATE / UPDATE PROJECT

document.getElementById("projectForm").addEventListener("submit",
    async function(event) {

        event.preventDefault();

        const project = {

            name: document.getElementById("projectName").value.trim(),

            description: document.getElementById("projectDescription").value.trim(),

            deadline: document.getElementById("projectDeadline").value || null,

            status: document.getElementById("projectStatus").value

        };

        if (!project.name) {
            showToast("Project name is required");
            return;
        }

        const url = editingId ? `${API}/${editingId}` : API;

        const method = editingId ? "PUT" : "POST";

        try {

            const response = await fetch(url, {

                method: method,

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(project)

            });

            if (!response.ok) {
                throw new Error("Unable to save project");
            }

            closeModal();

            loadProjects();

            showToast(editingId
                ? "Project updated successfully"
                : "Project created successfully");

        } catch (error) {

            showToast(error.message);

        }

    }
);


// EDIT PROJECT

async function editProject(id) {

    try {

        const response = await fetch(`${API}/${id}`);

        if (!response.ok) {
            throw new Error("Project not found");
        }

        const project = await response.json();

        editingId = id;

        document.getElementById("projectName").value =
            project.name;

        document.getElementById("projectDescription").value =
            project.description || "";

        document.getElementById("projectDeadline").value =
            project.deadline || "";

        document.getElementById("projectStatus").value =
            project.status;

        document.getElementById("modalTitle").textContent =
            "Edit Project";

        document.getElementById("projectModal").classList.add("show");

    } catch (error) {

        showToast(error.message);

    }

}


// DELETE PROJECT

async function deleteProject(id) {

    if (!confirm("Are you sure you want to delete this project?")) {
        return;
    }

    try {

        const response = await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Unable to delete project");
        }

        loadProjects();

        showToast("Project deleted successfully");

    } catch (error) {

        showToast(error.message);

    }

}


// CHANGE PROJECT STATUS

async function changeStatus(id, status) {

    try {

        const response = await fetch(`${API}/${id}`);

        if (!response.ok) {
            throw new Error("Project not found");
        }

        const project = await response.json();

        project.status = status;

        const updateResponse = await fetch(`${API}/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(project)

        });

        if (!updateResponse.ok) {
            throw new Error("Unable to update status");
        }

        loadProjects();

        showToast("Project status updated");

    } catch (error) {

        showToast(error.message);
        loadProjects();

    }

}


// TOAST NOTIFICATION

let toastTimer;

function showToast(message) {

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);

}


// INITIAL LOAD

loadProjects();
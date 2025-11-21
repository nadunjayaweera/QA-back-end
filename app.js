// User Management System (API Version)

class UserManager {
  constructor() {
    this.users = [];
    this.currentEditingId = null;

    this.initializeEventListeners();
    this.loadUsersFromAPI(); // Load users from backend
  }

  initializeEventListeners() {
    const form = document.getElementById("userForm");

    form.addEventListener("submit", (e) => this.handleFormSubmit(e));

    document
      .getElementById("cancelBtn")
      .addEventListener("click", () => this.cancelEdit());
  }

  async loadUsersFromAPI() {
    try {
      const res = await fetch("http://localhost:3000/api/users");
      const data = await res.json();

      this.users = data;
      this.renderUsers();
    } catch (error) {
      console.error("Error loading users:", error);
    }
  }

  handleFormSubmit(e) {
    e.preventDefault();

    const userData = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      age: parseInt(document.getElementById("age").value),
      birthYear: parseInt(document.getElementById("birthYear").value),
      phoneNumber: document.getElementById("phone").value,
      city: document.getElementById("city").value,
    };

    if (this.currentEditingId) {
      this.updateUser(this.currentEditingId, userData);
    } else {
      this.addUser(userData);
    }

    this.resetForm();
  }

  // ============ CRUD API CALLS ============

  async addUser(userData) {
    try {
      const res = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const newUser = await res.json();

      this.users.push(newUser);
      this.renderUsers();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  }

  async updateUser(id, userData) {
    try {
      const res = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const updated = await res.json();

      this.users = this.users.map((u) => (u.id === id ? updated : u));
      this.renderUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }

    this.currentEditingId = null;
  }

  async deleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await fetch(`http://localhost:3000/api/users/${id}`, {
        method: "DELETE",
      });

      this.users = this.users.filter((u) => u.id !== id);
      this.renderUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  // ============ FRONTEND UI ============

  editUser(id) {
    const user = this.users.find((u) => u.id === id);

    if (user) {
      document.getElementById("firstName").value = user.firstName;
      document.getElementById("lastName").value = user.lastName;
      document.getElementById("email").value = user.email;
      document.getElementById("age").value = user.age;
      document.getElementById("birthYear").value = user.birthYear;
      document.getElementById("phone").value = user.phoneNumber;
      document.getElementById("city").value = user.city;

      this.currentEditingId = id;
      document.getElementById("submitBtn").textContent = "Update User";
      document.getElementById("cancelBtn").style.display = "inline-block";

      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    document.getElementById("userForm").reset();
    this.currentEditingId = null;
    document.getElementById("submitBtn").textContent = "Add User";
    document.getElementById("cancelBtn").style.display = "none";
  }

  renderUsers() {
    const tableBody = document.getElementById("tableBody");
    const emptyMessage = document.getElementById("emptyMessage");
    const table = document.getElementById("usersTable");

    tableBody.innerHTML = "";

    if (this.users.length === 0) {
      table.style.display = "none";
      emptyMessage.style.display = "block";
      return;
    }

    table.style.display = "table";
    emptyMessage.style.display = "none";

    this.users.forEach((user, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${user.firstName}</td>
        <td>${user.lastName}</td>
        <td>${user.email}</td>
        <td>${user.age}</td>
        <td>${user.birthYear}</td>
       <td>${user.phoneNumber}</td>
        <td>${user.city}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-edit" onclick="userManager.editUser(${
              user.id
            })">Edit</button>
            <button class="btn-delete" onclick="userManager.deleteUser(${
              user.id
            })">Delete</button>
          </div>
        </td>
      `;

      tableBody.appendChild(row);
    });
  }
}

// Initialize App
const userManager = new UserManager();

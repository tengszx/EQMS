import React, { useState, useEffect } from 'react';
import AddNewUserModal from '../../modal/AddNewUserModal';
import '../../../css/styles/admin/UserMAnagement.css';
import { Search, Eye, Edit, Trash2 } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    position: '',
    email: '',
    role: 'Admin',
    status: 'Active'
  });

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.middleName} ${user.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) ||
           user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
           user.position.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const handleAddUser = (newUser) => {
    const id = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
    const now = new Date().toISOString();

    setUsers([...users, { ...newUser, id, lastLogin: now }]);
    setShowAddModal(false);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEditClick = (user) => {
    setEditingUser({ ...user });
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleEditUser = () => {
    const updatedUsers = users.map(user =>
      user.id === selectedUser.id ? { ...editingUser, id: user.id, lastLogin: user.lastLogin } : user
    );
    setUsers(updatedUsers);
    setShowEditModal(false);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = () => {
    setUsers(users.filter(user => user.id !== selectedUser.id));
    setShowDeleteModal(false);
  };

  const handleEditInputChange = (e) => {
    setEditingUser({
      ...editingUser,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <h1>User Management</h1>
      </div>

      <div className="user-management-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
          <Search className="search-icon" size={18} />
        </div>

        <button className="add-user-btn" onClick={() => setShowAddModal(true)}>
          <span>+</span> Add New User
        </button>
      </div>

      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Position</th>
              <th>Email Address</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.firstName} {user.middleName} {user.lastName}</td>
                <td>{user.position}</td>
                <td>{user.email}</td>
                <td>{user.section}</td>
                <td>
                  {user.division && <span className={`division-badge ${user.division}`}>{user.division}</span>}
                </td>
                <td>
                  <span className={`status-badge ${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                </td>
                <td>{formatDate(user.lastLogin)}</td>
                <td>{user.role}</td>
                <td className="action-buttons">
                  <button onClick={() => handleViewUser(user)} className="view-btn">
                    <Eye size={18} />
                  </button>
                  <button onClick={() => handleEditClick(user)} className="edit-btn">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDeleteClick(user)} className="delete-btn">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <span>Showing 1-8 of 41 users</span>
          <div className="pagination-controls">
            <button disabled className="prev-btn">Previous</button>
            <button className="next-btn">Next</button>
          </div>
        </div>
      </div>

      {/* View User Modal */}
      {showViewModal && (
        <div className="modal-overlay">
          <div className="modal-container view-modal">
            <div className="modal-header">
              <h2>User Information</h2>
              <button className="close-btn" onClick={() => setShowViewModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="user-info-section">
                <h3>Personal Information</h3>
                <div className="info-group">
                  <div className="info-item">
                    <span className="info-label">First Name:</span>
                    <span className="info-value">{selectedUser.firstName}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Middle Name:</span>
                    <span className="info-value">{selectedUser.middleName}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Last Name:</span>
                    <span className="info-value">{selectedUser.lastName}</span>
                  </div>
                </div>
              </div>

              <div className="user-info-section">
                <h3>Job Information</h3>
                <div className="info-group">
                  <div className="info-item">
                    <span className="info-label">Position:</span>
                    <span className="info-value">{selectedUser.position}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Division:</span>
                    <span className="info-value">{selectedUser.division}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Section:</span>
                    <span className="info-value">{selectedUser.section || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="user-info-section">
                <h3>Account Information</h3>
                <div className="info-group">
                  <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{selectedUser.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Role:</span>
                    <span className="info-value">{selectedUser.role}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Status:</span>
                    <span className="info-value">
                      <span className={`status-badge ${selectedUser.status.toLowerCase()}`}>
                        {selectedUser.status}
                      </span>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Last Login:</span>
                    <span className="info-value">{formatDate(selectedUser.lastLogin)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowViewModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-container edit-modal">
            <div className="modal-header">
              <h2>Edit User</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={editingUser.firstName}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Middle Name</label>
                    <input
                      type="text"
                      name="middleName"
                      value={editingUser.middleName}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={editingUser.lastName}
                      onChange={handleEditInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Account Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Position</label>
                    <input
                      type="text"
                      name="position"
                      value={editingUser.position}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={editingUser.email}
                      onChange={handleEditInputChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      name="role"
                      value={editingUser.role}
                      onChange={handleEditInputChange}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Superadmin">Superadmin</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={editingUser.status}
                      onChange={handleEditInputChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="save-btn" onClick={handleEditUser}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-container delete-modal">
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <p>Are you sure you want to delete the user <strong>{selectedUser.firstName} {selectedUser.lastName}</strong>?</p>
              <p>This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="delete-confirm-btn" onClick={handleDeleteUser}>Delete User</button>
            </div>
          </div>
        </div>
      )}

      {/* Import the separate AddNewUser component */}
      {showAddModal && (
        <AddNewUserModal
          onClose={() => setShowAddModal(false)}
          onAddUser={handleAddUser}
        />
      )}
    </div>
  );
};

export default UserManagement;

import React, { useState } from 'react';
import '../../css/styles/modal/AddNewUserModal.css';

const AddNewUserModal = ({ onClose, onAddUser }) => {
  const [newUser, setNewUser] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    position: '',
    email: '',
    role: 'Admin',
    status: 'Active'
  });

  const handleInputChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    // Basic validation
    if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.position) {
      alert('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      alert('Please enter a valid email address');
      return;
    }

    onAddUser(newUser);
  };

  return (
    <div className="add-user-modal-overlay">
      <div className="add-user-modal-container">
        <div className="add-user-modal-header">
          <h2>Add New User</h2>
          <button className="add-user-close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="add-user-modal-content">
          <div className="add-user-section">
            <h3>Personal Information</h3>
            <div className="add-user-form-row">
              <div className="add-user-form-group">
                <label>First Name</label>
                <input 
                  type="text" 
                  name="firstName" 
                  placeholder="Enter first name" 
                  value={newUser.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="add-user-form-group">
                <label>Middle Name</label>
                <input 
                  type="text" 
                  name="middleName" 
                  placeholder="Enter middle name" 
                  value={newUser.middleName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="add-user-form-group">
                <label>Last Name</label>
                <input 
                  type="text" 
                  name="lastName" 
                  placeholder="Enter last name" 
                  value={newUser.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="add-user-section">
            <h3>Account Settings</h3>
            <div className="add-user-form-row">
              <div className="add-user-form-group">
                <label>Position</label>
                <input 
                  type="text" 
                  name="position" 
                  placeholder="Enter position" 
                  value={newUser.position}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="add-user-form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Enter email address" 
                  value={newUser.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="add-user-form-row">
              <div className="add-user-form-group">
                <label>Role</label>
                <select 
                  name="role" 
                  value={newUser.role}
                  onChange={handleInputChange}
                >
                  <option value="Admin">Admin</option>
                  <option value="Superadmin">Superadmin</option>
                </select>
              </div>
              <div className="add-user-form-group">
                <label>Status</label>
                <select 
                  name="status" 
                  value={newUser.status}
                  onChange={handleInputChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="add-user-modal-footer">
          <button className="add-user-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="add-user-add-btn" onClick={handleSubmit}>Add User</button>
        </div>
      </div>
    </div>
  );
};

export default AddNewUserModal;
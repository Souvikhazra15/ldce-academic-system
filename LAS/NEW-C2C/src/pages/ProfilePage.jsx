import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEdit, faSave, faTimes, faPhone, faEnvelope, faMapMarker, faCalendar } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/ProfilePage.css';

const ProfilePage = ({ currentScreen, facultyData = {}, onScreenChange, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: facultyData?.name || 'Dr. Raj Kumar',
    email: facultyData?.email || 'raj.kumar@university.edu',
    phone: '+91-9876543210',
    designation: 'Associate Professor',
    department: 'Information Technology',
    specialization: 'Data Structures & Algorithms',
    qualifications: 'Ph.D. Computer Science, M.Tech IT, B.Tech IT',
    experience: '12 years',
    office: 'IT Building, Room 305',
    bio: 'Experienced educator with focus on practical implementation and student mentoring.',
    joiningDate: '2012-07-15',
    coursesTaught: ['Data Structures', 'Web Development', 'Database Management', 'Software Engineering'],
    achievements: ['Best Teacher Award 2022', 'Research Publication in IEEE', 'Mentored 50+ Students']
  });

  const [editedData, setEditedData] = useState({ ...profileData });

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedData({ ...profileData });
  };

  const handleSaveClick = () => {
    setProfileData({ ...editedData });
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setEditedData({ ...profileData });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedData({ ...editedData, [field]: value });
  };

  return (
    <div className="profile-page-wrapper">
      <Navbar facultyName={profileData.name} currentScreen={currentScreen} onScreenChange={onScreenChange} onLogout={onLogout} />
      <div className="profile-page">
        <div className="profile-main">
          {/* Page Header */}
          <div className="profile-header-container">
            <div className="profile-header">
              <h1>Faculty Profile</h1>
            </div>
          </div>

          {/* Content Card */}
          <div className="profile-content-card">
            <div className="profile-container">
              {/* Profile Banner */}
              <div className="profile-banner">
                <div className="avatar-section">
                  <div className="avatar">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <div className="profile-basic-info">
                    <h2>{profileData.name}</h2>
                    <p className="designation">{profileData.designation}</p>
                    <p className="department">{profileData.department}</p>
                  </div>
                </div>
                {!isEditing && (
                  <button className="edit-btn" onClick={handleEditClick}>
                    <FontAwesomeIcon icon={faEdit} />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              {/* Profile Content */}
              {isEditing ? (
                <div className="profile-edit-form">
                  {/* Edit Form */}
                  <div className="form-section">
                    <h3>Personal Information</h3>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={editedData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          value={editedData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Phone</label>
                        <input
                          type="tel"
                          value={editedData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>Professional Information</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Designation</label>
                        <input
                          type="text"
                          value={editedData.designation}
                          onChange={(e) => handleInputChange('designation', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Department</label>
                        <input
                          type="text"
                          value={editedData.department}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Specialization</label>
                      <input
                        type="text"
                        value={editedData.specialization}
                        onChange={(e) => handleInputChange('specialization', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Experience (Years)</label>
                        <input
                          type="text"
                          value={editedData.experience}
                          onChange={(e) => handleInputChange('experience', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Joining Date</label>
                        <input
                          type="date"
                          value={editedData.joiningDate}
                          onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>Additional Information</h3>
                    <div className="form-group">
                      <label>Qualifications</label>
                      <textarea
                        value={editedData.qualifications}
                        onChange={(e) => handleInputChange('qualifications', e.target.value)}
                        className="form-textarea"
                        rows="2"
                      />
                    </div>
                    <div className="form-group">
                      <label>Office Location</label>
                      <input
                        type="text"
                        value={editedData.office}
                        onChange={(e) => handleInputChange('office', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Bio</label>
                      <textarea
                        value={editedData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        className="form-textarea"
                        rows="3"
                      />
                    </div>
                  </div>

                  {/* Save/Cancel Buttons */}
                  <div className="form-actions">
                    <button className="btn btn-primary" onClick={handleSaveClick}>
                      <FontAwesomeIcon icon={faSave} />
                      <span>Save Changes</span>
                    </button>
                    <button className="btn btn-secondary" onClick={handleCancelClick}>
                      <FontAwesomeIcon icon={faTimes} />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="profile-view">
                  {/* Contact Information */}
                  <div className="info-section">
                    <h3>Contact Information</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <FontAwesomeIcon icon={faEnvelope} className="info-icon" />
                        <div>
                          <span className="label">Email</span>
                          <p>{profileData.email}</p>
                        </div>
                      </div>
                      <div className="info-item">
                        <FontAwesomeIcon icon={faPhone} className="info-icon" />
                        <div>
                          <span className="label">Phone</span>
                          <p>{profileData.phone}</p>
                        </div>
                      </div>
                      <div className="info-item">
                        <FontAwesomeIcon icon={faMapMarker} className="info-icon" />
                        <div>
                          <span className="label">Office</span>
                          <p>{profileData.office}</p>
                        </div>
                      </div>
                      <div className="info-item">
                        <FontAwesomeIcon icon={faCalendar} className="info-icon" />
                        <div>
                          <span className="label">Joining Date</span>
                          <p>{new Date(profileData.joiningDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="info-section">
                    <h3>Professional Information</h3>
                    <div className="info-details">
                      <div className="detail-item">
                        <span className="detail-label">Designation:</span>
                        <span className="detail-value">{profileData.designation}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Department:</span>
                        <span className="detail-value">{profileData.department}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Specialization:</span>
                        <span className="detail-value">{profileData.specialization}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Experience:</span>
                        <span className="detail-value">{profileData.experience}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Qualifications:</span>
                        <span className="detail-value">{profileData.qualifications}</span>
                      </div>
                    </div>
                  </div>

                  {/* About */}
                  <div className="info-section">
                    <h3>About</h3>
                    <p className="bio">{profileData.bio}</p>
                  </div>

                  {/* Courses Taught */}
                  <div className="info-section">
                    <h3>Courses Taught</h3>
                    <div className="courses-list">
                      {profileData.coursesTaught.map((course, idx) => (
                        <span key={idx} className="course-tag">{course}</span>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="info-section">
                    <h3>Achievements & Recognitions</h3>
                    <ul className="achievements-list">
                      {profileData.achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;

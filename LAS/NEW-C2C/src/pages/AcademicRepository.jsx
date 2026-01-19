import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faFolder, faFile, faUpload, faDownload, faTrash, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/AcademicRepository.css';
import { formatCourseLabel } from '../utils/courseFormatter';
import { supabase } from '../supabaseClient';

function AcademicRepository({ currentScreen, courseId, onScreenChange, facultyData, onLogout }) {
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(courseId);
  const [selectedFolder, setSelectedFolder] = useState('syllabus');
  const [expandedFolders, setExpandedFolders] = useState({
    syllabus: true,
    assignments: true,
    referenceMaterial: true
  });

  const mockCourses = [
    { 
      id: 'CS101', 
      name: 'Data Structures', 
      code: '3137001',
      abbr: 'DS',
      department: 'IT',
      semester: 3,
      division: 'B1'
    },
    { 
      id: 'CS102', 
      name: 'Web Development', 
      code: '3137002',
      abbr: 'WD',
      department: 'IT',
      semester: 3,
      division: 'B2'
    }
  ];

  const [folders] = useState([
    { id: 'syllabus', name: 'Syllabus', icon: faBook, count: 0 },
    { id: 'assignments', name: 'Assignments', icon: faFile, count: 0 },
    { id: 'referenceMaterial', name: 'Reference Material', icon: faFolder, count: 0 }
  ]);

  const [files, setFiles] = useState({
    syllabus: [],
    assignments: [],
    referenceMaterial: []
  });

  // Fetch files from Supabase
  useEffect(() => {
    fetchFiles();
  }, [selectedCourse]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('academic_repository')
        .select('*')
        .eq('course_id', selectedCourse);

      if (error) throw error;

      // Group files by folder_id
      const groupedFiles = {
        syllabus: [],
        assignments: [],
        referenceMaterial: []
      };

      if (data) {
        data.forEach(file => {
          if (groupedFiles[file.folder_id]) {
            groupedFiles[file.folder_id].push({
              id: file.id,
              name: file.name,
              size: file.size || 'Unknown',
              uploadDate: file.upload_date || file.created_at.split('T')[0],
              type: file.type || 'file'
            });
          }
        });
      }

      setFiles(groupedFiles);
      
      // Update folder counts (visual only, simplified)
      folders.forEach(f => f.count = groupedFiles[f.id]?.length || 0);

    } catch (error) {
      console.error('Error fetching files:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const handleUploadFile = async () => {
    const fileName = prompt("Enter file name (Simulation):", "New Document.pdf");
    if (!fileName) return;

    try {
      const { data, error } = await supabase
        .from('academic_repository')
        .insert([
          { 
            name: fileName, 
            folder_id: selectedFolder, 
            course_id: selectedCourse,
            size: '1.5 MB', // Mock size
            type: 'pdf'
          }
        ])
        .select();

      if (error) throw error;

      if (data) {
        // Refresh list
        fetchFiles();
        alert('File uploaded successfully!');
      }
    } catch (error) {
      alert('Error uploading file: ' + error.message);
    }
  };

  const handleDownloadFile = (fileId, fileName) => {
    alert(`Downloading ${fileName}... (This is a demo, file content storage requires Storage bucket setup)`);
  };

  const handleDeleteFile = async (folderId, fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const { error } = await supabase
        .from('academic_repository')
        .delete()
        .eq('id', fileId);

      if (error) throw error;
      
      fetchFiles();
    } catch (error) {
      alert('Error deleting file: ' + error.message);
    }
  };

  const currentFiles = files[selectedFolder] || [];


  return (
    <div className="academic-repository-wrapper">
      <Navbar facultyName={facultyData?.name || 'Dr. Raj Kumar'} currentScreen={currentScreen} onScreenChange={onScreenChange} onLogout={onLogout} />
      <div className="academic-repository">
        
        <div className="ar-container">
          {/* Header Section */}
          <div className="ar-header">
          <div className="ar-title">
            <FontAwesomeIcon icon={faBook} className="ar-icon" />
            <h1>Academic Repository</h1>
          </div>
          <p className="ar-subtitle">Store and manage course-related academic material</p>
        </div>

        {/* Course Selection */}
        <div className="selection-panel" style={{ marginBottom: '30px' }}>
          <div className="selection-group">
            <label htmlFor="course-select">Course</label>
            <select
              id="course-select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="select-input"
            >
              {mockCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {formatCourseLabel(course)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="ar-content">
          {/* Sidebar - Folder Structure */}
          <aside className="ar-sidebar">
            <h3 className="ar-sidebar-title">Folders</h3>
            <div className="ar-folder-list">
              {folders.map(folder => (
                <div key={folder.id} className="ar-folder-item-container">
                  <div 
                    className={`ar-folder-item ${selectedFolder === folder.id ? 'active' : ''}`}
                    onClick={() => setSelectedFolder(folder.id)}
                  >
                    <div className="ar-folder-icon">
                      <FontAwesomeIcon icon={folder.icon} />
                    </div>
                    <div className="ar-folder-info">
                      <h4>{folder.name}</h4>
                      <span className="ar-file-count">{folder.count} files</span>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} className="ar-chevron" />
                  </div>
                </div>
              ))}
            </div>

            {/* Access Info */}
            <div className="ar-access-info">
              <h4>Access Control</h4>
              <p>This repository is accessible only to enrolled students of this course.</p>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="ar-main">
            {/* Folder Header */}
            <div className="ar-folder-header">
              <h2>{folders.find(f => f.id === selectedFolder)?.name}</h2>
              <button className="ar-upload-btn" onClick={handleUploadFile}>
                <FontAwesomeIcon icon={faUpload} />
                Upload File
              </button>
            </div>

            {/* Files List */}
            <div className="ar-files-container">
              {currentFiles.length === 0 ? (
                <div className="ar-empty">
                  <FontAwesomeIcon icon={faFolder} className="ar-empty-icon" />
                  <p>No files in this folder yet</p>
                </div>
              ) : (
                <div className="ar-files-list">
                  {/* List Header */}
                  <div className="ar-files-header">
                    <div className="ar-file-name">File Name</div>
                    <div className="ar-file-size">Size</div>
                    <div className="ar-file-date">Upload Date</div>
                    <div className="ar-file-actions">Actions</div>
                  </div>

                  {/* Files */}
                  {currentFiles.map(file => (
                    <div key={file.id} className="ar-file-row">
                      <div className="ar-file-name">
                        <FontAwesomeIcon icon={faFile} className="ar-file-icon" />
                        <span className="ar-file-filename">{file.name}</span>
                      </div>
                      <div className="ar-file-size">{file.size}</div>
                      <div className="ar-file-date">{file.uploadDate}</div>
                      <div className="ar-file-actions">
                        <button 
                          className="ar-action-btn download"
                          onClick={() => handleDownloadFile(file.id, file.name)}
                          title="Download"
                        >
                          <FontAwesomeIcon icon={faDownload} />
                        </button>
                        <button 
                          className="ar-action-btn delete"
                          onClick={() => handleDeleteFile(selectedFolder, file.id)}
                          title="Delete"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="ar-info">
              <h4>Storage Information</h4>
              <p><strong>Total Files:</strong> {Object.values(files).flat().length}</p>
              <p><strong>Total Storage Used:</strong> ~35 MB</p>
              <p><strong>Course Access:</strong> All enrolled students have read access to this repository</p>
            </div>
          </main>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AcademicRepository;

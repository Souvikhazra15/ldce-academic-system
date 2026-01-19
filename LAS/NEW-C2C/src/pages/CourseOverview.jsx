import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Dashboard as DashboardComponent } from '../components/Dashboard';
import '../styles/CourseOverview.css';

const CourseOverview = ({ courseId = null, onScreenChange, facultyData, onLogout }) => {
  // Get courseId from props or localStorage (set when AI analysis is triggered)
  const finalCourseId = courseId || localStorage.getItem('currentCourseCode') || 'CS101';
  const [aiAnalysisData, setAiAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAIAnalysis = async () => {
      try {
        setLoading(true);
        
        // First, try to get from localStorage (recently generated analysis)
        const storedAnalysis = localStorage.getItem('currentAnalysisResult');
        if (storedAnalysis) {
          const analysisResult = JSON.parse(storedAnalysis);
          setAiAnalysisData(analysisResult);
          return;
        }
        
        // Try to load from backend database
        const response = await fetch(`http://localhost:5000/api/curriculum/curriculum-mapping/default-program/${finalCourseId}/5`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            const mapping = result.data;
            const analysisResult = {
              subject: {
                name: mapping.subjectName,
                code: mapping.subjectCode
              },
              courseOutcomes: mapping.courseOutcomes || [],
              programOutcomes: mapping.programOutcomes || [],
              coPoMapping: mapping.coPoMapping || {},
              lectures: mapping.lectures || [],
              practicals: mapping.practicals || [],
              pblActivities: mapping.pblActivities || []
            };
            setAiAnalysisData(analysisResult);
          } else {
            setError('No AI analysis found for this course. Please generate one from the Dashboard.');
          }
        } else {
          setError('No AI analysis found for this course. Please generate one from the Dashboard.');
        }
      } catch (err) {
        console.error('Error loading AI analysis:', err);
        setError('Failed to load AI analysis from database.');
      } finally {
        setLoading(false);
      }
    };

    loadAIAnalysis();
  }, [finalCourseId]);

  if (loading) {
    return (
      <div className="course-overview-wrapper">
        <Navbar facultyName={facultyData?.name || 'Faculty'} onScreenChange={onScreenChange} onLogout={onLogout} />
        <div className="course-overview-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading AI Analysis...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !aiAnalysisData) {
    return (
      <div className="course-overview-wrapper">
        <Navbar facultyName={facultyData?.name || 'Faculty'} onScreenChange={onScreenChange} onLogout={onLogout} />
        <div className="course-overview-container">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h2>No Analysis Available</h2>
            <p>{error}</p>
            <p style={{ fontSize: '14px', marginTop: '16px', color: '#666' }}>
              To view AI-analyzed curriculum, please:
            </p>
            <ol style={{ marginTop: '12px', textAlign: 'left', maxWidth: '600px', margin: '12px auto' }}>
              <li>Go back to Dashboard</li>
              <li>Click "Course Overview" button on your course</li>
              <li>Upload a syllabus file</li>
              <li>Wait for AI analysis to complete</li>
              <li>Return to this page to view results</li>
            </ol>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="course-overview-wrapper">
      <Navbar facultyName={facultyData?.name || 'Faculty'} onScreenChange={onScreenChange} onLogout={onLogout} />
      <div className="course-overview-container">
        <DashboardComponent data={aiAnalysisData} courseId={finalCourseId} />
      </div>
      <Footer />
    </div>
  );
};

export default CourseOverview;

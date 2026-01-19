import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Dashboard as DashboardComponent } from '../components/Dashboard';
import { supabase } from '../supabaseClient';
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
        
        // If not in localStorage, try to load from database
        const { data, error: dbError } = await supabase
          .from('ai_course_analysis')
          .select('*')
          .eq('course_id', finalCourseId)
          .single();

        if (dbError && dbError.code !== 'PGRST116') {
          throw dbError;
        }

        if (data) {
          // Parse JSON data from database
          const analysisResult = {
            subject: {
              name: data.subject_name,
              code: data.subject_code
            },
            courseOutcomes: data.course_outcomes ? JSON.parse(data.course_outcomes) : [],
            programOutcomes: data.program_outcomes ? JSON.parse(data.program_outcomes) : [],
            coPoMapping: data.co_po_mapping ? JSON.parse(data.co_po_mapping) : {},
            lectures: data.lectures ? JSON.parse(data.lectures) : [],
            practicals: data.practicals ? JSON.parse(data.practicals) : [],
            pblActivities: data.pbl_activities ? JSON.parse(data.pbl_activities) : [],
            justifications: data.justifications ? JSON.parse(data.justifications) : {}
          };
          setAiAnalysisData(analysisResult);
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

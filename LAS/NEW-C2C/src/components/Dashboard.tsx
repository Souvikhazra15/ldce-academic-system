import { Fragment, useState, useEffect } from "react";
import { Activity, Info, Edit2, RotateCcw, Save, CheckCircle, XCircle, Loader } from "lucide-react";
import type { MappingData } from "../utils/excelExport";
import { generateExcelExport } from "../utils/excelExport";
import { supabase } from "../supabaseClient";

interface DashboardProps {
  data: MappingData;
  courseId?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, courseId }) => {
  const courseOutcomes = data.courseOutcomes || [];
  const programOutcomes = data.programOutcomes || [];
  const lectures = data.lectures || [];
  const practicals = data.practicals || [];
  const pblActivities = data.pblActivities || [];

  // Save states
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Edit mode states
  const [isEditingCOPO, setIsEditingCOPO] = useState(false);
  const [isEditingLectures, setIsEditingLectures] = useState(false);
  const [isEditingActivities, setIsEditingActivities] = useState(false);

  // Original data for undo
  const [originalLectures] = useState(lectures);
  const [originalPracticals] = useState(practicals);
  const [originalPBL] = useState(pblActivities);
  const [originalCOPOMapping] = useState(data.coPoMapping || {});

  // Editable data states
  const [editableLectures, setEditableLectures] = useState(lectures);
  const [editablePracticals, setEditablePracticals] = useState(practicals);
  const [editablePBL, setEditablePBL] = useState(pblActivities);
  const [editableCOPOMapping, setEditableCOPOMapping] = useState(data.coPoMapping || {});

  // Save AI analysis result to database
  const saveAnalysisToDatabase = async () => {
    if (!courseId) return;
    
    setIsSaving(true);
    setSaveStatus("Saving...");
    
    try {
      const semesterNumber = parseInt(localStorage.getItem('semesterNumber') || '5');

      const mappingData = {
        subjectCode: courseId,
        subjectName: data.subject?.name,
        semesterNumber,
        courseOutcomes: editableLectures.length > 0 ? courseOutcomes : data.courseOutcomes,
        programOutcomes: programOutcomes,
        coPoMapping: editableCOPOMapping,
        lectures: editableLectures,
        practicals: editablePracticals,
        pblActivities: editablePBL
      };

      // Call backend API to save to CurriculumMapping
      const response = await fetch('http://localhost:5000/api/curriculum/curriculum-mapping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mappingData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save curriculum mapping');
      }

      setSaveStatus("✅ Saved successfully!");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Error saving to database:', error);
      setSaveStatus("❌ Error saving. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditLectures = () => {
    setIsEditingLectures(true);
  };

  const handleSaveLectures = () => {
    setIsEditingLectures(false);
    saveAnalysisToDatabase();
  };

  const handleUndoLectures = () => {
    setEditableLectures([...originalLectures]);
  };

  const handleEditActivities = () => {
    setIsEditingActivities(true);
  };

  const handleSaveActivities = () => {
    setIsEditingActivities(false);
    saveAnalysisToDatabase();
  };

  const handleUndoActivities = () => {
    setEditablePracticals([...originalPracticals]);
    setEditablePBL([...originalPBL]);
  };

  const handleEditCOPO = () => {
    setIsEditingCOPO(true);
  };

  const handleSaveCOPO = () => {
    setIsEditingCOPO(false);
    saveAnalysisToDatabase();
  };

  const handleUndoCOPO = () => {
    setEditableCOPOMapping({ ...originalCOPOMapping });
  };

  const handleToggleCOPOMapping = (coId: string, poId: string) => {
    const updated = { ...editableCOPOMapping };
    if (!updated[coId]) {
      updated[coId] = [];
    }
    const index = updated[coId].indexOf(poId);
    if (index > -1) {
      updated[coId].splice(index, 1);
    } else {
      updated[coId].push(poId);
    }
    setEditableCOPOMapping(updated);
  };

  const handleUpdateLectureField = (idx: number, field: string, value: any) => {
    const updated = [...editableLectures];
    updated[idx] = { ...updated[idx], [field]: value };
    setEditableLectures(updated);
  };

  const handleUpdatePracticalField = (idx: number, field: string, value: any) => {
    const updated = [...editablePracticals];
    updated[idx] = { ...updated[idx], [field]: value };
    setEditablePracticals(updated);
  };

  const handleUpdatePBLField = (idx: number, field: string, value: any) => {
    const updated = [...editablePBL];
    updated[idx] = { ...updated[idx], [field]: value };
    setEditablePBL(updated);
  };

  // RBT Level mapping
  const getRBTLevelName = (level: string | number): string => {
    const rbtMap: Record<string, string> = {
      "1": "Remember",
      "2": "Understand",
      "3": "Apply",
      "4": "Analyze",
      "5": "Evaluate",
      "6": "Create",
    };
    return rbtMap[String(level)] || String(level);
  };

  const handleExportExcel = async () => {
    generateExcelExport(data, `CO-PO-Mapping-${data.subject.code}.xlsx`);
  };

  return (
    <div className="ai-result-layout">
      {/* AI RESULT HEADER */}
      <div className="ai-result-header">
        <div className="ai-header-content">
          <h1 className="ai-result-title">AI-Analyzed Course Curriculum</h1>
          <div className="ai-result-meta">
            <p className="meta-item"><strong>Subject:</strong> {data?.subject?.name || 'Course Name'}</p>
            <p className="meta-item"><strong>Code:</strong> {data?.subject?.code || 'N/A'}</p>
            <p className="meta-item"><strong>COs:</strong> {courseOutcomes.length} | <strong>POs:</strong> {programOutcomes.length} | <strong>Lectures:</strong> {lectures.length}</p>
            {saveStatus && (
              <div className={`save-status-indicator ${isSaving ? 'saving' : saveStatus.includes('✅') ? 'success' : 'error'}`}>
                {isSaving && <Loader size={16} className="animate-spin" />}
                {saveStatus}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-export" onClick={() => { saveAnalysisToDatabase(); }} title="Save to Database" disabled={isSaving}>
            <Save size={16} /> {isSaving ? 'Saving...' : 'Save to DB'}
          </button>
          <button className="btn-export" onClick={handleExportExcel} title="Export to Excel">
            <Activity size={16} /> Export Excel
          </button>
        </div>
      </div>

      {/* OVERVIEW SECTION */}
      <h2 className="section-main-title">Overview</h2>
      <div className="card-section">
        <h3 className="section-heading-plain">Course Outcomes</h3>
        <div className="table-wrapper">
          <table className="table-standard">
            <thead>
              <tr>
                <th>CO</th>
                <th className="w-large">Description</th>
                <th>RBT Level</th>
                <th className="text-center">Allocated Hours</th>
              </tr>
            </thead>
            <tbody>
              {courseOutcomes.map((co, idx) => (
                <tr key={idx}>
                  <td><span className="badge-pill badge-primary">{co.id}</span></td>
                  <td>{co.description}</td>
                  <td className="text-center">{getRBTLevelName(co.rbtLevel)}</td>
                  <td className="text-center font-bold">{co.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CO-PO MAPPING SECTION */}
      <div className="card-section fade-in">
        <div className="section-header-with-buttons">
          <div>
            <h2 className="section-main-title">CO-PO Mapping</h2>
            <h3 className="section-title mb-large">CO-PO Alignment Matrix</h3>
          </div>
          <div className="edit-action-buttons">
            {!isEditingCOPO ? (
              <button className="btn-edit" onClick={handleEditCOPO} title="Edit CO-PO Mapping">
                <Edit2 size={16} /> Edit
              </button>
            ) : (
              <>
                <button className="btn-undo" onClick={handleUndoCOPO} title="Undo Changes">
                  <RotateCcw size={16} /> Undo
                </button>
                <button className="btn-save" onClick={handleSaveCOPO} title="Save Changes">
                  <Save size={16} /> Save
                </button>
              </>
            )}
          </div>
        </div>
            <div className="table-wrapper">
              <table className="table-standard">
                <thead>
                  <tr>
                    <th>Course Outcome</th>
                    {programOutcomes.map((po) => (
                      <th key={po.id} className="th-center w-fixed" title={po.description}>{po.id}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {courseOutcomes.map((co, idx) => (
                    <tr key={idx}>
                      <td className="td-highlight">
                        <div className="co-cell-content">
                          <span className="co-code">{co.id}</span>
                          <span className="co-summary">{co.description}</span>
                        </div>
                      </td>
                      {programOutcomes.map((po) => {
                        const isMapped = editableCOPOMapping[co.id]?.includes(po.id);
                        const justification = data.justifications?.[`${co.id}-${po.id}`];
                        return (
                          <td key={po.id} className="td-center" title={justification}>
                            <div 
                              className={`mapping-status ${isMapped ? 'is-mapped' : 'is-unmapped'} ${isEditingCOPO ? 'cursor-pointer' : ''}`}
                              onClick={() => isEditingCOPO && handleToggleCOPOMapping(co.id, po.id)}
                              role={isEditingCOPO ? "button" : undefined}
                              tabIndex={isEditingCOPO ? 0 : undefined}
                            >
                              {isMapped ? (
                                <CheckCircle size={20} className="icon-check" />
                              ) : (
                                <XCircle size={20} className="icon-x" />
                              )}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data.justifications && Object.keys(data.justifications).length > 0 && (
              <div className="justification-section mt-large">
                <h4 className="sub-section-title"><Info className="icon-small" /> Mapping Justifications</h4>
                <div className="justification-grid">
                  {Object.entries(data.justifications).map(([key, text], i) => (
                    <div key={i} className="justification-card">
                      <span className="justification-badge">{key}</span>
                      <p className="justification-text">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
      </div>

      {/* LECTURE PLANNING SECTION */}
      <div className="card-section fade-in">
        <div className="section-header-with-buttons">
          <div>
            <h2 className="section-main-title">Lecture Planning</h2>
            <div className="section-header-row">
              <h3 className="section-title">Detailed Lecture Plan</h3>
              <span className="badge-count">{editableLectures.length} Lectures</span>
            </div>
          </div>
          <div className="edit-action-buttons">
            {!isEditingLectures ? (
              <button className="btn-edit" onClick={handleEditLectures} title="Edit Lecture Plan">
                <Edit2 size={16} /> Edit
              </button>
            ) : (
              <>
                <button className="btn-undo" onClick={handleUndoLectures} title="Undo Changes">
                  <RotateCcw size={16} /> Undo
                </button>
                <button className="btn-save" onClick={handleSaveLectures} title="Save Changes">
                  <Save size={16} /> Save
                </button>
              </>
            )}
          </div>
        </div>

        <div className="table-wrapper">
          <table className="table-standard">
            <thead>
              <tr>
                <th>#</th>
                <th>Unit</th>
                <th className="w-large">Topic</th>
                <th>CO</th>
                <th>Mapped POs</th>
                <th className="text-center">Hours</th>
              </tr>
            </thead>
            <tbody>
              {editableLectures.map((lecture, idx) => {
                const isNewUnit = idx === 0 || editableLectures[idx - 1].unit !== lecture.unit;
                return (
                  <Fragment key={idx}>
                    {isNewUnit && (
                      <tr className="tr-unit-separator">
                        <td colSpan={6} className="td-unit-header">
                          Unit {lecture.unit}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td className="text-dim">L{lecture.lectureNo}</td>
                      <td className="text-medium">{lecture.unit}</td>
                      <td>
                        {isEditingLectures ? (
                          <input
                            type="text"
                            value={lecture.topic}
                            onChange={(e) => handleUpdateLectureField(idx, 'topic', e.target.value)}
                            className="edit-input"
                          />
                        ) : (
                          lecture.topic
                        )}
                      </td>
                      <td><span className="badge-pill badge-primary">{lecture.co}</span></td>
                      <td>
                        <div className="tag-group">
                          {lecture.pos.map((po, i) => (
                            <span key={i} className="po-tag">{po}</span>
                          ))}
                        </div>
                      </td>
                      <td className="text-center text-dim-dark">
                        {isEditingLectures ? (
                          <input
                            type="number"
                            value={lecture.hours}
                            onChange={(e) => handleUpdateLectureField(idx, 'hours', parseInt(e.target.value) || 0)}
                            className="edit-input-number"
                            min="0"
                          />
                        ) : (
                          lecture.hours
                        )}
                      </td>
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ACTIVITIES SECTION */}
      <div className="activity-layout fade-in">
        <div className="section-header-with-buttons">
          <h2 className="section-main-title">Activities</h2>
          <div className="edit-action-buttons">
            {!isEditingActivities ? (
              <button className="btn-edit" onClick={handleEditActivities} title="Edit Activities">
                <Edit2 size={16} /> Edit
              </button>
            ) : (
              <>
                <button className="btn-undo" onClick={handleUndoActivities} title="Undo Changes">
                  <RotateCcw size={16} /> Undo
                </button>
                <button className="btn-save" onClick={handleSaveActivities} title="Save Changes">
                  <Save size={16} /> Save
                </button>
              </>
            )}
          </div>
        </div>
        {editablePracticals.length > 0 && (
          <div className="card-section">
            <div className="section-header-row">
              <h3 className="section-title">Practical List (Laboratory)</h3>
              <span className="badge-count">{editablePracticals.length} Sessions</span>
            </div>
            <div className="table-wrapper">
              <table className="table-standard">
                <thead>
                  <tr>
                    <th>#</th>
                    <th className="w-half">Experiment / Practical Topic</th>
                    <th>COs</th>
                    <th>Mapped POs</th>
                    <th className="w-large">Assessment Methodology</th>
                    <th className="text-center">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {editablePracticals.map((prac, idx) => (
                    <tr key={idx}>
                      <td className="text-dim">P{prac.practicalNo}</td>
                      <td>
                        {isEditingActivities ? (
                          <input
                            type="text"
                            value={prac.name}
                            onChange={(e) => handleUpdatePracticalField(idx, 'name', e.target.value)}
                            className="edit-input"
                          />
                        ) : (
                          prac.name
                        )}
                      </td>
                          <td><span className="badge-pill badge-outline">{prac.mappedCOs.join(", ")}</span></td>
                          <td>
                            {prac.mappedPOs && prac.mappedPOs.length > 0 ? (
                              <span className="badge-pill badge-green-outline">{prac.mappedPOs.join(", ")}</span>
                            ) : (
                              <span className="text-dim-sm">-</span>
                            )}
                          </td>
                          <td><span className="text-dim-sm italic">{prac.assessment || "Performance & Viva"}</span></td>
                          <td className="text-center font-bold">{prac.hours}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

        {editablePBL.length > 0 && (
          <div className="card-section">
            <div className="section-header-row">
              <h3 className="section-title">PBL & Activity-Based Learning</h3>
              <span className="badge-count">{pblActivities.length} Topics</span>
            </div>
            <div className="table-wrapper">
              <table className="table-standard">
                <thead>
                  <tr>
                    <th>#</th>
                    <th className="w-half">Problem Statement / Activity</th>
                    <th>COs</th>
                    <th>Mapped POs</th>
                    <th className="w-large">Execution / Assessment</th>
                    <th className="text-center">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {editablePBL.map((pbl, idx) => (
                    <tr key={idx}>
                      <td className="text-dim">{pbl.activityNo}</td>
                      <td className="font-medium text-indigo">
                        {isEditingActivities ? (
                          <input
                            type="text"
                            value={pbl.name}
                            onChange={(e) => handleUpdatePBLField(idx, 'name', e.target.value)}
                            className="edit-input"
                          />
                        ) : (
                          pbl.name
                        )}
                      </td>
                      <td><span className="badge-pill badge-primary-outline">{pbl.mappedCOs.join(", ")}</span></td>
                      <td>
                        {pbl.mappedPOs && pbl.mappedPOs.length > 0 ? (
                          <span className="badge-pill badge-green-outline">{pbl.mappedPOs.join(", ")}</span>
                        ) : (
                          <span className="text-dim-sm">-</span>
                        )}
                      </td>
                      <td className="text-dim-sm italic">{pbl.assessment || "Report & Peer-Review"}</td>
                      <td className="text-center font-bold">{pbl.hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {practicals.length === 0 && pblActivities.length === 0 && (
          <div className="empty-state-card">
            <Activity className="icon-empty" />
            <p>No Practical or PBL activities detected in this syllabus.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
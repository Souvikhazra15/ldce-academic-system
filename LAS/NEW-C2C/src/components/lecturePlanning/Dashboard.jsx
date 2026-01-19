import { useState, Fragment } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Download, Activity, Layers, BookOpen, TrendingUp, Info } from "lucide-react";
import { generateExcelExport } from "../../utils/lecturePlanning/excelExport";

export const Dashboard = ({ data }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const courseOutcomes = data.courseOutcomes || [];
  const programOutcomes = data.programOutcomes || [];
  const lectures = data.lectures || [];
  const practicals = data.practicals || [];
  const pblActivities = data.pblActivities || [];

  // Hour distribution data
  const lectureHours = lectures.reduce((sum, l) => sum + (l.hours || 1), 0);
  const practicalHours = practicals.reduce((sum, p) => sum + (p.hours || 0), 0);
  const pblHours = pblActivities.reduce((sum, pbl) => sum + (pbl.hours || 0), 0);
  const totalHours = lectureHours + practicalHours + pblHours;

  const hourDistribution = [
    { name: "Lectures", value: Math.round((lectureHours / totalHours) * 100) || 33, hours: lectureHours, fill: "#4f46e5" },
    { name: "Practicals", value: Math.round((practicalHours / totalHours) * 100) || 33, hours: practicalHours, fill: "#10b981" },
    { name: "PBL", value: Math.round((pblHours / totalHours) * 100) || 34, hours: pblHours, fill: "#f59e0b" },
  ];

  // CO distribution data
  const coDistribution = courseOutcomes.map((co) => ({
    name: co.id,
    hours: co.hours || 0,
    rbtLevel: co.rbtLevel,
  }));

  // CO-PO Mapping Matrix

  const handleExportExcel = async () => {
    generateExcelExport(data, `CO-PO-Mapping-${data.subject.code}.xlsx`);
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`tab-button ${activeTab === id ? 'is-active' : ''}`}
    >
      <Icon className="icon-small" />
      {label}
    </button>
  );

  return (
    <div className="dashboard-layout fade-in-up">
      {/* Subject Header Card */}
      <div className="card-hero">
        <div className="hero-bg-icon">
          <BookOpen className="icon-hero-bg" />
        </div>
        <div className="hero-content">
          <div className="hero-header">
            <div>
              <h1 className="hero-title">{data.subject.name}</h1>
              <div className="hero-tags">
                <span className="info-tag">Code: {data.subject.code}</span>
                <span className="info-tag">Credits: {data.subject.credits}</span>
                <span className="info-tag">Semester: {data.subject.semester}</span>
              </div>
            </div>
            <button
              onClick={handleExportExcel}
              className="btn-action"
            >
              <Download className="icon-small" />
              Export Excel
            </button>
          </div>

          <div className="stats-grid">
            <div className="stat-item stat-indigo">
              <p className="stat-label">Total Hours</p>
              <p className="stat-value">{data.subject.totalHours}</p>
            </div>
            <div className="stat-item stat-emerald">
              <p className="stat-label">Outcomes (COs)</p>
              <p className="stat-value">{courseOutcomes.length}</p>
            </div>
            <div className="stat-item stat-amber">
              <p className="stat-label">Lectures</p>
              <p className="stat-value">{lectures.length}</p>
            </div>
            <div className="stat-item stat-purple">
              <p className="stat-label">Activities</p>
              <p className="stat-value">{practicals.length + pblActivities.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        <TabButton id="overview" label="Overview" icon={Activity} />
        <TabButton id="matrix" label="CO-PO Matrix" icon={Layers} />
        <TabButton id="lectures" label="Lecture Plan" icon={BookOpen} />
        <TabButton id="activities" label="Activities" icon={TrendingUp} />
      </div>

      {/* Tab Content */}
      <div className="tab-content-area">
        {activeTab === 'overview' && (
          <div className="overview-layout fade-in">
            {/* Charts */}
            <div className="card-section">
              <h3 className="section-title"><Activity className="icon-title" /> Hour Distribution</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={hourDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {hourDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-legend">
                {hourDistribution.map((entry, idx) => (
                  <div key={idx} className="legend-item">
                    <div className="legend-dot" style={{ backgroundColor: entry.fill }} />
                    <span className="legend-text">{entry.name} ({entry.value}%)</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-section">
              <h3 className="section-title"><Layers className="icon-title" /> CO Hour Allocation</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={coDistribution} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                    <Tooltip
                      cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="hours" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CO Cards */}
            <div className="col-full">
              <h3 className="section-heading-plain">Course Outcomes</h3>
              <div className="co-grid">
                {courseOutcomes.map((co, idx) => (
                  <div key={idx} className="co-card">
                    <div className="co-header">
                      <span className="co-id">{co.id}</span>
                      <span className="co-rbt">{co.rbtLevel}</span>
                    </div>
                    <p className="co-desc">{co.description}</p>
                    <div className="co-footer">
                      Allocated Hours: {co.hours}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'matrix' && (
          <div className="card-section fade-in">
            <h3 className="section-title mb-large">CO-PO Alignment Matrix</h3>
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
                        const isMapped = data.coPoMapping[co.id]?.includes(po.id);
                        const justification = data.justifications?.[`${co.id}-${po.id}`];
                        return (
                          <td key={po.id} className="td-center" title={justification}>
                            <div className={`mapping-status ${isMapped ? 'is-mapped' : 'is-unmapped'}`} >
                              {isMapped ? '✅' : '❌'}
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
        )}

        {activeTab === 'lectures' && (
          <div className="card-section fade-in">
            <div className="section-header-row">
              <h3 className="section-title">Detailed Lecture Plan</h3>
              <span className="badge-count">{lectures.length} Lectures</span>
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
                  {lectures.map((lecture, idx) => {
                    const isNewUnit = idx === 0 || lectures[idx - 1].unit !== lecture.unit;
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
                          <td>{lecture.topic}</td>
                          <td><span className="badge-pill badge-primary">{lecture.co}</span></td>
                          <td>
                            <div className="tag-group">
                              {lecture.pos.map((po, i) => (
                                <span key={i} className="po-tag">{po}</span>
                              ))}
                            </div>
                          </td>
                          <td className="text-center text-dim-dark">{lecture.hours}</td>
                        </tr>
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="activity-layout fade-in">
            {practicals.length > 0 && (
              <div className="card-section">
                <div className="section-header-row">
                  <h3 className="section-title">Practical List (Laboratory)</h3>
                  <span className="badge-count">{practicals.length} Sessions</span>
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
                      {practicals.map((prac, idx) => (
                        <tr key={idx}>
                          <td className="text-dim">P{prac.practicalNo}</td>
                          <td>{prac.name}</td>
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

            {pblActivities.length > 0 && (
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
                      {pblActivities.map((pbl, idx) => (
                        <tr key={idx}>
                          <td className="text-dim">{pbl.activityNo}</td>
                          <td className="font-medium text-indigo">{pbl.name}</td>
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
        )}
      </div>
    </div>
  );
};
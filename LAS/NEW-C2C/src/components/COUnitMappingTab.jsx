import React from 'react';
import '../styles/TabContent.css';

const COUnitMappingTab = ({ mapping = [] }) => {
  // Mock CO-Unit mapping data - will be replaced with API call
  const mockMapping = [
    {
      unit: 'Unit 1',
      title: 'Introduction to Data Structures',
      cos: ['CO1', 'CO2']
    },
    {
      unit: 'Unit 2',
      title: 'Trees and Graphs',
      cos: ['CO1', 'CO3', 'CO4']
    },
    {
      unit: 'Unit 3',
      title: 'Sorting and Searching',
      cos: ['CO2', 'CO3', 'CO4']
    }
  ];

  const data = mapping.length > 0 ? mapping : mockMapping;

  return (
    <div className="tab-content">
      <div className="section">
        <h4 className="section-title">Course Outcome - Unit Mapping</h4>
        <div className="mapping-container">
          <table className="mapping-table">
            <thead>
              <tr>
                <th>Unit</th>
                <th>Unit Title</th>
                <th>Mapped Course Outcomes</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  <td className="unit-col">{row.unit}</td>
                  <td>{row.title}</td>
                  <td>
                    <div className="co-badges">
                      {row.cos?.map((co) => (
                        <span key={co} className="co-badge">{co}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default COUnitMappingTab;

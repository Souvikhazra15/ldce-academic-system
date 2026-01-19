/**
 * Format course reference in the format: SubName-SubCode-Dept-Sem-Division
 * @param {Object} course - Course object containing name, code, department, semester, and division
 * @returns {String} Formatted course reference
 * @example
 * formatCourseReference({ 
 *   code: '3137007', 
 *   name: 'Data Structure', 
 *   abbr: 'DS',
 *   department: 'IT', 
 *   semester: 3, 
 *   division: 'B1' 
 * })
 * // Returns: "DS-3137007-IT-3-B1"
 */
export const formatCourseReference = (course) => {
  if (!course) return '';
  
  const abbr = course.abbr || course.name?.substring(0, 2).toUpperCase() || '';
  const code = course.code || '';
  const dept = course.department || course.dept || '';
  const sem = course.semester || '';
  const div = course.division || course.div || '';

  return `${abbr}-${code}-${dept}-${sem}-${div}`.toUpperCase();
};

/**
 * Format course reference for display in dropdowns
 * @param {Object} course - Course object
 * @returns {String} Formatted display string with course name
 * @example
 * formatCourseLabel({ 
 *   code: '3137007', 
 *   name: 'Data Structure', 
 *   abbr: 'DS',
 *   department: 'IT', 
 *   semester: 3, 
 *   division: 'B1' 
 * })
 * // Returns: "DS-3137007-IT-3-B1 (Data Structure)"
 */
export const formatCourseLabel = (course) => {
  if (!course) return '';
  
  const formatted = formatCourseReference(course);
  const name = course.name || '';

  return formatted ? `${formatted} (${name})` : name;
};

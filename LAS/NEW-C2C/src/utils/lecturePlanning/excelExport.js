import * as XLSX from 'xlsx';

export function generateExcelExport(data, fileName = "CO-PO-Mapping.xlsx") {
  // Create workbook
  const wb = XLSX.utils.book_new();

  // Sheet 1: Subject & Overview
  const overviewData = [
    ["COURSE OUTCOME - PROGRAM OUTCOME MAPPING"],
    [""],
    ["Subject Code", data.subject.code],
    ["Subject Name", data.subject.name],
    ["Credits", data.subject.credits],
    ["Semester", data.subject.semester],
    ["Total Hours", data.subject.totalHours],
  ];
  const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
  XLSX.utils.book_append_sheet(wb, overviewSheet, "Overview");

  // Sheet 2: Course Outcomes
  const coData = [
    ["CO ID", "Description", "RBT Level", "Hours", "Mapped POs"],
    ...data.courseOutcomes.map((co) => [
      co.id,
      co.description,
      co.rbtLevel,
      co.hours,
      data.coPoMapping[co.id]?.join(", ") || ""
    ])
  ];
  const coSheet = XLSX.utils.aoa_to_sheet(coData);
  coSheet['!cols'] = [{ wch: 10 }, { wch: 40 }, { wch: 12 }, { wch: 10 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, coSheet, "Course Outcomes");

  // Sheet 3: Program Outcomes
  const poData = [
    ["PO ID", "Description"],
    ...data.programOutcomes.map((po) => [po.id, po.description])
  ];
  const poSheet = XLSX.utils.aoa_to_sheet(poData);
  poSheet['!cols'] = [{ wch: 10 }, { wch: 80 }];
  XLSX.utils.book_append_sheet(wb, poSheet, "Program Outcomes");

  // Sheet 4: CO-PO Mapping Matrix
  const matrixData = [
    ["", ...data.programOutcomes.map((po) => po.id)],
    ...data.courseOutcomes.map((co) => [
      co.id,
      ...data.programOutcomes.map((po) => {
        const isMapped = data.coPoMapping[co.id]?.includes(po.id) ? "✓" : "";
        return isMapped;
      })
    ])
  ];
  const matrixSheet = XLSX.utils.aoa_to_sheet(matrixData);
  XLSX.utils.book_append_sheet(wb, matrixSheet, "CO-PO Matrix");

  // Sheet 5: Lectures
  const lectureData = [
    ["Lecture No", "Unit", "Topic", "Hours", "CO", "POs"],
    ...data.lectures.map((lecture) => [
      lecture.lectureNo,
      lecture.unit,
      lecture.topic,
      lecture.hours,
      lecture.co,
      lecture.pos.join(", ")
    ])
  ];
  const lectureSheet = XLSX.utils.aoa_to_sheet(lectureData);
  lectureSheet['!cols'] = [{ wch: 12 }, { wch: 12 }, { wch: 30 }, { wch: 8 }, { wch: 8 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, lectureSheet, "Lectures");

  // Sheet 6: Practicals
  const practicalData = [
    ["Practical No", "Name", "Hours", "Assessment", "Mapped COs", "Mapped POs"],
    ...data.practicals.map((practical) => [
      practical.practicalNo,
      practical.name,
      practical.hours,
      practical.assessment || "",
      practical.mappedCOs.join(", "),
      practical.mappedPOs.join(", ")
    ])
  ];
  const practicalSheet = XLSX.utils.aoa_to_sheet(practicalData);
  practicalSheet['!cols'] = [{ wch: 14 }, { wch: 30 }, { wch: 8 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, practicalSheet, "Practicals");

  // Sheet 7: PBL Activities
  const pblData = [
    ["PBL No", "Name", "Hours", "Assessment", "Mapped COs", "Mapped POs"],
    ...data.pblActivities.map((pbl) => [
      pbl.activityNo,
      pbl.name,
      pbl.hours,
      pbl.assessment || "",
      pbl.mappedCOs.join(", "),
      pbl.mappedPOs.join(", ")
    ])
  ];
  const pblSheet = XLSX.utils.aoa_to_sheet(pblData);
  pblSheet['!cols'] = [{ wch: 10 }, { wch: 30 }, { wch: 8 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, pblSheet, "PBL Activities");

  // Sheet 8: Hour Distribution
  const hourData = [
    ["Component", "Hours", "Percentage"],
    ["Lectures", data.subject.theoryHours || 0, `${Math.round(((data.subject.theoryHours || 0) / data.subject.totalHours) * 100)}%`],
    ["Practicals", data.subject.practicalHours || 0, `${Math.round(((data.subject.practicalHours || 0) / data.subject.totalHours) * 100)}%`],
    ["PBL/Tutorial", data.subject.pblHours || 0, `${Math.round(((data.subject.pblHours || 0) / data.subject.totalHours) * 100)}%`],
    ["Total", data.subject.totalHours, "100%"]
  ];
  const hourSheet = XLSX.utils.aoa_to_sheet(hourData);
  XLSX.utils.book_append_sheet(wb, hourSheet, "Hour Distribution");

  // Download
  XLSX.writeFile(wb, fileName);
}
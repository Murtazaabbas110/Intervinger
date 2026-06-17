import jsPDF from "jspdf";

export function downloadReportPDF(report) {
  const doc = new jsPDF();

  // ======================
  // FONT (Times New Roman style)
  // ======================
  doc.setFont("times", "normal");

  let y = 20; // dynamic vertical cursor

  // ======================
  // TITLE
  // ======================
  doc.setFontSize(18);
  doc.setFont("times", "bold");
  doc.text("Interview Report", 20, y);
  y += 15;

  doc.setFontSize(12);
  doc.setFont("times", "normal");

  // ======================
  // SESSION INFO
  // ======================
  doc.text(`Problem: ${report.sessionId?.problem || "N/A"}`, 20, y);
  y += 10;

  doc.text(`Difficulty: ${report.sessionId?.difficulty || "N/A"}`, 20, y);
  y += 15;

  // ======================
  // CANDIDATE INFO
  // ======================
  doc.setFont("times", "bold");
  doc.text("Candidate Information", 20, y);
  y += 10;

  doc.setFont("times", "normal");
  doc.text(`Name: ${report.candidateId?.name || "N/A"}`, 20, y);
  y += 10;

  doc.text(`Email: ${report.candidateId?.email || "N/A"}`, 20, y);
  y += 15;

  // ======================
  // SCORES
  // ======================
  doc.setFont("times", "bold");
  doc.text("Performance Metrics", 20, y);
  y += 10;

  doc.setFont("times", "normal");

  doc.text(`Score: ${report.score}`, 20, y);
  y += 10;

  doc.text(`Readability: ${report.readability}`, 20, y);
  y += 10;

  doc.text(`Efficiency: ${report.efficiency}`, 20, y);
  y += 10;

  doc.text(`Problem Solving: ${report.problemSolving}`, 20, y);
  y += 15;

  // ======================
  // RECOMMENDATION
  // ======================
  doc.setFont("times", "bold");
  doc.text("Recommendation", 20, y);
  y += 10;

  doc.setFont("times", "normal");
  const recText = doc.splitTextToSize(report.recommendation || "", 170);
  doc.text(recText, 20, y);
  y += recText.length * 6 + 10;

  // ======================
  // FEEDBACK
  // ======================
  doc.setFont("times", "bold");
  doc.text("Feedback", 20, y);
  y += 10;

  doc.setFont("times", "normal");
  const feedbackText = doc.splitTextToSize(report.feedback || "", 170);
  doc.text(feedbackText, 20, y);

  // ======================
  // SAVE
  // ======================
  doc.save(`interview-report-${report._id}.pdf`);
}

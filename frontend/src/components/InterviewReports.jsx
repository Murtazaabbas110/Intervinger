import { FileDown, FileText } from "lucide-react";
import { downloadReportPDF } from "../utils/pdf";

function InterviewReports({ reports }) {
  if (!reports?.length) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-accent to-secondary rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black">
              Interview Reports
            </h2>
          </div>
          <p>No reports generated yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-3 bg-gradient-to-br from-accent to-secondary rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black">Interview Reports</h2>
        </div>

        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report._id}
              className="border border-base-300 rounded-xl p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">
                    {report.sessionId?.problem}
                  </h3>

                  <p className="text-sm opacity-70">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>

                  <div className="mt-2 flex flex-col">
                    <span className="font-semibold text-sm">
                      {report.candidateId?.name || "Unknown Candidate"}
                    </span>

                    <span className="text-xs opacity-60">
                      {report.candidateId?.email || "No email"}
                    </span>
                  </div>
                </div>

                <div className="badge badge-primary badge-lg">
                  {report.score}/10
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-3 mt-4">
                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">Readability</div>
                  <div className="stat-value text-2xl">
                    {report.readability}
                  </div>
                </div>

                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">Efficiency</div>
                  <div className="stat-value text-2xl">{report.efficiency}</div>
                </div>

                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">Problem Solving</div>
                  <div className="stat-value text-2xl">
                    {report.problemSolving}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <span className="font-semibold">Copy/Paste Risk:</span>
                <p className="text-sm mt-1">{report.copyPasteRisk}</p>
              </div>

              <div className="mt-4">
                <span className="font-semibold">Recommendation:</span>
                <p className="text-sm mt-1">{report.recommendation}</p>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    document.getElementById(`report_${report._id}`).showModal()
                  }
                >
                  View Report
                </button>

                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => downloadReportPDF(report)}
                >
                  <FileDown size={16} />
                  PDF
                </button>
              </div>

              {/* Modal */}
              <dialog id={`report_${report._id}`} className="modal">
                <div className="modal-box max-w-4xl">
                  <h3 className="font-bold text-xl mb-4">
                    AI Interview Report
                  </h3>

                  <p className="mb-4">{report.feedback}</p>

                  <div className="modal-action">
                    <form method="dialog">
                      <button className="btn">Close</button>
                    </form>
                  </div>
                </div>
              </dialog>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InterviewReports;

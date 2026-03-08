import { useEffect, useState } from "react";
import MainNavbar from "../../components/layout/MainNavbar";
import { getEcoReportSummary } from "../../services/insightsService";
import "../../styles/Insights.css";

function EcoReports() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    getEcoReportSummary().then((data) => setReport(data));
  }, []);

  return (
    <div className="insights-page">
      <MainNavbar />
      <div className="insights-shell">
        <div className="insights-head">
          <h2>Eco Reports</h2>
          <p>Frontend report preview. Download trigger is UI-only until backend endpoint is available.</p>
        </div>

        {!report ? (
          <p className="loading-row">Loading report summary...</p>
        ) : (
          <section className="report-card">
            <h3>Eco Report Summary - {report.reportMonth}</h3>
            <div className="report-grid">
              <div>
                <span>Total Orders</span>
                <strong>{report.totalOrders}</strong>
              </div>
              <div>
                <span>Total Footprint</span>
                <strong>{report.footprintKg} kg CO2</strong>
              </div>
              <div>
                <span>Total Savings</span>
                <strong>{report.savingsKg} kg CO2</strong>
              </div>
              <div>
                <span>Top Category</span>
                <strong>{report.topCategory}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{report.status}</strong>
              </div>
            </div>

            <button className="download-btn" type="button">
              Download Eco Report
            </button>
          </section>
        )}
      </div>
    </div>
  );
}

export default EcoReports;

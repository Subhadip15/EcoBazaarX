function EmissionIndicator({ emissionKg = 0, itemCount = 0 }) {
  const average = itemCount > 0 ? emissionKg / itemCount : 0;
  const status = emissionKg <= 10 ? "low" : emissionKg <= 25 ? "medium" : "high";

  return (
    <div className={`emission-card ${status}`}>
      <div>
        <p className="emission-label">Estimated CO2 Emissions</p>
        <h3>{emissionKg.toFixed(2)} kg</h3>
        <small>Average per item: {average.toFixed(2)} kg</small>
      </div>
      <span className="emission-badge">{status.toUpperCase()}</span>
    </div>
  );
}

export default EmissionIndicator;

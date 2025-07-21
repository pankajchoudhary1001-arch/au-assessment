import React from 'react';

type BarChartData = {
  name: string;
  value: number;
};

type BarChartUIProps = {
  data: BarChartData[];
};

const BarChartUI: React.FC<BarChartUIProps> = ({ data }) => {
  const maxSales = Math.max(...data.map((item) => item.value));

  return (
    <div className="bar-chart-container" style={{ maxHeight: '400px', overflowY: 'auto'}}>
      {data.map((item, index) => {
        const percent = (item.value / maxSales) * 100;
        const remaining = 100 - percent;

        return (
          <div key={index} className="bar-row">
            <div className="bar-label">{item.name}</div>
            <div className="bar-wrapper">
              <div
                className="bar-filled"
                style={{ width: `${percent}%` }}
              ></div>
              <div
                className="bar-empty"
                style={{ width: `${remaining}%` }}
              ></div>
            </div>
          </div>
        );
      })}
      <div className="bar-ticks">
        {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => (
          <span key={val} className="bar-tick">
            ${val}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BarChartUI;

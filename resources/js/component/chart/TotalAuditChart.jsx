// TotalAuditChart.jsx
import React, { useEffect, useRef } from 'react';
import '../../../css/styles/chart/TotalAuditChart.css';

const TotalAuditChart = ({ status }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  
  // Generate dates for the last week
  const getLastWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      dates.push({
        x: date.getTime(),
        y: Math.floor(Math.random() * 300) + 600 // Random values between 600-900
      });
    }
    return dates;
  };
  
  const dataPoints = {
    'Complete': getLastWeekDates(),
    'Scheduled': getLastWeekDates().map(dp => ({ x: dp.x, y: dp.y - 100 })),
    'Incomplete': getLastWeekDates().map(dp => ({ x: dp.x, y: dp.y - 200 }))
  };
  
  useEffect(() => {
    if (typeof window !== 'undefined' && window.CanvasJS && chartContainerRef.current) {
      const options = {
        animationEnabled: true,
        theme: "light2",
        title: {
          text: "Total Audit"
        },
        axisX: {
          valueFormatString: "DD MMM"
        },
        axisY: {
          title: "Total Number of Audits",
          includeZero: true,
          maximum: 1200
        },
        data: [{
          type: "splineArea",
          color: "#6599FF",
          xValueType: "dateTime",
          xValueFormatString: "DD MMM",
          yValueFormatString: "#,##0 Audits",
          dataPoints: dataPoints[status]
        }]
      };
      
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      
      chartRef.current = new window.CanvasJS.Chart(chartContainerRef.current, options);
      chartRef.current.render();
    }
  }, [status]);
  
  return (
    <div className="audit-chart-wrapper">
      <div ref={chartContainerRef} className="audit-chart-inner" />
    </div>
  );
};

export default TotalAuditChart;
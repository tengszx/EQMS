// RevisionControlChart.jsx
import React, { useEffect, useRef } from 'react';
import '../../../css/styles/chart/RevisionControlChart.css';

const RevisionControlChart = () => {
  const chartContainerRef = useRef(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && window.CanvasJS) {
      // Get dates for last week
      const generateLastWeekData = () => {
        const dataPoints = [];
        const today = new Date();
        
        for (let i = 0; i < 15; i++) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          
          dataPoints.push({
            x: i * 10, // Use values from 0 to 140 instead of temperatures
            y: Math.random() * 5 + 1 // Random revision counts between 1-6
          });
        }
        
        return dataPoints;
      };
      
      const dataPoints = generateLastWeekData();
      
      const chart = new window.CanvasJS.Chart(chartContainerRef.current, {
        title: {
          text: "Document Control Revision"
        },
        axisX: {
          title: "Date",
          suffix: "",
          minimum: 0,
          maximum: 100
        },
        axisY: {
          title: "Total of Revision",
          suffix: "",
          minimum: 0,
          maximum: 7
        },
        data: [{
          type: "area",
          markerSize: 0,
          xValueFormatString: "#,##0",
          yValueFormatString: "#,##0",
          dataPoints: dataPoints
        }]
      });
      
      chart.render();
    }
  }, []);
  
  return (
    <div className="revision-chart-wrapper">
      <div ref={chartContainerRef} className="revision-chart-inner" />
    </div>
  );
};

export default RevisionControlChart;
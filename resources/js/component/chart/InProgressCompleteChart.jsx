// InProgressCompleteChart.jsx
import React, { useState, useEffect, useRef } from 'react';

import '../../../css/styles/chart/InProgressCompleteChart.css';

const InProgressCompleteChart = () => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const [isBackButtonVisible, setIsBackButtonVisible] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && window.CanvasJS) {
      const totalVisitors = 883000;
      
      const newVsReturningVisitorsDataPoints = [
        { y: 519960, name: "In Progress", color: "#E7823A" },
        { y: 363040, name: "Complete", color: "#546BC1" }
      ];
      
      const inProgressDataPoints = [
        { x: 1420050600000, y: 33000 },
        { x: 1422729000000, y: 35960 },
        { x: 1425148200000, y: 42160 },
        { x: 1427826600000, y: 42240 },
        { x: 1430418600000, y: 43200 },
        { x: 1433097000000, y: 40600 },
        { x: 1435689000000, y: 42560 },
        { x: 1438367400000, y: 44280 },
        { x: 1441045800000, y: 44800 },
        { x: 1443637800000, y: 48720 },
        { x: 1446316200000, y: 50840 },
        { x: 1448908200000, y: 51600 }
      ];
      
      const completeDataPoints = [
        { x: 1420050600000, y: 22000 },
        { x: 1422729000000, y: 26040 },
        { x: 1425148200000, y: 25840 },
        { x: 1427826600000, y: 23760 },
        { x: 1430418600000, y: 28800 },
        { x: 1433097000000, y: 29400 },
        { x: 1435689000000, y: 33440 },
        { x: 1438367400000, y: 37720 },
        { x: 1441045800000, y: 35200 },
        { x: 1443637800000, y: 35280 },
        { x: 1446316200000, y: 31160 },
        { x: 1448908200000, y: 34400 }
      ];
      
      const visitorsData = {
        "In Progress vs Complete": [{
          click: visitorsChartDrilldownHandler,
          cursor: "pointer",
          explodeOnClick: false,
          innerRadius: "75%",
          legendMarkerType: "square",
          name: "In Progress vs Complete",
          radius: "100%",
          showInLegend: true,
          startAngle: 90,
          type: "doughnut",
          dataPoints: newVsReturningVisitorsDataPoints
        }],
        "In Progress": [{
          color: "#E7823A",
          name: "In Progress",
          type: "column",
          xValueType: "dateTime",
          dataPoints: inProgressDataPoints
        }],
        "Complete": [{
          color: "#546BC1",
          name: "Complete",
          type: "column",
          xValueType: "dateTime",
          dataPoints: completeDataPoints
        }]
      };
      
      const newVSReturningVisitorsOptions = {
        animationEnabled: true,
        theme: "light2",
        title: {
          text: "In Progress VS Complete"
        },
        subtitles: [{
          text: "Click on Any Segment to Drilldown",
          backgroundColor: "#2eacd1",
          fontSize: 16,
          fontColor: "white",
          padding: 5
        }],
        legend: {
          fontFamily: "calibri",
          fontSize: 14,
          itemTextFormatter: function (e) {
            return e.dataPoint.name + ": " + Math.round(e.dataPoint.y / totalVisitors * 100) + "%";  
          }
        },
        data: []
      };
      
      const visitorsDrilldownedChartOptions = {
        animationEnabled: true,
        theme: "light2",
        axisX: {
          labelFontColor: "#717171",
          lineColor: "#a2a2a2",
          tickColor: "#a2a2a2"
        },
        axisY: {
          gridThickness: 0,
          includeZero: false,
          labelFontColor: "#717171",
          lineColor: "#a2a2a2",
          tickColor: "#a2a2a2",
          lineThickness: 1
        },
        data: []
      };
      
      chartRef.current = new window.CanvasJS.Chart(chartContainerRef.current, newVSReturningVisitorsOptions);
      chartRef.current.options.data = visitorsData["In Progress vs Complete"];
      chartRef.current.render();
      
      function visitorsChartDrilldownHandler(e) {
        chartRef.current = new window.CanvasJS.Chart(chartContainerRef.current, visitorsDrilldownedChartOptions);
        chartRef.current.options.data = visitorsData[e.dataPoint.name];
        chartRef.current.options.title = { text: e.dataPoint.name };
        chartRef.current.render();
        setIsBackButtonVisible(true);
      }
    }
  }, []);
  
  const handleBackButton = () => {
    if (typeof window !== 'undefined' && window.CanvasJS && chartRef.current) {
      const totalVisitors = 883000;
      
      const newVsReturningVisitorsDataPoints = [
        { y: 519960, name: "In Progress", color: "#E7823A" },
        { y: 363040, name: "Complete", color: "#546BC1" }
      ];
      
      const newVSReturningVisitorsOptions = {
        animationEnabled: true,
        theme: "light2",
        title: {
          text: "In Progress VS Complete"
        },
        subtitles: [{
          text: "Click on Any Segment to Drilldown",
          backgroundColor: "#2eacd1",
          fontSize: 16,
          fontColor: "white",
          padding: 5
        }],
        legend: {
          fontFamily: "calibri",
          fontSize: 14,
          itemTextFormatter: function (e) {
            return e.dataPoint.name + ": " + Math.round(e.dataPoint.y / totalVisitors * 100) + "%";  
          }
        },
        data: [{
          click: function() {},
          cursor: "pointer",
          explodeOnClick: false,
          innerRadius: "75%",
          legendMarkerType: "square",
          name: "In Progress vs Complete",
          radius: "100%",
          showInLegend: true,
          startAngle: 90,
          type: "doughnut",
          dataPoints: newVsReturningVisitorsDataPoints
        }]
      };
      
      chartRef.current = new window.CanvasJS.Chart(chartContainerRef.current, newVSReturningVisitorsOptions);
      chartRef.current.render();
      setIsBackButtonVisible(false);
    }
  };
  
  return (
    <div className="chart-wrapper">
      <div ref={chartContainerRef} className="chart-inner" />
      {isBackButtonVisible && (
        <button className="back-button" onClick={handleBackButton}>
          &lt; Back
        </button>
      )}
    </div>
  );
};

export default InProgressCompleteChart;
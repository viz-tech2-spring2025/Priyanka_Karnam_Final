import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const VerticalFlowChart = ({ data, currentStep }) => {
  const svgRef = useRef();
  const targetDates = [
    "13.01.2025", "14.01.2025", "29.01.2025", "03.02.2025", "12.02.2025"
  ];

  const categories = ["Fecal_Coliform", "BOD", "pH"];
  const colors = d3.scaleOrdinal()
    .domain(categories)
    .range(["#c00021", "#e86e50", "#e2a85d"]);

  const fullHeight = 2000;
  const visibleHeight = 700;
  const width = 700;
  const margin = { top: 100, right: 150, bottom: 100, left: 100 };

  // Parse and prepare data once
  const parseDate = d3.timeParse("%d.%m.%Y");
  const parsedDates = targetDates.map(parseDate);

  const parsed = data
    .map(d => ({
      date: parseDate(d.Date),
      Fecal_Coliform: +d.Fecal_Coliform,
      BOD: +d.BOD,
      pH: +d.pH
    }))
    .filter(d => d.date && parsedDates.some(td => +td === +d.date));

  const y = d3.scalePoint()
    .domain(parsed.map(d => d.date))
    .range([0, fullHeight - margin.top - margin.bottom])
    .padding(0.5);

  const laneScale = d3.scaleBand()
    .domain(categories)
    .range([0, width - margin.left - margin.right])
    .padding(0.1);

  const individualScales = {};
  categories.forEach(cat => {
    const maxVal = d3.max(parsed, d => d[cat]);
    individualScales[cat] = cat === "Fecal_Coliform"
      ? d3.scaleLog().base(10).domain([1, maxVal]).range([0, laneScale.bandwidth()])
      : d3.scaleLinear().domain([0, maxVal]).range([0, laneScale.bandwidth()]);
  });

  // ✅ Initial Render
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.attr("width", width).attr("height", visibleHeight);

    const chartGroup = svg
      .append("g")
      .attr("class", "moveable-group")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Draw paths
    for (let i = 0; i < parsed.length - 1; i++) {
      const cur = parsed[i];
      const next = parsed[i + 1];

      categories.forEach(cat => {
        const laneX = laneScale(cat);
        const scale = individualScales[cat];

        const curVal = Math.max(cur[cat], 1);
        const nextVal = Math.max(next[cat], 1);
        const curWidth = scale(curVal);
        const nextWidth = scale(nextVal);
        const curXStart = laneX + (laneScale.bandwidth() - curWidth) / 2;
        const nextXStart = laneX + (laneScale.bandwidth() - nextWidth) / 2;

        const y0 = y(cur.date);
        const y1 = y(next.date);
        const midY = (y0 + y1) / 2;

        const path = d3.path();
        path.moveTo(curXStart, y0);
        path.bezierCurveTo(curXStart, midY, nextXStart, midY, nextXStart, y1);
        path.lineTo(nextXStart + nextWidth, y1);
        path.bezierCurveTo(
          nextXStart + nextWidth, midY,
          curXStart + curWidth, midY,
          curXStart + curWidth, y0
        );
        path.closePath();

        chartGroup
          .append("path")
          .attr("d", path.toString())
          .attr("fill", colors(cat))
          .attr("stroke", "white")
          .attr("stroke-width", 1);
      });
    }

    // Add y-axis
   // chartGroup.append("g")
    //  .call(d3.axisLeft(y).tickFormat(d3.timeFormat("%b %d")));

    // Legend
   // categories.forEach((cat, i) => {
    //  chartGroup.append("text")
     //   .attr("x", width - margin.left - margin.right + 20)
      //  .attr("y", 20 + i * 20)
       // .attr("fill", colors(cat))
        //.style("font-size", "13px")
        //.text(cat);
   // });

  }, [data]);

  // ✅ Scroll Transition Logic Only
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const group = svg.select(".moveable-group");

    const offsetPerStep = (fullHeight - visibleHeight - margin.top - margin.bottom) / 4;
    const yOffset = -currentStep * offsetPerStep;

    group
      .transition()
      .duration(600)
      .ease(d3.easeCubicInOut)
      .attr("transform", `translate(${margin.left}, ${margin.top + yOffset})`);
  }, [currentStep]);

  return (
    <div style={{ height: `${visibleHeight}px`, width: "100%", overflow: "hidden", position: "relative" }}>

<div style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      textAlign: "center",
      padding: "10px 0",
      fontWeight: "bold",
      fontSize: "18px",
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      background: "rgba(255,255,255,0.8)",
      zIndex: 2,
    }}>
      Water Quality Trends Across Major Kumbh Mela Rituals
    </div>

    <svg ref={svgRef}></svg>

    {/* Fixed Date Line with inline text */}
    <div
      style={{
        position: "absolute",
        top: `${visibleHeight / 2}px`,
        left: "0",
        width: "100%",
        display: "flex",
        alignItems: "center",
        pointerEvents: "none",
         fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
      }}
    >
      {/* Date Text */}
      <div
        style={{
          paddingLeft: "5 px",
          fontSize: "20px",
          fontWeight: "bold",
          color: "#111", // dark text
          whiteSpace: "nowrap",
          marginRight: "10px" // spacing between text and line
        }}
      >
        {targetDates[currentStep]}
      </div>

      {/* Line */}
      <div
        style={{
          width: "500px",
          height: "2px",
          backgroundColor: "#000"
        }}
      />
    </div>
  </div>
  );
};

export default VerticalFlowChart;

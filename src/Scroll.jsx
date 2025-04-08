// QuadrantChart.jsx
import * as d3 from "d3";
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

const margin = { top: 40, right: 40, bottom: 40, left: 40 };
const width = 800;
const height = 800;



export const QuadrantChart = forwardRef(({ data, onBubbleClick, currentStep }, ref) => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const circlesRef = useRef();
  const xLineRef = useRef();
  const yLineRef = useRef();
  const leftLabelRef = useRef();
  const topLabelRef = useRef();
  const bottomLabelRef = useRef();
  const rightLabelRef = useRef();

  const widthBound = width - margin.left - margin.right;
  const heightBound = height - margin.top - margin.bottom;
  const lastStepRef = useRef(currentStep);
  const selectedBubbleRef = useRef(null);

  

  useImperativeHandle(ref, () => ({
    updateVisualization(index) {
      if (lastStepRef.current === index) return;
      lastStepRef.current = index;
      updateChart(index);
      console.log("Updating visualization to step", index);
    },
  }));

  const hasRenderedRef = useRef(false);

  useEffect(() => {
    if (!data || data.length === 0 || hasRenderedRef.current) return;

   hasRenderedRef.current = true;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const tooltip = d3
      .select(tooltipRef.current)
      .style("opacity", 0)
      .attr("class", "tooltip");

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Draw quadrant axis lines and store refs
    xLineRef.current = g
      .append("line")
      .attr("x1", widthBound / 2)
      .attr("x2", widthBound / 2)
      .attr("y1", 0)
      .attr("y2", heightBound)
      .attr("stroke", "#aaa")
      .style("display", "none");

    yLineRef.current = g
      .append("line")
      .attr("x1", 0)
      .attr("x2", widthBound)
      .attr("y1", heightBound / 2)
      .attr("y2", heightBound / 2)
      .attr("stroke", "#aaa")
      .style("display", "none");

     

      leftLabelRef.current = g.append("text")
      .attr("x", 10)
      .attr("y", heightBound / 2 - 10)
      .attr("text-anchor", "start")
      .style("font-size", "12px")
      .style("fill", "#555")
      .style("display", "none")
      .text("Critique of Government");
    
    topLabelRef.current = g.append("text")
      .attr("x", widthBound / 2 + 65)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#555")
      .style("display", "none")
      .text("Environment Aligned");
    
    bottomLabelRef.current = g.append("text")
      .attr("x", widthBound / 2 + 45)
      .attr("y", heightBound - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#555")
      .style("display", "none")
      .text("Belief Aligned");

      rightLabelRef.current = g.append("text")
      .attr("x", widthBound - 10)
      .attr("y", heightBound / 2 - 10)
      .attr("text-anchor", "end")
      .style("font-size", "12px")
      .style("fill", "#555")
      .style("display", "none")
      .text("In Favour of Government");
    




    const columns = 9;
    const gridSpacing = 30;

    const circles = g
      .selectAll(".bubble")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => (i % columns) * gridSpacing)
      .attr("cy", (d, i) => Math.floor(i / columns) * gridSpacing)
      .attr("r", d => d.size || 9)
      .attr("fill", d => getColor(d))
      .attr("opacity", 0)
      .on("mouseover", (event, d) => {
        tooltip
          .style("opacity", 1)
          .html(getTooltipContent(d))
          .style("left", `${event.clientX + 10}px`)
          .style("top", `${event.clientY - 20}px`);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${event.clientX + 10}px`)
          .style("top", `${event.clientY - 20}px`);
      })
      .on("mouseout", () => tooltip.style("opacity", 0))
      .on("click", (event, d) => {
        event.stopImmediatePropagation();
        if (onBubbleClick) onBubbleClick(d);
      
        // Reset previous selected bubble style
        if (selectedBubbleRef.current) {
          selectedBubbleRef.current
            .attr("stroke", null)
            .attr("stroke-width", null)
            .attr("r", d => d.size || 9);
        }
      
        // Highlight the clicked bubble
        const current = d3.select(event.currentTarget);
        current
          .attr("stroke", "#ffba08")
          .attr("stroke-width", 3)
          .attr("r", (d) => (d.size || 9) + 4); // Slight increase for emphasis
      
        selectedBubbleRef.current = current;
      });
      

    circlesRef.current = circles;
    lastStepRef.current = currentStep;
    updateChart(currentStep);
  }, [data]);

  function updateChart(index) {
    if (!circlesRef.current) return;

    const scaleX = d3.scaleLinear().domain([-1, 1]).range([0, widthBound]);
    const scaleY = d3.scaleLinear().domain([-1, 1]).range([heightBound, 0]);

    const toCartesianX = d => {
      const gov = d.Predicted_Label_gov;
      const crit = d.Crit_Gov_Score;
      const pro = d.Pro_Gov_Score;
      if (gov === "Critical of Government") return scaleX(-crit);
      if (gov === "Pro-Government") return scaleX(pro);
      if (gov === "Neutral") return crit > pro ? scaleX(-crit) : scaleX(pro);
      return widthBound / 2;
    };

    const toCartesianY = d => {
      const label = d.Predicted_Label;
      const belief = d.Belief_Score;
      const env = d.Environment_Score;
      if (label === "Belief Aligned") return scaleY(-belief);
      if (label === "Environment Aligned") return scaleY(env);
      if (label === "Neutral") return belief > env ? scaleY(-belief) : scaleY(env);
      return heightBound / 2;
    };

    if (selectedBubbleRef.current) {
      selectedBubbleRef.current
        .attr("stroke", null)
        .attr("stroke-width", null)
        .attr("r", d => d.size || 9);
      selectedBubbleRef.current = null;
    }
    
    const columns = 9;
    const gridSpacing = 30;

    // ✅ Show/hide quadrant lines based on step
    const showGrid = index === 1 || index === 2;

    if (xLineRef.current) xLineRef.current.style("display", showGrid ? "block" : "none");
    if (yLineRef.current) yLineRef.current.style("display", showGrid ? "block" : "none");
    
    if (leftLabelRef.current) leftLabelRef.current.style("display", showGrid ? "block" : "none");
    if (topLabelRef.current) topLabelRef.current.style("display", showGrid ? "block" : "none");
    if (bottomLabelRef.current) bottomLabelRef.current.style("display", showGrid ? "block" : "none");
    if (rightLabelRef.current) rightLabelRef.current.style("display", showGrid ? "block" : "none");

    d3.select(svgRef.current).select(".contour-layer")?.remove();

    // ✅ Add contours ONLY when Cartesian view
    if (index === 1 || index === 2) {
      const cartesianData = data.filter(d => {
        if (index === 1) return d.source === "Reddit";
        if (index === 2) return d.source === "Articles";
        return false;
      });
  
      const density = d3.contourDensity()
        .x(d => toCartesianX(d))
        .y(d => toCartesianY(d))
        .size([widthBound, heightBound])
        .bandwidth(20)
        .thresholds(15);
  
      const contours = density(cartesianData);
  
      d3.select(svgRef.current)
        .select("g")
        .append("g")
        .attr("class", "contour-layer")
        .selectAll("path")
        .data(contours)
        .enter()
        .append("path")
        .attr("d", d3.geoPath())
        .attr("fill", "none")
        .attr("stroke", "#e85d04")
        .attr("stroke-width", 0.8)
        .attr("opacity", 0.6)
        .style("pointer-events", "none") // ✅ disable mouse interactions
       .lower(); // ✅ send to back;
    }
    // ✅ Update bubbles
    circlesRef.current
      .interrupt()
      .transition()
      .duration(1000)
      .attr("opacity", d => {
        if (index === 3) return 0;
        if (index === 1 && d.source === "Reddit") return 0.9;
        if (index === 2 && d.source === "Articles") return 0.9;
        if (index === 0) return 0.9;
        return 0;
      })
      .attr("cx", (d, i) => {
        if (index === 1 && d.source === "Reddit") return toCartesianX(d);
        if (index === 2 && d.source === "Articles") return toCartesianX(d);
        if (index === 0) return (i % columns) * gridSpacing;
        return 0;
      })
      .attr("cy", (d, i) => {
        if (index === 1 && d.source === "Reddit") return toCartesianY(d);
        if (index === 2 && d.source === "Articles") return toCartesianY(d);
        if (index === 0) return Math.floor(i / columns) * gridSpacing;
        return 0;
      });
  }

  return (
    <div>
      <svg ref={svgRef} width={width} height={height}></svg>
      <div ref={tooltipRef} className="tooltip hidden"></div>
    </div>
  );
});

function getColor(d) {
  const source = d.type || d.Category;
  if (source === "Reddit") return "#d00000";
  if (source === "International") return "#e85d04";
  if (source === "Indian") return "#faa307";
  return "#faa307";
}

function getTooltipContent(d) {
  return `<strong>${d.Predicted_Label} | ${d.Predicted_Label_gov}</strong><br/>`
    + `Pro-Gov: ${d.Pro_Gov_Score?.toFixed(2)} | Crit-Gov: ${d.Crit_Gov_Score?.toFixed(2)}<br/>`
    + `Environment: ${d.Environment_Score?.toFixed(2)} | Belief: ${d.Belief_Score?.toFixed(2)}<br/>`
    + `Category: ${d.type || d.Category}`;
}

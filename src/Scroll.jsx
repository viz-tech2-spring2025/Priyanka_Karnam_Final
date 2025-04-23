import * as d3 from "d3";
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

const margin = { top: 40, right: 40, bottom: 40, left: 40 };
const width = 800;
const height = 800;

export const QuadrantChart = forwardRef(({ data, onBubbleClick, currentStep }, ref) => {
  const svgRef = useRef();
  const tooltipRef = useRef(null);
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
    },
  }));

  const hasRenderedRef = useRef(false);

  useEffect(() => {
    if (!data || data.length === 0 || hasRenderedRef.current) return;

    hasRenderedRef.current = true;
    tooltipRef.current = document.getElementById("global-tooltip");

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const tooltip = d3.select(tooltipRef.current).style("opacity", 0);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

      const contourLayer = g.append("g").attr("class", "contour-layer"); // ✅ BACKGROUND
      const bubbleLayer = g.append("g").attr("class", "bubble-layer");    // ✅ FOREGROUND

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
      .text("Critique of Government Policies");

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
      .attr("x", widthBound - 60)
      .attr("y", heightBound / 2 - 10)
      .attr("text-anchor", "end")
      .style("font-size", "12px")
      .style("fill", "#555")
      .style("display", "none")
      .text("In Favour of Government");

    const columns = 13;
    const gridSpacing = 40;

    const circles = bubbleLayer
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
        if (!tooltipRef.current) return;
        const tooltip = d3.select(tooltipRef.current);
        const tooltipWidth = 220, tooltipHeight = 100;
        const pageWidth = window.innerWidth, pageHeight = window.innerHeight;
        let left = event.clientX + 10;
        let top = event.clientY - 20;

        if (left + tooltipWidth > pageWidth) left = event.clientX - tooltipWidth - 10;
        if (top + tooltipHeight > pageHeight) top = pageHeight - tooltipHeight - 10;
        if (top < 0) top = 10;

        tooltip
          .style("opacity", 1)
          .style("left", `${left}px`)
          .style("top", `${top}px`)
          .html(getTooltipContent(d));
      })
      .on("mousemove", (event) => {
        if (!tooltipRef.current) return;
        const tooltip = d3.select(tooltipRef.current);
        const tooltipWidth = 220, tooltipHeight = 100;
        const pageWidth = window.innerWidth, pageHeight = window.innerHeight;
        let left = event.clientX + 10;
        let top = event.clientY - 20;

        if (left + tooltipWidth > pageWidth) left = event.clientX - tooltipWidth - 10;
        if (top + tooltipHeight > pageHeight) top = pageHeight - tooltipHeight - 10;
        if (top < 0) top = 10;

        tooltip
          .style("left", `${left}px`)
          .style("top", `${top}px`);
      })
      .on("mouseout", () => {
        if (tooltipRef.current) {
          d3.select(tooltipRef.current).style("opacity", 0);
        }
      })
      .on("click", (event, d) => {
        event.stopImmediatePropagation();
        if (onBubbleClick) onBubbleClick(d);

        if (selectedBubbleRef.current) {
          selectedBubbleRef.current
            .attr("stroke", null)
            .attr("stroke-width", null)
            .attr("r", d => d.size || 9);
        }

        const current = d3.select(event.currentTarget);
        current
          .attr("stroke", "#ffba08")
          .attr("stroke-width", 3)
          .attr("r", (d) => (d.size || 9) + 4);

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
      const crit = d.Crit_Gov_Score ?? 0;
      const pro = d.Pro_Gov_Score ?? 0;
      if (gov === "Critical of Government") return scaleX(-crit);
      if (gov === "Pro-Government") return scaleX(pro);
      if (gov === "Neutral") return crit > pro ? scaleX(-crit) : scaleX(pro);
      return widthBound / 2;
    };

    const toCartesianY = d => {
      const label = d.Predicted_Label;
      const belief = d.Belief_Score ?? 0;
      const env = d.Environment_Score ?? 0;
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

    const showGrid = index === 15 || index === 16 || index === 17;

    xLineRef.current?.style("display", showGrid ? "block" : "none");
    yLineRef.current?.style("display", showGrid ? "block" : "none");
    leftLabelRef.current?.style("display", showGrid ? "block" : "none");
    topLabelRef.current?.style("display", showGrid ? "block" : "none");
    bottomLabelRef.current?.style("display", showGrid ? "block" : "none");
    rightLabelRef.current?.style("display", showGrid ? "block" : "none");

    d3.select(svgRef.current).select(".contour-layer").selectAll("*").remove(); // ✅ just clear paths


    if (index >= 15 && index <= 17) {
      const cartesianData = data.filter(d => {
        if (index === 15) return true;
        if (index === 16) return d.source === "Reddit";
        if (index === 17) return d.source === "Articles";
        return false;
      }).filter(d => isFinite(toCartesianX(d)) && isFinite(toCartesianY(d)));

      const density = d3.contourDensity()
        .x(d => toCartesianX(d))
        .y(d => toCartesianY(d))
        .size([widthBound, heightBound])
        .bandwidth(index === 15 ? 30 : 20)
        .thresholds(15);

      const contours = density(cartesianData);

      d3.select(svgRef.current)
        .select(".contour-layer")
       
        
        .selectAll("path")
        .data(contours)
        .enter()
        .append("path")

        .attr("d", d3.geoPath())
        .attr("fill", "#ecc8af")
        .attr("stroke", "#e85d04")
        .attr("stroke-width", 0.8)
        .attr("opacity", 0.1)
        .style("pointer-events", "none")
        .lower();
    }

    circlesRef.current
      .interrupt()
      .transition()
      .duration(1000)
      .attr("opacity", d => {
        if (index === 14 || index === 15) return 0.9;
        if (index === 16) return d.source === "Reddit" ? 0.9 : 0;
        if (index === 17) return d.source === "Articles" ? 0.9 : 0;
        return 0;
      })
      .attr("cx", (d, i) =>
        index === 14 ? (i % 13) * 40 : toCartesianX(d))
      .attr("cy", (d, i) =>
        index === 14 ? Math.floor(i / 13) * 40 : toCartesianY(d));
  }

  return (
    <div>
      <svg ref={svgRef} width={width} height={height}></svg>
    </div>
  );
});

function getColor(d) {
  const source = d.type || d.Category;
  if (source === "Reddit") return "#ff002b"; 
  if (source === "International") return "#a0001c";
  if (source === "Indian") return "#fcba04";
  return "#faa307";
}

function getTooltipContent(d) {
  const makeBar = (label, value) => {
    const width = Math.min(100, value * 100);
    return `
      <div style="margin-bottom: 8px;">
        <div style="font-weight: 500; font-size: 12px; color: #e0e0e0;">${label}</div>
        <div style="background: #e0e0e0; height: 6px; border-radius: 4px; width: 100%;">
          <div style="width: ${width}%; background: #9d0208; height: 6px; border-radius: 4px;"></div>
        </div>
        <div style="font-size: 11px; color: #777;">Score: ${value?.toFixed(2)}</div>
      </div>`;
  };

  return `
    <div style="line-height:1.4;">
      <strong style="font-size: 14px;">${d.Predicted_Label} | ${d.Predicted_Label_gov}</strong><br/><br/>
      ${makeBar("Pro-Gov", d.Pro_Gov_Score)}
      ${makeBar("Crit-Gov", d.Crit_Gov_Score)}
      ${makeBar("Environment", d.Environment_Score)}
      ${makeBar("Belief", d.Belief_Score)}
      <br/>
      <strong>Category:</strong> ${d.type || d.Category}
    </div>`;
}

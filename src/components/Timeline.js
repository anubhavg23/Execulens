import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const Timeline = ({ stackData }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr("width", "100%")
      .attr("height", "500px");

    // Create scales and axis
    const x = d3.scaleLinear()
      .domain([0, stackData.length - 1])
      .range([0, 800]);

    const y = d3.scaleBand()
      .domain(d3.range(stackData.length))
      .range([0, 500])
      .padding(0.1);

    // Create rectangles to represent stack frames
    svg.selectAll("rect")
      .data(stackData)
      .join("rect")
      .attr("x", (d, i) => x(i))
      .attr("y", (d, i) => y(i))
      .attr("width", (d, i) => x(i + 1) - x(i))
      .attr("height", y.bandwidth())
      .attr("fill", "steelblue");

    // Add labels
    svg.selectAll("text")
      .data(stackData)
      .join("text")
      .attr("x", (d, i) => x(i) + 10)
      .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
      .attr("dy", ".35em")
      .attr("fill", "white")
      .text(d => d.name);
  }, [stackData]);

  return <svg ref={svgRef}></svg>;
};

export default Timeline;

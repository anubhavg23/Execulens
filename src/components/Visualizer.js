// src/components/Visualizer.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function Visualizer({ executionState }) {
  const svgRef = useRef();
  const margin = { top: 20, right: 30, bottom: 40, left: 60 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  useEffect(() => {
    if (!executionState.steps.length) return;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Clear previous visualization
    svg.selectAll('*').remove();

    // Create scales
    const x = d3.scaleLinear()
      .domain([0, executionState.steps.length - 1])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(executionState.steps, d => d.callStackDepth || 1) * 1.5])
      .range([height, 0]);

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(executionState.steps.length));

    svg.append('g')
      .call(d3.axisLeft(y));

    // Draw the execution path
    const line = d3.line()
      .x((d, i) => x(i))
      .y(d => y(d.callStackDepth || 0))
      .curve(d3.curveBasis);

    svg.append('path')
      .datum(executionState.steps)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add variable value indicators
    executionState.steps.forEach((step, i) => {
      if (step.variables) {
        Object.entries(step.variables).forEach(([name, value]) => {
          svg.append('circle')
            .attr('cx', x(i))
            .attr('cy', y(step.callStackDepth || 0))
            .attr('r', 5)
            .attr('fill', '#ff7f0e')
            .append('title')
            .text(`${name} = ${value}`);
        });
      }
    });

    // Highlight current step
    if (executionState.currentStep !== undefined) {
      svg.append('circle')
        .attr('cx', x(executionState.currentStep))
        .attr('cy', y(executionState.steps[executionState.currentStep].callStackDepth || 0))
        .attr('r', 8)
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr('stroke-width', 2);
    }

    // Add function call blocks
    executionState.steps.forEach((step, i) => {
      if (step.functionCall) {
        svg.append('rect')
          .attr('x', x(i) - 15)
          .attr('y', y(step.callStackDepth || 0) - 10)
          .attr('width', 30)
          .attr('height', 20)
          .attr('fill', '#2ca02c')
          .append('title')
          .text(`Call: ${step.functionCall}`);
      }
    });

    // Animation for the current execution point
    const currentStep = executionState.currentStep;
    if (currentStep !== undefined) {
      const pulse = svg.append('circle')
        .attr('cx', x(currentStep))
        .attr('cy', y(executionState.steps[currentStep].callStackDepth || 0))
        .attr('r', 10)
        .attr('fill', 'red')
        .attr('opacity', 0.7);

      (function repeat() {
        pulse.transition()
          .attr('r', 15)
          .attr('opacity', 0.3)
          .duration(1000)
          .transition()
          .attr('r', 10)
          .attr('opacity', 0.7)
          .duration(1000)
          .on('end', repeat);
      })();
    }

  }, [executionState]);

  return (
    <div className="visualizer-container">
      <h3>Execution Timeline</h3>
      <svg ref={svgRef}></svg>
    </div>
  );
}
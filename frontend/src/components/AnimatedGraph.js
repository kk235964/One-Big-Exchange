import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { socket } from '../sockets/socket';

const AnimatedGraph = () => {
    const svgRef = useRef();
    const data = [
        { count: 3, symbol: 'AAPL' },
        { count: 5, symbol: 'GOOGL' },
        { count: 10, symbol: 'MSFT' },
        { count: 6, symbol: 'AMZN' },
        { count: 8, symbol: 'TSLA' },
        { count: 3, symbol: 'FB' },
    ];

    useEffect(() => {
        const svg = d3.select(svgRef.current)
            .attr('width', '100%')
            .attr('height', '500px');

        const margin = { top: 20, right: 30, bottom: 40, left: 40 };
        const width = svg.node().getBoundingClientRect().width - margin.left - margin.right;
        const height = svg.node().getBoundingClientRect().height - margin.top - margin.bottom;

        // Clear previous elements
        svg.selectAll('*').remove();

        // Scales
        const x = d3.scalePoint()
            .domain(data.map(d => d.symbol)) // Use symbols for x-axis
            .range([margin.left, width - margin.right])
            .padding(0.5);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)]) // Use counts for y-axis
            .range([height - margin.bottom, margin.top]);

        // Line generator
        const line = d3.line()
            .x(d => x(d.symbol))
            .y(d => y(d.count))
            .curve(d3.curveCatmullRom);

        // Append axes
        svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .attr('class', 'text-sm text-gray-700'); // Tailwind styles

        svg.append('g')
            .attr('class', 'y-axis')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .selectAll('text')
            .attr('class', 'text-sm text-gray-700'); // Tailwind styles

        // Append line path
        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#4f46e5') // Tailwind indigo-600
            .attr('stroke-width', 2)
            .attr('d', line)
            .style('opacity', 0)
            .transition()
            .duration(1000)
            .style('opacity', 1);

        // Append points and labels
        svg.selectAll('.dot')
            .data(data)
            .enter().append('circle')
            .attr('class', 'dot')
            .attr('cx', d => x(d.symbol))
            .attr('cy', d => y(d.count))
            .attr('r', 5)
            .attr('fill', '#9333ea') // Tailwind purple-600
            .style('opacity', 0)
            .transition()
            .duration(1000)
            .style('opacity', 1);

        svg.selectAll('.label')
            .data(data)
            .enter().append('text')
            .attr('class', 'label text-xs text-gray-700') // Tailwind styles
            .attr('x', d => x(d.symbol))
            .attr('y', d => y(d.count) - 10)
            .attr('text-anchor', 'middle')
            .text(d => d.symbol)
            .style('opacity', 0)
            .transition()
            .duration(1000)
            .style('opacity', 1);
    }, [data]);

    socket.off('dataCounts');

    return (
        <div className="graph-container p-4">
            <svg ref={svgRef} className="w-full h-auto"></svg>
        </div>
    );
};

export default AnimatedGraph;

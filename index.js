// select svg container
const svg = d3.select('svg');

// grab data
d3.json('planets.json').then(data => {
    const circles = svg.selectAll('circle')
        .data(data)

    // we need an 'enter' call to update existing elements in the DOM,
    // this should prevent overlaying data
    circles
        .attr('cy', 200)
        .attr('cx', d => d.distance)
        .attr('r', d => d.radius)
        .attr('fill', d => d.fill)

    // Now Append Remaining elements
    circles
        .enter()
        .append('circle')
        .attr('cy', 200)
        .attr('cx', d => d.distance)
        .attr('r', d => d.radius)
        .attr('fill', d => d.fill)
})

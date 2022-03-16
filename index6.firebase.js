


// select svg container
const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', 600)
    .attr('height', 600);

// Margins and Dimensions
const margin = { top: 20, right: 20, bottom: 100, left: 100 };
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

// Create Graph Group
const graph = svg.append('g')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate (${margin.left}, ${margin.top})`); // center graph

// Axes are generated from data below, but declared here
const xAxisGroup = graph.append('g')
    .attr('transform', `translate(0,${graphHeight})`); // Move group to bottom 
const yAxisGroup = graph.append('g');


// Retrive data from FireStore 
db.collection('dishes').get().then(res => {

    var data = []

    res.docs.forEach(doc => {
        data.push(doc.data())
    });


    // d3 min/max/extent 
    const min = d3.min(data, d => d.orders)  // returns minimum
    const max = d3.max(data, d => d.orders)  // returns maximum
    const extent = d3.extent(data, d => d.orders)  // array [min,max]
    //console.log(extent, min, max)

    // veritical scale
    const yScale = d3.scaleLinear()
        .domain([0, max])
        .range([graphHeight, 0]); // Reveresed for Y Top Starting Offset

    // horizontal scale
    const xScale = d3.scaleBand()
        .domain(data.map(item => item.name)) //array of property \
        .range([0, 500])
        .paddingInner(0.1)
        .paddingOuter(0.1)

    // array passed into domain method above:
    // console.log(data.map(item => item.name))

    // join data to rectangles
    const rects = graph.selectAll('rect')
        .data(data)

    // we need an 'enter' call to update existing elements in the DOM,
    // this should prevent overlaying data
    rects
        .attr('width', xScale.bandwidth) // ref to method
        .attr('height', d => graphHeight - yScale(d.orders)) // for Y-Top Starting Offset
        .attr('x', d => xScale(d.name))
        .attr('y', d => yScale(d.orders))
        .attr('fill', 'orange')

    // Now Append Remaining elements
    rects
        .enter()
        .append('rect')
        .attr('width', xScale.bandwidth) // ref to method 
        .attr('height', d => graphHeight - yScale(d.orders)) // for Y-Top Starting Offset
        .attr('x', d => xScale(d.name))
        .attr('y', d => yScale(d.orders))
        .attr('fill', 'orange')

    // Create and call Axes
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)
        .ticks(3)  // Set Viewable Ticks
        .tickFormat(d => d + ' orders')


    xAxisGroup.call(xAxis); // Add X axis 
    yAxisGroup.call(yAxis); // Add Y axis

    // Rotate XAxis Elements - set anchor
    xAxisGroup.selectAll('text')
        .attr('transform', 'rotate(-40)')
        .attr('text-anchor', 'end') // start|middle|end
        .attr('fill', '#121212')
})

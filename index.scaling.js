// select svg container
const svg = d3.select('svg');

// grab data
d3.json('menu.json').then(data => {

    // d3 min/max/extent 
    const min = d3.min(data, d => d.orders)
    const max = d3.max(data, d => d.orders)
    const extent = d3.extent(data, d => d.orders)
    //console.log(extent, min, max)

    // veritical scale
    const yScale = d3.scaleLinear()
        .domain([0, max])
        .range([0, 500]);

    // horizontal scale
    const xScale = d3.scaleBand()
        .domain(data.map(item => item.name)) //array of property \
        .range([0, 500])
        .paddingInner(0.1)
        .paddingOuter(0.1)

    // array passed into domain method above:
    // console.log(data.map(item => item.name))

    // join data to rectangles
    const rects = svg.selectAll('rect')
        .data(data)

    // we need an 'enter' call to update existing elements in the DOM,
    // this should prevent overlaying data
    rects
        .attr('width', xScale.bandwidth) // ref to method
        .attr('height', d => yScale(d.orders))
        .attr('x', d => xScale(d.name))
        .attr('fill', 'orange')

    // Now Append Remaining elements
    rects
        .enter()
        .append('rect')
        .attr('width', xScale.bandwidth) // ref to method 
        .attr('height', d => yScale(d.orders))
        .attr('x', d => xScale(d.name))
        .attr('fill', 'orange')
})

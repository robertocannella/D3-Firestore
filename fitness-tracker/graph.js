// Margins + Dimensions
const margin = { top: 40, right: 20, bottom: 50, left: 100 };

// graph attributes (not svg)
const graphWidth = 560 - margin.left - margin.right; // svg container width
const graphHeight = 400 - margin.top - margin.bottom;
const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', graphWidth + margin.left + margin.right)
    .attr('height', graphHeight + margin.left + margin.right)
const graph = svg.append('g')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.left},${margin.top})`)


// Time & Linear Scales & Axes
// X coordinates based on time scale. DOMAIN: earliest date, latest data / RANGE 0, graphWidth 
// Y coordinates based on linear scale. DOMAIN:  0, maxDistance / RANGE  graphHeight, 0

const xScale = d3.scaleTime().range([0, graphWidth]); // Range Takes An Array!
const yScale = d3.scaleLinear().range([graphHeight, 0]); //domains are setup in the update function
const xAxisGroup = graph.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${graphHeight})`) // origin of axis is on top, translate to bottom
const yAxisGroup = graph.append('g')
    .attr('class', 'y-axis')




const update = (data) => {
    // filter out irrelevant data
    data = data.filter(item => item.activity == activity)  // keep true

    // set scale domains
    xScale.domain(d3.extent(data, d => new Date(d.date))); // returns earliest and latest date
    yScale.domain([0, d3.max(data, d => d.distance)]); // returns 0 and longest distance

    // create points for
    const circles = graph.selectAll('circle')
        .data(data)

    // address existing points
    circles
        .attr('cx', d => xScale(new Date(d.date))) // use date a X coord
        .attr('cy', d => yScale(d.distance))  // use distance

    // add new points 
    circles.enter()
        .append('circle')
        .attr('r', 4)
        .attr('cx', d => xScale(new Date(d.date))) // use date a X coord
        .attr('cy', d => yScale(d.distance))  // use distance
        .attr('fill', '#CCC')

    // remove 
    circles.exit().remove();

    // create the axes
    const xAxis = d3.axisBottom(xScale)
        .ticks(4)
        .tickFormat(d3.timeFormat('%b %d'));
    const yAxis = d3.axisLeft(yScale)
        .ticks(4)
        .tickFormat(d => d + 'm');


    // call the axes
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);


    //rotate X axis group
    xAxisGroup.selectAll('text')
        .attr('transform', `rotate(-40)`)
        .attr('text-anchor', 'end');



}
// data and firestore

var data = [];

db.collection('activities').onSnapshot(res => {
    res.docChanges().forEach(change => {
        const doc = { ...change.doc.data(), id: change.doc.id } // create new object with ID field from firestore

        switch (change.type) {
            case 'added':
                data.push(doc)
                break;
            case 'modified':
                const index = data.findIndex((item) => item.id == doc.id) // get the item from data []
                data[index] = doc; // overwrite old element with the modified one
                break;
            case 'removed':
                data = data.filter((item) => item.id !== doc.id) // filter out the removed element as new array
                break;
            default: // default case required
                break;
        }
    });
    update(data);
});

// 

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

// d3 min/max/extent 
// const min = d3.min(data, d => d.orders)  // returns minimum
// const max = d3.max(data, d => d.orders)  // returns maximum
// const extent = d3.extent(data, d => d.orders)  // array [min,max]
// console.log(extent, min, max)

// veritical scale (domain updated in update function)
const yScale = d3.scaleLinear()
    .range([graphHeight, 0]); // Reveresed for Y Top Starting Offset

// horizontal scale (domain updated in update function)
const xScale = d3.scaleBand()
    .range([0, 500])
    .paddingInner(0.1)
    .paddingOuter(0.1)
// Create axes

const xAxis = d3.axisBottom(xScale)
const yAxis = d3.axisLeft(yScale)
    .ticks(3)  // Set Viewable Ticks
    .tickFormat(d => d + ' orders')

// Rotate XAxis Elements - set anchor
xAxisGroup.selectAll('text')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end') // start|middle|end
    .attr('fill', '#121212')

// ******************  UPDATE 
const update = (data) => {

    // Update any scales or domains reliant on the data
    yScale.domain([0, d3.max(data, d => d.orders)])
    xScale.domain(data.map(item => item.name)) // maps property to array
    // array passed into domain method above:
    // console.log(data.map(item => item.name))

    // Join Updated data to the elements
    const rects = graph.selectAll('rect')
        .data(data)

    // Remove All __exit__ items (if they exist)
    rects.exit().remove()

    // Update current shapes in the DOM
    // we need an 'enter' call to update existing elements in the DOM, (this is empty the first time update runs)
    // this should prevent overlaying data
    // - update current attributes here.
    rects
        .attr('width', xScale.bandwidth) // ref to method
        .attr('x', d => xScale(d.name))
        .attr('fill', 'orange')
        .transition().duration(yScale(200))
        .attr('height', d => graphHeight - yScale(d.orders)) // for Y-Top Starting Offset
        .attr('y', d => yScale(d.orders))


    // Now Append Remaining elements from __enter__
    // Apply Transition to __enter__ objects
    rects
        .enter()
        .append('rect')
        .attr('width', xScale.bandwidth) // ref to method (exclude ())
        .attr('y', graphHeight) // starting value
        .attr('height', 0) // starting value
        .attr('x', d => xScale(d.name))
        .attr('fill', 'orange')
        //ENDING Values
        .transition()
        .duration(yScale(200)) // apply scale to balace short/long bars
        .delay((d, i, n) => i * 300)
        .attr('y', d => yScale(d.orders))
        .attr('height', d => graphHeight - yScale(d.orders)) // for Y-Top Starting Offset

    // Call Axes
    xAxisGroup.call(xAxis); // Add X axis 
    yAxisGroup.call(yAxis); // Add Y axis

}
var data = [];

// Retrieve data from FireStore 
db.collection('dishes').onSnapshot((res) => {

    res.docChanges().forEach((change) => { // on change
        const doc = { ...change.doc.data(), id: change.doc.id } // create new object with id from firestore
        //console.log(doc)
        //console.log(change.type) // log change type (used for switch case below)
        //console.log(change.doc.data())  // access document from reference

        // logic to manipulate data array
        switch (change.type) {
            case 'added':
                data.push(doc)
                break;
            case 'modified':
                const index = data.findIndex((item) => item.id == doc.id) // get the item from data []
                data[index] = doc; // overwrite old element with the modified one
                break;
            case 'removed':
                data = data.filter((item) => item.id != doc.id) // filter out the removed element as new array
                break;
            default: // default case required
                break;
        }

    })
    update(data)
})


// Transition Logic

// Starting Bar Values
// Y = graphHeight
// height = 0

// Ending Bar Values
// Y = y(d.orders)
// height = graphHeigth - y(d.orders)
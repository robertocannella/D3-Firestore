const dims = { height: 300, width: 300, radius: 150 };
const cent = { x: (dims.width / 2 + 5), y: (dims.height / 2 + 5) };
const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', dims.width + 150)  // add space for legend
    .attr('height', dims.height + 150); // add space for potential use

const graph = svg.append('g')
    .attr('transform', `translate(${cent.x},${cent.y})`)

// pie generator
const pie = d3.pie()
    .sort(null)
    .value(d => d.cost)

// feed pie data into arc generator
const arcPath = d3.arc()
    .outerRadius(dims.radius) // radius of the pie chart
    .innerRadius(dims.radius / 2)

// ordinal scale
const colorScale = d3.scaleOrdinal(d3['schemeSet3']) // output range

// UPDATE
const update = (data) => {
    // update color scale domain
    colorScale.domain(data.map(item => item.name))  // generate an array to pass into domain


    // join enhance (pie) data to path elements
    const paths = graph.selectAll('path')
        .data(pie(data)) // pass data into pie generator

    paths
        .attr('class', 'arc')
        .attr('d', arcPath) //  generate string as path 
        .attr('stroke', '#FFF')
        .attr('stroke-width', '3px')
        .attr('fill', d => colorScale(d.data.name))

    paths.enter()
        .append('path')
        .attr('class', 'arc')
        .attr('d', arcPath) //  generate string as path 
        .attr('stroke', '#FFF')
        .attr('stroke-width', '3px')
        .attr('fill', d => colorScale(d.data.name))

    paths.exit().remove()

}

// data array / firestore
var data = []
db.collection('expenses').onSnapshot(res => {

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
})
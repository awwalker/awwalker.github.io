var svg1 = d3.select("#graph").append("svg")
    .attr("height", 600)
    .attr("width", 1000),
    margin = {top: 20, right: 80, bottom: 30, left: 50},
    width1 =  1000 - margin.left - margin.right , // +svg.attr("width") -
    height1 =  600 - margin.top - margin.bottom, // +svg.attr("height") -
    g1 = svg1.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x1 = d3.scaleTime().range([0, width1]),
    y1 = d3.scaleLinear().range([height1, 0]),
    z1 = d3.scaleOrdinal(d3.schemeCategory10);

var parseTime = d3.timeParse("%Y");

var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) {  return x1(d.year); })
    .y(function(d) {  return y1(d.cost); });

d3.csv("/assets/data/nyu_vs_others.csv", type, function(error, data) {
    if (error) throw error;

    var schools = data.columns.slice(1).map(function(id) {
        return {
            id: id,
            values: data.map(function(d) {
                return {year: d.year, cost: d[id]}
            })
        };
    });

    x1.domain(d3.extent(data, function(d) { return d.year; }));

    y1.domain([
        d3.min(schools, function(s) { return d3.min(s.values, function(d) { return d.cost; }) }),
        d3.max(schools, function(s) { return d3.max(s.values, function(d) { return d.cost;}) })
    ]);
    
    z1.domain(schools.map(function(s) { return s.id;  }));
    
    g1.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height1 + ")")
        .call(d3.axisBottom(x1));
    
    g1.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y1))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("Cost, $");
    
    var school = g1.selectAll(".school")
        .data(schools)
        .enter().append("g")
        .attr("class", "school");
    
    school.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return z1(d.id); });
    
    school.append("text")
        .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]};})
        .attr("transform", function(d) { return "translate(" + x1(d.value.year) + "," + y1(d.value.cost) + ")"; })
        .attr("x", 3)
        .attr("dy", "0.35em")
        .style("font", "10px sans-serif")
        .text(function(d) { return d.id; });
});

function type(d, _, columns) {
    d.year = parseTime(d.year);
    for(var i=1, n = columns.length, c; i < n; ++i) d[c=columns[i]] = +d[c];
    return d;
}

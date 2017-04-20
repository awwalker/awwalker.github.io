var svg = d3.select("#chart").append("svg")
    .attr("width", 500)
    .attr("height", 1000),
    margin = {top: 20, right: 80, bottom: 30, left: 50},
    width =  500 - margin.left - margin.right; // +svg.attr("width") -
    height =  1000 - margin.top - margin.bottom; // +svg.attr("height") -
    radius = Math.min(width, height) / 2;
    g = svg.append("g")
        .attr("transform", "translate(" + 500/2 + "," + 1000/ 2 + ")");

var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.amount; });

var path = d3.arc().outerRadius(radius - 10).innerRadius(0);

var label = d3.arc().outerRadius(radius - 40).innerRadius(radius - 40);

d3.csv("/assets/data/nyu.csv", function(d) {
    d.amount = +d.amount;
    return d;
}, function(error, data) {
    if (error) throw error;

    var arc = g.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
            .attr("class", "arc");
    
    arc.append("path")
        .attr("d", path)
        .attr("fill", function(d) { return color(d.data.amount); });

    arc.append("text")
        .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")" + "rotate(90)"; })
        .attr("dy", "0.35em")
        .text(function(d) { return d.data.fee+ "\n" +d.data.amount; });
});

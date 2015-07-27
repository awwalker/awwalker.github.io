var width = 700,
height = 700,
outerRadius = Math.min(width, height) / 2 - 10,
innerRadius = outerRadius - 24,
centered
;

var arc = d3.svg.arc()
	.innerRadius(innerRadius)
	.outerRadius(outerRadius);

var layout = d3.layout.chord()
	.padding(.04)
	.sortSubgroups(d3.descending)
	.sortChords(d3.ascending);

var path = d3.svg.chord()
	.radius(innerRadius);

var colors = [ "#FBEBC1", "#FFFF66", "#FFA32F", "#FF4500", "#EB194A",
				"#4E0178", "#3D52C4", "#20ADA3", "#00924C", "#000000",
				"#12F6E9", "#1FDA9A", "#BD0102", "#1253A4", "#003058",
				"#D40E52", "#FF5A09"];

var svg = d3.select("#diagram").append("svg")
	.attr("width", width)
	.attr("height", height)
	.append("g")
	.attr("id", "circle")
	.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")" );

svg.append("circle")
	.attr("r", outerRadius);

d3.json("stations.json", function(error, stations){
	d3.json("data.json", function(error, matrix){

		layout.matrix(matrix);

		var group = svg.selectAll(".group")
			.data(layout.groups)
			.enter().append("g")
			.attr("class", "group")
			.on("mouseover", mouseover);

		group.append("title").text(function(d,i){
			return stations[i];
		});

		var groupPath = group.append("path")
			.attr("id", function(d, i){ return "group" + i; })
			.attr("d", arc)
			.style("fill", function(d, i){return colors[[d.index]]; });

		var groupText = group.append("text")
			.attr("x", 6)
			.attr("dy", 15);

		groupText.append("textPath")
			.attr("xlink:href", function(d, i){return "#group" + i; })
			.text(function(d, i){ return stations[i]; })
			.attr("font-size", "9.5px")
			.attr("font-weight", "bold");

		groupText.filter(function(d, i){
			return groupPath[0][i].getTotalLength() / 2 - 16 < 
			this.getComputedTextLength(); })
				.remove();

		var chord = svg.selectAll(".chord")
			.data(layout.chords)
			.enter().append("path")
			.attr("class", "chord")
			.style('fill', function(d, i){return colors[[d.source.index]]; })
			.attr("d", path)
			.style("opacity", 1);

		chord.append("title").text(function(d, i){
			return stations[d.source.index] 
				+ " ->" + stations[d.target.index]
				+ ": " + matrix[d.source.index][d.target.index] + " trips"
				+ "\n" + stations[d.target.index]
				+ "->" + stations[d.source.index] 
				+ ": " + matrix[d.target.index][d.source.index] + " trips";
		});

		function mouseover(d, i){
			chord.classed("fade", function(p) {
				return p.source.index != i && p.target.index != i;
			});
		};
	});

});


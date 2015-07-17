var width = 960,
	height = 500,
	centered;
var route_diff_sport = new Array("<=5.6", "5.7", "5.8", "5.9", "5.10", "5.11", "5.12", "5.13", ">=5.14");
var route_diff_boulder = new Array("<=V1", "V2-3", "V4-5", "V6-7", "V8-9", "V10-11", "V12-13", ">=V14");				

/**********
	ZOOM
***********/
function zoom(){ 
  	g.transition()
    .duration(750)
    .attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");

};
/***********
	SETUP
************/
var projection = d3.geo.albersUsa()
	.scale(1000)
	.translate([width/2, height / 2]);

var path = d3.geo.path()
	.projection(projection);

var svg = d3.select("#map").append("svg")
	.attr("width",width)
	.attr("height",height)
	.append("g")
	.call(d3.behavior.zoom().scaleExtent([1,8]).on("zoom", zoom))
	.append('g');

svg.append("rect")
	.attr("class", "background")
	.attr("width", width)
	.attr("height", height);

var g = svg.append("g");

//different groups of items on the map

var stateGroup = g.append('g');
var arcGroup = g.append("g");
var pointGroup = g.append("g");

/*******************
		TOOLTIP
********************/
var tooltip = d3.select("body")
	.append("div")
	.attr("class", "tooltip")
	.style("position","absolute")
	.style("z-index", "10")
	.style("visibility", "hidden");

var tooltip_title = tooltip.append("div")
		.text("Crag")

//tooltip svg and bar chart
var tw = 300, 
	th = 120,
	number_height = 15,
	bh = th - number_height,
	pad = 4,
	bw_sport = (tw - 1.5 * pad)/10
	bw_boulder = (tw - 1.5 * pad) / 8.7;

barchart_boulder = tooltip.append("div").append("svg")
		.attr("width", tw)
		.attr("height", th);

barchart_sport = tooltip.append("div").append("svg")
		.attr("width", tw)
		.attr("height", th);

//bar chart bars
var x_sport = d3.scale.ordinal()
		.domain(route_diff_sport)
		.rangeRoundBands([0, tw]);
var x_boulder = d3.scale.ordinal()
		.domain(route_diff_boulder)
		.rangeRoundBands([0, tw]);

var xAxis_sport = d3.svg.axis()
	.scale(x_sport)
	.orient("bottom")
	.tickSize(0,0);
var xAxis_boulder = d3.svg.axis()
	.scale(x_boulder)
	.orient("bottom")
	.tickSize(0,0);
/*******************
	SPORT CHART
********************/
var bars_sport = new Array();
for (var i = 0; i < 9; i++){
		bars_sport[i] = barchart_sport.append("g")
		.attr("class", "bar_sport");

		bars_sport[i].append("rect")
			.attr("class", route_diff_sport[i])
			.attr("x", pad * i + bw_sport * i)
			.attr("width", bw_sport)
			.attr("y", 18)
			.attr("height", 0);

		bars_sport[i].append("text")
			.text(0)
			.attr("x", pad * i + bw_sport * i + bw_sport/2)
			.attr("y", th - 5);
}
/*******************
	BOULDER CHART
********************/
var bars_boulder = new Array();
for(var i = 0; i < 8; i++){
		bars_boulder[i] = barchart_boulder.append("g")
		.attr("class", "bar_boulder");

		bars_boulder[i].append("rect")
			.attr("class", route_diff_boulder[i])
			.attr("x", pad * i + bw_boulder * i )
			.attr("width", bw_boulder)
			.attr("y", 18)
			.attr("height", 0);

		bars_boulder[i].append("text")
			.text(0)
			.attr("x", pad * i + bw_boulder * i + bw_boulder/2)
			.attr("y", th - 5);
}

//draw skeleton map
d3.json("../../data/us.json", function(error, us){
	if(error) throw error;

	 d3.select("#Loading")
	.style("display","none")
	//use stateGroup in 'g' to draw states
	stateGroup.append("g")
		.attr("id", "states")
		.selectAll("path")
		.data(topojson.feature(us, us.objects.states).features)
		.enter()
		.append('path')
		.attr("d", path);

	stateGroup.append('path')
		.datum(topojson.mesh(us, us.objects.states, function(a,b){return a !== b; }))
		.attr("id", "state-borders")
		.attr('d', path);

//read in the crag data created through python
	d3.json("../../data/crags_info.json", function(error, data){
		var countyName = {};
		var counts = [ {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {} ]
/********************
	PATH ANIMATION
*********************/
		// helper function for path
		var lineTransition = function lineTransition(path){
			path.transition()
				.duration(9500)
				.attrTween("stroke-dasharray", tweenDash)
				//useful function for stuff to do when line reaches from 'A' to 'B'
		};
		var tweenDash = function tweenDash(){
			var len = this.getTotalLength(),
				interpolate = d3.interpolateString("0," + len, len + "," + len);
			return function(t){return interpolate(t);};
		};

/*********************
	POINT CREATION
**********************/

		//create points on the map using pointGroup in 'g'
		var coordinates_point = projection([null, null]);
		//for path
		var links = [];
		for(var i = 0; i < 50; i++){
			coordinates_point = projection([data[i.toString()]["Longitude"], data[i.toString()]["Latitude"]]);
			
			cragName = data[i]["Name"];

			pointGroup.append("circle")
			.attr("cx", coordinates_point[0])
			.attr("cy", coordinates_point[1])
			.attr("r", 5)
			.attr("id", function(){
				return cragName;
			})
			.style("stroke-dasharray", ("1,2"))
			.style("stroke", "red")
			.style("fill-opacity", .6)
			.style("stroke-linecap", "round")
			.style("fill", "purple");

			
			counts[0][cragName] = data[i]["Routes"]["<=5.6"];
			counts[1][cragName] = data[i]["Routes"]["5.7"];
			counts[2][cragName] = data[i]["Routes"]["5.8"];
			counts[3][cragName] = data[i]["Routes"]["5.9"];
			counts[4][cragName] = data[i]["Routes"]["5.10"];
			counts[5][cragName] = data[i]["Routes"]["5.11"];
			counts[6][cragName] = data[i]["Routes"]["5.12"];
			counts[7][cragName] = data[i]["Routes"]["5.13"];
			counts[8][cragName] = data[i]["Routes"][">=5.14"];
			counts[9][cragName] = data[i]["Routes"]["<=V1"];
			counts[10][cragName] = data[i]["Routes"]["V2-3"];
			counts[11][cragName] = data[i]["Routes"]["V4-5"];
			counts[12][cragName] = data[i]["Routes"]["V6-7"];
			counts[13][cragName] = data[i]["Routes"]["V8-9"];
			counts[14][cragName] = data[i]["Routes"]["V10-11"];
			counts[15][cragName] = data[i]["Routes"]["V12-13"];
			counts[16][cragName] = data[i]["Routes"][">=V14"];
		//want to get lines between all fifty need to catch the index out of bounds error
			try{
				links.push({
					type: "LineString", 
					coordinates: [
						[ data["Best Route"][i][2], data["Best Route"][i][1] ],
						[ data["Best Route"][i+1][2], data["Best Route"][i+1][1] ]
					] 
				});
			}
			catch(err){
				links.push({
					type: "LineString", 
					coordinates: [
						[ data["Best Route"][0][2], data["Best Route"][0][1] ],
						[ data["Best Route"][49][2], data["Best Route"][49][1] ]
					] 
				});
			}
		}
/*********************
	PATH CREATION
*********************/
		var pathArcs = arcGroup.selectAll(".arc")
			.data(links);

		pathArcs.enter()
			.append('path').attr({
				'class': 'arc'
			}).style({
				fill: 'none',
			});
		
		pathArcs.attr({
				d: path
		})
			.style({
			 	stroke: '#000000',
				'stroke-width':'2px'
		})
		.call(lineTransition);

		pathArcs.exit().remove();

/************************
	MOUSEOVER ACTIONS
*************************/
		var crag = svg.select("g").selectAll("circle");

		crag.on("mouseover", function(){
			var selected_crag = d3.select(this)
				.style("stroke", "yellow")
				tooltip_title.text(selected_crag.attr("id"))
				tooltip.style("visibility", "visible");

			for(var i = 0; i < 9; i++){
					bars_sport[i].selectAll("rect").transition()
						.attr("y", th - counts[i][selected_crag.attr("id")] )
						.attr("height", (counts[i][selected_crag.attr("id")]));
					bars_sport[i].selectAll('text').transition()
						.attr("y", th - (counts[i][selected_crag.attr("id")])/7)
						.text(counts[i][selected_crag.attr("id")])
						.attr("dy", "-.75");
			}
			for(var i = 0; i < 8; i++){
				bars_boulder[i].selectAll("rect").transition()
						.attr("y", th - counts[i+9][selected_crag.attr("id")] )
						.attr("height", (counts[i+9][selected_crag.attr("id")]));
				bars_boulder[i].selectAll('text').transition()
						
						.attr("y",  th - (counts[i+9][selected_crag.attr("id")])/7)
						.text(counts[i+9][selected_crag.attr("id")])
						.attr("dy", "-.75");
			}
		})
		.on("mousemove", function(){
				tooltip.style("top", (d3.mouse(this)[1] - 20) + "px")
						.style("left", (d3.mouse(this)[0] + 20 + "px"))

		;})
		.on("mouseout", function(){
			d3.select(this).style("stroke", 'red')
			tooltip.style("visibility", "hidden");
		});
/*********************
	FINALIZE CHARTS
**********************/
		barchart_sport.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + (0) + ")" )
			.attr("dy", ".75em")
			.call(xAxis_sport);
		barchart_boulder.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + (0) + ")" )
			.attr("dy", ".75em")
			.call(xAxis_boulder);
	});

});



// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//  reading the cvs file
d3.csv("assets/data/data.csv")
  .then(function(staData) {
    
    staData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
     });

    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(staData, d => d.poverty)*0.8, d3.max(staData, d => d.poverty)+ 2.1])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(staData, d => d.healthcare)*0.8, d3.max(staData, d => d.healthcare)+ 2.1])
      .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);
    //  appending the circle
    var circlesGroup = chartGroup.selectAll("circle")
    .data(staData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .style("fill", "green")
    .attr("opacity", ".3")
    .classed("stateCircle",true);
    // appendind text inside the circle

    chartGroup.selectAll()
    .data(staData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .text(d => d.abbr)
    .classed("stateText",true)
    .style("fill", "black")
    .attr("font-size", "8px")
    ;
    
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty %: ${d.poverty}<br>No Insurance %: ${d.healthcare}`);
      });
    circlesGroup.call(toolTip);

        circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 20)
      .attr("x", 0 - (height / 1.3))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("% Lacking Health Insurance");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 35})`)
      .attr("class", "axisText")
      .text("% of All in Poverty");
  });
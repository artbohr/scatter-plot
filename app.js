const URL = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json"

const margin = {top: 20, right: 20, bottom: 50, left: 50},
      width = 950 - margin.left - margin.right,
      height = 475 - margin.top - margin.bottom;

d3.json(URL).get((error,data)=>{
  if(error)console.log(error);

  const y = d3.scaleLinear()
                .domain(d3.extent(data, d => d.Place))
                .range([0, height])
                .nice();

  const x = d3.scaleLinear()
                .domain(d3.extent(data, d => d.Seconds))
                .range([width, 0])
                .nice();

  const yAxis = d3.axisLeft(y);
  const xAxis = d3.axisBottom(x);

  const svg = d3.select("body").append("svg")
                .attr("height", height + margin.top + margin.bottom)
                .attr("width", width + margin.left + margin.right);

  const chartGroup = svg.append("g").attr("transform","translate("+margin.left+","+margin.top+")");

  chartGroup.selectAll("circle")
            .data(data)
            .enter().append("circle")
                  .attr("r", 5)
                  .attr("cx", d => x(d.Seconds))
                  .attr("cy", d => y(d.Place))
                  .attr("fill", "blue")
                    .on("mouseover", function() {
                      d3.select(this).style("fill", "#BDC2C6");
                      tooltip.style("visibility", "visible")
                      })
                    .on("mouseout", function() {
                      d3.select(this).style("fill", "blue");
                      tooltip.style("visibility", "hidden");
                    })
                    .on("mousemove", function(d) {
                      tooltip.select("text").text(`#${d.Place} ${d.Name} from ${d.Nationality}
                         in ${d.Year} made it in ${d.Seconds} seconds`);
                    });

  let tooltip = chartGroup.append("g").attr("class","tooltip").style("visibility", "hidden");
  tooltip.append("text").attr("x","70").attr("y","15").style("font-size","16px").attr("font-weight","bold");

  chartGroup.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
            (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .style("font-size","20px")
      .text("Fastest time in seconds");

  chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y",0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size","20px")
      .text("Place")

  chartGroup.append("g").attr("class","axis y").call(yAxis);
  chartGroup.append("g").attr("class", "axis x").attr("transform","translate(0,"+height+")").call(xAxis);
});

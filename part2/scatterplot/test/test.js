d3.select('#chart')
  .selectAll("div") // return d3 selection, which is an array
  .data([4,8,15,16,55,42])
  .enter()
  .append("div")
  .style("height",(d)=> d + "px")

var colorMap = d3.interpolateRgb(
  d3.rgb('#d6e685'),
  d3.rgb('#1e6823')
);

d3.select("#gitchart")
  .selectAll("div")
  .data([.2, .4, 0, 0, .13, .92])
  .enter()
  .append("div")
  .style("background-color",(d)=>{
    return d == 0 ? '#eee' : colorMap(d);
  })

var data = [{
  label: "7am",
  sales: 20
},{
  label: "8am",
  sales : 12
},{
  label: "9am",
  sales: 8
},{
  label: "10am",
  sales: 27
}]

var g = d3.select('#circlechart')
  .selectAll("g")
  .data(data)
  .enter()
  .append('g')
g.append('circle')
 .attr('cy',40)
 .attr('cx', (d, i)=>(i+1)*50)
 .attr('r', (d)=> d.sales)
g.append('text')
 .attr('y',90)
 .attr('x',(d, i)=>(i+1)*50)
 .text((d)=>d.label)
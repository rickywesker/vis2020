d3.select('#chart')
  .selectAll("div") // return d3 selection
  .data([4,8,15,16,55,42])
  .enter()
  .append("div")
  .style("height",(d)=> d + "px")
let _width = $(window).width();
let _height = $(window).height();
let width = 0.9 * _width;
let height = 0.96 * _height;

let x_attr = 'Ph.D. Graduation Year';
let y_attr = 'Publications';

let fontFamily;

function set_ui() {
    // 设置字体
    let ua = navigator.userAgent.toLowerCase();
    fontFamily = "Khand-Regular";
    if (/\(i[^;]+;( U;)? CPU.+Mac OS X/gi.test(ua)) {
        fontFamily = "PingFangSC-Regular";
    }
    d3.select("body")
        .style("font-family", fontFamily);
}



var radius = d3.scaleSqrt()
        .domain([0,250])
        .range([0,20])


function draw_main(map,Field) {
    var allIn = d3.map(data,function(d){return d.Institution;});
    ins = Object.keys(map).sort();
    var allGroup = d3.map(data, function(d){return(d.name)}).keys()
    //console.log(allGroup)
    //console.log(ins)
    //var myColor = d3.scaleOrdinal().domain(allIn).range(d3.schemeSet2);
    let padding = {'left': 0.2*width, 'bottom': 0.1*height, 'top': 0.2*height, 'right': 0.1*width};
    let svg = d3.select('#container')
        .select('svg')
        .attr('width', width)
        .attr('height', height);
    
   
    
    
    // button
    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(ins)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

      var myColor = d3.scaleOrdinal()
      .domain(ins)
      .range(d3.schemeSet2);

    // title
    svg.append('g')
        .attr('transform', `translate(${padding.left+(width-padding.left-padding.right)/2}, ${padding.top*0.4})`)
        .append('text')
        .attr('class', 'title')
        .text('A Visualization for Faculties That Research on Computer Science in Well-known Universities');

    // x axis - phd graduation year
    let x = d3.scaleLinear()
        .domain(get_min_max(data, x_attr))
        .range([padding.left, width-padding.right]);    
    let axis_x = d3.axisBottom()
        .scale(x)
        .ticks(10)
        .tickFormat(d => d);

    // y axis - publications
    let y = d3.scaleLinear()
        .domain(get_min_max(data, y_attr))
        .range([height-padding.bottom, padding.top]);    
    let axis_y = d3.axisLeft()
        .scale(y)
        .ticks(10)
        .tickFormat(d => d);

    // x axis
    svg.append('g')
        .attr('transform', `translate(${0}, ${height-padding.bottom})`)
        .call(axis_x)
        .attr('font-family', fontFamily)
        .attr('font-size', '0.8rem')

    svg.append('g')
        .attr('transform', `translate(${padding.left+(width-padding.left-padding.right)/2}, ${height-padding.bottom})`)
        .append('text')
        .attr('class', 'axis_label')
        .attr('dx', '-0.4rem')
        .attr('dy', 0.08*height)
        .text(x_attr);

    // y axis
    svg.append('g')        
        .attr('transform', `translate(${padding.left}, ${0})`)
        .call(axis_y)
        .attr('font-family', fontFamily)
        .attr('font-size', '0.8rem')
    svg.append('g')
        .attr('transform', `
            translate(${padding.left}, ${height/2})
            rotate(-90)    
        `)
        .append('text')
        .attr('class', 'axis_label')
        .attr('dy', -height*0.07)
        .text(y_attr);

    // points
    var first = svg.append('g')
        .selectAll('circle')
        .data(data)
        .enter().append('circle')
        .attr('class', 'point')
        .attr('cx', (d, i) => {
            //console.log('data', d); 
            return x(parseInt(d[x_attr]));
        })
        .attr('cy', (d, i) => y(parseInt(d[y_attr])))
        .attr('r', (d, i)=>{
            return radius(parseInt(d['Publications']));
        })
        
        
        .on('mouseover', (e, d) => {

            //console.log('e', e, 'd', d)

            // show a tooltip
            let name = d['First Name'] + ' ' + d['Mid Name'] + ' ' + d['Last Name'];
            let institution = d['Institution'];
            let grad_year = d['Ph.D. Graduation Year'];
            let grad_school = d['Ph.D. Graduate School'];
            let pubs = d['Publications'];
            let hindex = d['H-index'];
            //console.log('data', d);


            let content = '<table><tr><td>Name</td><td>' + name + '</td></tr>' 
                + '<tr><td>Institution</td><td>'+ institution + '</td></tr>'
                + '<tr><td>Ph.D. Graduation Year</td><td>'+ grad_year + '</td></tr>'
                + '<tr><td>Ph.D. Graduation School</td><td>'+ grad_school + '</td></tr>'
                + '<tr><td>Publications</td><td>'+ pubs + '</td></tr>'
                + '<tr><td>H-index</td><td>'+hindex + '</td></tr></table>';
            
            // tooltip
            let tooltip = d3.select('#tooltip');            
            tooltip.html(content)
                .style('left', (x(parseInt(d[x_attr])) + 5) + 'px')
                .style('top', (y(parseInt(d[y_attr])) + 5)+ 'px')
                //.transition().duration(500)
                .style('visibility', 'visible');
        })
        .on('mouseout', (e, d) => {

            // remove tooltip
            let tooltip = d3.select('#tooltip');            
            tooltip.style('visibility', 'hidden');
        })


        function update(selectedGroup) {

            // Create new data with the selection?
            var dataFilter = data.filter(function(d){
                return d.Institution===selectedGroup})
            console.log(dataFilter)
            console.log(first)
            // Give these new data to update line
            //first.selectAll('circle').exit().remove();
            svg.selectAll('circle').remove();
            svg.append('g')
                .selectAll('circle')
                .data(dataFilter)
                .enter().append('circle')
                .attr('class', 'point')
                .attr('cx', (d, i) => {
                    //console.log('data', d); 
                    return x(parseInt(d[x_attr]));
                })
                .attr('cy', (d, i) => y(parseInt(d[y_attr])))
                .attr('r', (d, i)=>{
                    return radius(parseInt(d['Publications']));
                })
                .style("fill", function(d){ return myColor(selectedGroup) })
                .on('mouseover', (e, d) => {

                    //console.log('e', e, 'd', d)
        
                    // show a tooltip
                    let name = d['First Name'] + ' ' + d['Mid Name'] + ' ' + d['Last Name'];
                    let institution = d['Institution'];
                    let grad_year = d['Ph.D. Graduation Year'];
                    let grad_school = d['Ph.D. Graduate School'];
                    let pubs = d['Publications'];
                    //console.log('data', d);
        
        
                    let content = '<table><tr><td>Name</td><td>' + name + '</td></tr>' 
                        + '<tr><td>Institution</td><td>'+ institution + '</td></tr>'
                        + '<tr><td>Ph.D. Graduation Year</td><td>'+ grad_year + '</td></tr>'
                        + '<tr><td>Ph.D. Graduation School</td><td>'+ grad_school + '</td></tr>'
                        + '<tr><td>Publications</td><td>'+ pubs + '</td></tr></table>';
                    
                    // tooltip
                    let tooltip = d3.select('#tooltip');            
                    tooltip.html(content)
                        .style('left', (x(parseInt(d[x_attr])) + 5) + 'px')
                        .style('top', (y(parseInt(d[y_attr])) + 5)+ 'px')
                        //.transition().duration(500)
                        .style('visibility', 'visible');
                })
                .on('mouseout', (e, d) => {
        
                    // remove tooltip
                    let tooltip = d3.select('#tooltip');            
                    tooltip.style('visibility', 'hidden');
                })
            
          }
      
          // When the button is changed, run the updateChart function
          d3.select("#selectButton").on("change", function(d) {
              // recover the option that has been chosen
              var selectedOption = d3.select(this).property("value")
              console.log(selectedOption)
              // run the updateChart function with this selected option
              update(selectedOption)
          })





       

}

function main() {
    var Fields = ["Institution Index", "Last Name","Mid Name","First Name","Ph.D. Graduation Year","Ph.D. Graduate School","Research Interest","H-index","Citations","Publications","Publications Divided by Co-authors","Remarks","Collector"]
    d3.csv(data_file).then(function(DATA) {
        data = DATA;
        var insMap = {};
        data.forEach(function(d){
            var ins = d.Institution;
            insMap[ins] = []
            Fields.forEach(function(field){›
                insMap[ins].push(+d[field]);
            })
        })
        
        // remove data without x_attr or y_attr
        data = data.filter((d, i) => (d[x_attr] != '' && d[y_attr] != ''));

        set_ui();
        draw_main(insMap,Fields);
    })
}

main()
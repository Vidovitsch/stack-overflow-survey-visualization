const hbar = (d3, data, container='body', options) => {
  console.log('here');
  const { width, height, margin } = options;
  const yScale = d3.scaleBand()
    .range([height, 0])
    .padding(0.2);
  const xScale = d3.scaleLinear()
    .range([0, width]);
console.log('here');
  const svg = d3.select("#content")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
console.log('here');
    xScale.domain([0, d3.max(data, function(d) {
      return d.value;
    })]);
    yScale.domain(data.map(function(d) {
      return d.key;
    }));
console.log('here');
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
          .attr("class", "bar")
          .attr("width", 0)
          .attr("y", function(d) {
            return yScale(d.key);
          })
          .attr("height", yScale.bandwidth())
          .transition()
          .duration(1500)
          .attr("width", function(d){return xScale(d.value);}); //<-- transition to full

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('text')
        .attr('class', 'barsEndlineText')
        .text(function(d){
          return "TESTSET";
        })
        .attr('x', function(d) { return xScale(d.value) + 100; })
        .attr('y', function(d,i){ return yscale(i)+35; })
    svg.append("g")
        .call(d3.axisLeft(yScale));

};

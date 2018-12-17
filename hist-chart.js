const Hist = function(options) {
  this.margin = options.margin || { top: 0, bottom: 0, left: 0, right: 0 };
  this.width = options.width - this.margin.left - this.margin.right || 500;
  this.height = options.height - this.margin.top - this.margin.bottom || 500;
  this.fontSize = options.fontSize || '1em';
  this.bins = options.bins || 20;
  this.max = options.max;
  this.min = options.min;

  this.data = {};
  this.svg = {};
  this.colorScale = d3.scaleQuantize()
    .domain([0, 1])
    .range(options.colors || ["#D0CDFD", "#C8C5FD", "#C0BDFD", "#B9B5FD", "#B1ADFD",
                              "#A9A5FD", "#A19CFC", "#9A94FC", "#928CFC", "#8A84FC",
                              "#827CFC", "#7B74FC", "#736CFC", "#6B63FB", "#635BFB",
                              "#5C53FB", "#544BFB", "#4C43FB", "#443BFB", "#3D33FB"]);
  this.xScale = d3.scaleLinear()
    .domain([this.min, this.max])
    .rangeRound([0, this.width])
  this.yScale = d3.scaleLinear()
    .range([this.height, 0]);
  this.histogram = d3.histogram()
      .value(d => { return d; })
      .domain(this.xScale.domain())
      .thresholds(this.xScale.ticks(this.bins));

  Hist.prototype.plot = function(data, container) {
    console.log(data);
    this.data = data;

    // Group the data for the bars
    const bins = this.histogram(this.data);
    // Get percentage for each bin
    const percentages = bins.reduce((percentages, bin) => {
      percentages.push(Math.round(bin.length / this.data.length * 1000) / 10);
      return percentages;
    }, []);
    // Scale the range of the data in the y domain
    this.yScale.domain([0, d3.max(percentages)]);
    // Create SVG
    this.svg = d3.select(container)
      .append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    // Append bars to histogram
    this.svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
          .attr("x", d => this.xScale(d.x0) + 1)
          .attr("width", d => Math.max(0, this.xScale(d.x1) - this.xScale(d.x0) - 1))
          .attr("y", this.height)
          .attr("height", 0);
    // Add animation to bars
    this.svg.selectAll('rect')
      .transition()
      .duration(1500)
        .attr("y", (d, i) => this.yScale(percentages[i]))
        .attr("height", (d, i) => {
          return this.yScale(0) - this.yScale(percentages[i]);
        })
        .attr('fill', (d, i) => {
          return this.colorScale(percentages[i]);
        });
    // Add text to bars
    this.svg.selectAll('text')
      .data(bins)
      .enter()
      .append('text')
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .text((d, i) => {
          const value = percentages[i];
          if (value == 0) return '';
          return value;
        })
        .attr('x', (d) => {
          return (this.xScale(d.x0) + this.xScale(d.x1)) / 2;
        })
        .attr("y", this.height - 3);
    // Add animation to text
    this.svg.selectAll('text')
      .transition()
      .duration(1500)
        .attr("y", (d, i) => this.yScale(percentages[i]) - 3);
    // Show x-ax
    this.svg.append("g")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(this.xScale));
  };

  Hist.prototype.updateData = function(newData) {
    console.log(newData);
    const bins = this.histogram(newData);
    console.log(bins);
    // Get percentage for each bin
    const percentages = bins.reduce((percentages, bin) => {
      percentages.push(Math.round(bin.length / newData.length * 1000) / 10);
      return percentages;
    }, []);
    console.log(percentages);
    // Scale the range of the data in the y domain
    this.yScale.domain([0, d3.max(percentages)]);
    this.svg.selectAll('rect')
      .data(bins)
      .transition()
      .duration(1500)
      .attr("y", (d, i) => this.yScale(percentages[i]))
      .attr("height", (d, i) => this.yScale(0) - this.yScale(percentages[i]))
      .attr('fill', (d, i) => {
        if (d.length == 0) return '#FFFFFF';
        return this.colorScale(percentages[i]);
      });
    // Update position and value of text after bars
    this.svg.selectAll('text')
      .data(bins)
      .attr("class", "label")
      .text((d, i) => {
        const value = percentages[i];
        if (value == 0) return '';
        return value;
      })
      .transition()
      .duration(1500)
        .attr("y", (d, i) => this.yScale(percentages[i]) - 3);
  };
}

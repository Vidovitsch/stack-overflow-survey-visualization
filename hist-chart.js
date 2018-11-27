const Hist = function(d3) {
  this.d3 = d3;
  this.width = 0;
  this.height = 0;
  this.margin = {};
  this.padding = 0;
  this.min = 0;
  this.max = 0;
  this.bins = 0;
  this.svg = {};
  this.yScale = {};
  this.xScale = {};
  this.histogram = {};
  this.colors = {};

  Hist.prototype.plot = function(data, options) {
    this.margin = options.margin || {top: 10, right: 30, bottom: 30, left: 40};
    this.width = options.width - this.margin.left - this.margin.right || 500;
    this.height = options.height - this.margin.top - this.margin.bottom || 500;
    this.padding = options.padding || 0.2;
    this.min = options.min || d3.min(data);
    this.max = options.max || d3.max(data);
    this.bins = options.bins || 20;
    this.container = options.container || 'body';
    this.colors = options.colors || ['#3D33FB', '#443BFB', '#4C43FB', '#544BFB', '#5C53FB',
      '#635BFB', '#6B63FB', '#736CFC', '#7B74FC', '#827CFC',
      '#8A84FC', '#928CFC', '#9A94FC', '#A19CFC', '#A9A5FD',
      '#B1ADFD', '#B9B5FD', '#C0BDFD', '#C8C5FD', '#D0CDFD'];

    // Set scale of y-ax
    this.yScale = this.d3.scaleLinear()
              .range([this.height, 0]);
    // Set scale of x-ax
    this.xScale = this.d3.scaleLinear()
              .domain([this.min, this.max])
              .rangeRound([0, this.width]);
    // Set the parameters for the histogram
    this.histogram = this.d3.histogram()
        .value(d => { return d; })
        .domain(this.xScale.domain())
        .thresholds(this.xScale.ticks(this.bins));
    // Group the data for the bars
    const bins = this.histogram(data);
    // Scale the range of the data in the y domain
    this.yScale.domain([0, 100]);
    // Create SVG
    this.svg = this.d3.select(this.container)
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
        .attr("y", d => this.yScale(Math.round(d.length / data.length * 1000) / 10))
        .attr("height", d => {
          return this.yScale(0) - this.yScale(Math.round(d.length / data.length * 1000) / 10);
        })
        .attr('fill', (d) => {
          if (d.length == 0) return '#FFFFFF';
          return this.colors[Math.abs(Math.round(d.length / data.length * this.colors.length) - (this.colors.length - 1))];
        });
    // Add text to bars
    this.svg.selectAll('text')
      .data(bins)
      .enter()
      .append('text')
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .text((d) => {
          const value = Math.round(d.length / data.length * 1000) / 10;
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
        .attr("y", d => this.yScale(Math.round(d.length / data.length * 1000) / 10) - 3);
    // Show x-ax
    this.svg.append("g")
        .attr("transform", "translate(0," + this.height + ")")
        .call(this.d3.axisBottom(this.xScale));
  };

  Hist.prototype.updateData = function(data) {
    const bins = this.histogram(data);
    this.svg.selectAll('rect')
      .data(bins)
      .transition()
      .duration(1500)
      .attr("y", d => this.yScale(Math.round(d.length / data.length * 1000) / 10))
      .attr("height", d => this.yScale(0) - this.yScale(Math.round(d.length / data.length * 1000) / 10))
      .attr('fill', (d) => {
        if (d.length == 0) return '#FFFFFF';
        return this.colors[Math.abs(Math.round(d.length / data.length * this.colors.length) - (this.colors.length - 1))];
      });
    // Update position and value of text after bars
    this.svg.selectAll('text')
      .data(bins)
      .attr("class", "label")
      .text((d) => {
        const value = Math.round(d.length / data.length * 1000) / 10;
        if (value == 0) return '';
        return value;
      })
      .transition()
      .duration(1500)
        .attr("y", d => this.yScale(Math.round(d.length / data.length * 1000) / 10) - 3);
  };
}

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


  Hist.prototype.plot = function(data, options) {
    this.margin = options.margin || {top: 10, right: 30, bottom: 30, left: 40};
    this.width = options.width - this.margin.left - this.margin.right || 500;
    this.height = options.height - this.margin.top - this.margin.bottom || 500;
    this.padding = options.padding || 0.2;
    this.min = options.min || d3.min(data);
    this.max = options.max || d3.max(data);
    this.bins = options.bins || 25;
    this.container = options.container || 'body';

    // Set scale of y-ax
    const yScale = this.d3.scaleLinear()
              .range([this.height, 0]);
    // Set scale of x-ax
    const xScale = this.d3.scaleLinear()
              .domain([this.min, this.max])
              .rangeRound([0, this.width]);
    // Set the parameters for the histogram
    const histogram = this.d3.histogram()
        .value(d => { return d; })
        .domain(xScale.domain())
        .thresholds(xScale.ticks(this.bins));
    // Group the data for the bars
    const bins = histogram(data);
    // Scale the range of the data in the y domain
    yScale.domain([0, this.d3.max(bins, (d) => { return d.length; })]);
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
          .attr("x", d => xScale(d.x0) + 1)
          .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
          .attr("y", this.height)
          .attr("height", 0);
    // Add animation to bars
    this.svg.selectAll('rect')
      .transition()
      .duration(1500)
        .attr("y", d => yScale(d.length))
        .attr("height", d => yScale(0) - yScale(d.length));
    // Show x-ax
    this.svg.append("g")
        .attr("transform", "translate(0," + this.height + ")")
        .call(this.d3.axisBottom(xScale));
    // Show y-ax
    this.svg.append("g")
        .call(this.d3.axisLeft(yScale));
  };

  Hist.prototype.updateData = function(data) {

  };
}

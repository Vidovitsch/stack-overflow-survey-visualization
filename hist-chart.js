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
    this.width = options.width || 500;
    this.height = options.height || 500;
    this.margin = options.margin || {top: 10, right: 30, bottom: 30, left: 40};
    this.padding = options.padding || 0.2;
    this.min = options.min || d3.min(data);
    this.max = options.max || d3.max(data);
    this.bins = options.bins || 25;
    this.container = options.container || 'body';

    this.width = this.width - this.margin.left - this.margin.right,
    this.height = this.height - this.margin.top - this.margin.bottom;

    // set the ranges
    const xScale = this.d3.scaleLinear()
              .domain([this.min, this.max])
              .rangeRound([0, this.width]);
    const yScale = this.d3.scaleLinear()
              .range([this.height, 0]);

    // set the parameters for the histogram
    const histogram = this.d3.histogram()
        .value(d => { return d; })
        .domain(xScale.domain())
        .thresholds(xScale.ticks(this.bins));

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    this.svg = this.d3.select(this.container)
      .append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    // group the data for the bars
    const bins = histogram(data);
    // Scale the range of the data in the y domain
    yScale.domain([0, this.d3.max(bins, function(d) { return d.length; })]);
    // append the bar rectangles to the svg element
    this.svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
          .attr("class", "bar")
          .attr("x", 1)
          .attr("transform", function(d) { return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")"; })
          .attr("width", function(d) { return xScale(d.x1) - xScale(d.x0) -1 ; })
          .attr("height", (d) => { return this.height - yScale(d.length); });
    // add the x Axis
    this.svg.append("g")
        .attr("transform", "translate(0," + this.height + ")")
        .call(this.d3.axisBottom(xScale));

    // add the y Axis
    this.svg.append("g")
        .call(this.d3.axisLeft(yScale));
  };

  Hist.prototype.updateData = function(data) {

  };
}

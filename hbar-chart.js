const Hbar = function(options) {
  this.width = options.width || 500;
  this.height = options.height || 500;
  this.margin = options.margin || { top: 0, bottom: 0, left: 0, right: 0 };
  this.padding = options.padding || 0.2;
  this.fontSize = options.fontSize || '1em';
  this.labelAnchor = options.labelAnchor || 1;
  this.limit = options.limit;

  this.data = {};
  this.svg = {};
  this.colorScale = d3.scaleQuantize()
    .domain([0, 1])
    .range(options.colors || ["#D0CDFD", "#C8C5FD", "#C0BDFD", "#B9B5FD", "#B1ADFD",
                              "#A9A5FD", "#A19CFC", "#9A94FC", "#928CFC", "#8A84FC",
                              "#827CFC", "#7B74FC", "#736CFC", "#6B63FB", "#635BFB",
                              "#5C53FB", "#544BFB", "#4C43FB", "#443BFB", "#3D33FB"]);
  this.xScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, this.width]);
  this.yScale = d3.scaleBand()
    .range([this.height, 0])
    .padding(this.padding);

  const H = Hbar.prototype;

  H.plot = function(data, container='body') {
    // Set limit on the amount of bars in the chart
    // Bars will be trimmed from the bottom up
    this.data = this.limit ? data.slice(Math.abs(this.limit - data.length)) : data;

    // Set scale of y-ax
    this.yScale.domain(this.data.map(d => d.key))

    // Create SVG
    this.svg = d3.select(container)
      .append('svg')
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    // Append bars to horizonal bar chart
    this.svg.selectAll('rect')
      .data(this.data)
      .enter()
      .append('rect')
        .attr('width', 0)
        .attr('y', (d, i) => {
          return this.yScale(d.key);
        })
        .attr('height', this.yScale.bandwidth())

    // Add animation to bars
    this.svg.selectAll('rect')
      .transition()
      .duration(1500)
        .attr('width', (d) => {return this.xScale(d.value);})
        .attr('fill', (d) => {
          return this.colorScale(d.value);
        });

    // Add text to bars
    this.svg.selectAll('text')
      .data(this.data)
      .enter()
      .append('text')
        .attr("class", "label")
        .text((d) => {
          return d.value > 0.0 ? Math.round(d.value * 1000) / 10 + '%': '';
        })
        .attr('y', (d) => {
          return this.yScale(d.key) + this.yScale.bandwidth() / this.labelAnchor;
        })
        .attr('font-size', this.fontSize);

    // Add animation to text
    this.svg.selectAll('text')
      .transition()
      .duration(1500)
        .attr('x', (d) => {
          return this.xScale(d.value) + 3;
        })

    // Show y-ax
    this.svg.append('g')
      .call(d3.axisLeft(this.yScale));
  };

  H.updateData = function(newData) {
    // Optimization:
    // Convert list presentation of the data to dictionary for faster lookup
    newData = newData.reduce((dict, kvPair) => {
      dict[kvPair.key] = kvPair.value;
      return dict;
    }, {});

    // Update the bar width of chart
    this.svg.selectAll('rect')
      .data(this.data)
      .transition()
      .duration(1500)
        .attr('width', (d) => {
          if (!(d.key in newData)) return this.xScale(0)
          return this.xScale(newData[d.key]);
        })
        .attr('fill', (d) => {
          if (!(d.key in newData)) return '#FFFFFF';
          return this.colorScale(newData[d.key]);
        });

    // Update position and value of text after bars
    this.svg.selectAll('text')
      .data(this.data)
      .text(function(d) {
        if (!(d.key in newData)) return '';
        return Math.round(newData[d.key] * 1000) / 10 + '%';
      })
      .transition()
      .duration(1500)
        .attr('x', (d) => {
          if (!(d.key in newData)) return 3;
          return this.xScale(newData[d.key]) + 3;
        })
  };
}

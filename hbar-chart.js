const Hbar = function(d3) {
  this.d3 = d3;
  this.svg = {};
  this.yLabels = [];
  this.width = 0;
  this.height = 0;
  this.margin = {};
  this.padding = 0;
  this.container = '';
  this.colors = [];

  Hbar.prototype.plot = function(data, options) {
    this.width = options.width || 500;
    this.height = options.height || 500;
    this.margin = options.margin || { top: 0, bottom: 0, left: 50, right: 50 };
    this.padding = options.padding || 0.2;
    this.container = options.container || 'body';
    this.colors = options.colors || ['#3D33FB', '#443BFB', '#4C43FB', '#544BFB', '#5C53FB',
      '#635BFB', '#6B63FB', '#736CFC', '#7B74FC', '#827CFC',
      '#8A84FC', '#928CFC', '#9A94FC', '#A19CFC', '#A9A5FD',
      '#B1ADFD', '#B9B5FD', '#C0BDFD', '#C8C5FD', '#D0CDFD'];
    const maxLabels = options.maxLabels || data.length;
    data = data.splice(Math.abs(maxLabels - data.length));

    // Set scale of y-ax
    const yScale = this.d3.scaleBand()
      .range([this.height, 0])
      .padding(this.padding);
    // Set scale of x-ax
    const xScale = this.d3.scaleLinear()
      .range([0, this.width]);
    // Fit linear data points on x-ax
    xScale.domain([0, 1]);
    // Fit ordinal data points on y-ax
    yScale.domain(data.map(function(d) {
      return d.key;
    }));
    // Create SVG
    this.svg = this.d3.select(this.container)
      .append('svg')
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
    // Append bars to horizonal bar chart
    this.svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
        .attr('class', 'bar')
        .attr('width', 0)
        .attr('y', (d) => {
          this.yLabels.push(d.key); // Keeps track of original index of labels.
          return yScale(d.key);
        })
        .attr('height', yScale.bandwidth())
    // Add animation to bars
    this.svg.selectAll('rect')
      .transition()
      .duration(1500)
        .attr('width', (d) => {return xScale(d.value);})
        .attr('fill', (d) => {
          return this.colors[Math.abs(Math.round(d.value * this.colors.length) - (this.colors.length - 1))];
        });
    // Add text to bars
    this.svg.selectAll('text')
      .data(data)
      .enter()
      .append('text')
        .attr("class", "label")
        .text((d) => {
          return d.value > 0 ? Math.round(d.value * 1000) / 10 : '';
        })
        .attr('y', (d) => {
          return yScale(d.key) + yScale.bandwidth();
        })
    // Add animation to text
    this.svg.selectAll('text')
      .transition()
      .duration(1500)
        .attr('x', (d) => {
          return xScale(d.value) + 3;
        })
    // Show y-ax
    this.svg.append('g')
      .call(d3.axisLeft(yScale));
  };

  Hbar.prototype.updateData = function(data) {
    // Convert list presentation of the data back
    // to a dictionary presentation for faster lookup.
    const data_dict = data.reduce((acc, kvPair) => {
      acc[kvPair.key] = kvPair.value;
      return acc;
    }, {});
    // Update the bar width of chart
    this.svg.selectAll('rect')
      .data(this.yLabels)
      .transition()
      .duration(1500)
      .attr('width', (label) => {
        if (label in data_dict) return xScale(data_dict[label]);
        return xScale(0);
      })
      .attr('fill', (label) => {
        if (label in data_dict) return this.colors[Math.abs(Math.round(data_dict[label] * this.colors.length) - (this.colors.length - 1))];
        return '#FFFFFF';
      });
    // Update position and value of text after bars
    this.svg.selectAll('text')
      .data(this.yLabels)
      .attr("class", "label")
      .text(function(label) {
        if (label in data_dict) return Math.round(data_dict[label] * 1000) / 10;
        return '';
      })
      .transition()
      .duration(1500)
        .attr('x', (label) => {
          if (label in data_dict) return xScale(data_dict[label]) + 3;
          return 2;
        })
  };
}

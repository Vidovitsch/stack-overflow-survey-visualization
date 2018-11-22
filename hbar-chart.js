const Hbar = function(d3) {
  this.d3 = d3;
  this.svg = {};
  this.xScale = {};
  this.yScale = {};
  this.yLabels = [];
  this.colors = ['#3D33FB', '#443BFB', '#4C43FB', '#544BFB', '#5C53FB',
  '#635BFB', '#6B63FB', '#736CFC', '#7B74FC', '#827CFC',
  '#8A84FC', '#928CFC', '#9A94FC', '#A19CFC', '#A9A5FD',
  '#B1ADFD', '#B9B5FD', '#C0BDFD', '#C8C5FD', '#D0CDFD'];

  Hbar.prototype.plot = function(data, options) {
    const { width, height, margin, padding, container } = options;
    const colorGradient = []

    // Set scale of y-ax
    this.yScale = this.d3.scaleBand()
      .range([height, 0])
      .padding(padding);

    // Set scale of x-ax
    this.xScale = d3.scaleLinear()
      .range([0, width]);

    // Fit linear data points on x-ax
    this.xScale.domain([0, 1]);

    // Fit ordinal data points on y-ax
    this.yScale.domain(data.map(function(d) {
      return d[0];
    }));

    // Create SVG
    this.svg = this.d3.select(container)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Append bars to horizonal bar chart
    this.svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
        .attr('class', 'bar')
        .attr('width', 0)
        .attr('y', (d) => {
          this.yLabels.push(d[0]);
          return this.yScale(d[0]);
        })
        .attr('height', this.yScale.bandwidth())
        .transition()
        .duration(1500)
          .attr('width', (d) => {return this.xScale(d[1]);})
          .attr('fill', (d) => {
            return this.colors[Math.abs(Math.round(d[1] * 20) - 19)];
          });

    this.svg.selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .attr("class", "label")
      .text((d) => {
        return Math.round(d[1] * 100);
      })
      .attr('y', (d) => {
        return this.yScale(d[0]) + this.yScale.bandwidth();
      })

    this.svg.selectAll('text').transition()
    .duration(1500)
      .attr('x', (d) => {
        return this.xScale(d[1]) + 2;
      })


    // Show y-ax
    this.svg.append('g')
      .call(d3.axisLeft(this.yScale));
  };

  Hbar.prototype.updateData = function(data) {
    // Convert list presentation of the data back
    // to a dictionary presentation for faster lookup.
    const data_dict = data.reduce((acc, kvPair) => {
      acc[kvPair[0]] = kvPair[1];
      return acc;
    }, {});

    // Update the bar width of chart
    this.svg.selectAll('rect')
      .data(this.yLabels)
      .transition()
      .duration(1500)
      .attr('width', (label) => {
        if (label in data_dict) return this.xScale(data_dict[label]);
        return this.xScale(0);
      })
      .attr('fill', (label) => {
        if (label in data_dict) return this.colors[Math.abs(Math.round(data_dict[label] * 20) - 19)];
        return this.colors[10];
      });

      this.svg.selectAll('text')
        .data(this.yLabels)
        .attr("class", "label")
        .text(function(label) {
          if (label in data_dict) return Math.round(data_dict[label] * 100);
          return '';
        })
        .transition()
        .duration(1500)
          .attr('x', (label) => {
            if (label in data_dict) return this.xScale(data_dict[label]) + 2;
            return 2;
          })
          .tween("text", function(label) {
            var i = d3.interpolate(this.textContent, data_dict[label]);

            return function(t) {
                this.textContent = data_dict[label];
            };
          })
  }
}

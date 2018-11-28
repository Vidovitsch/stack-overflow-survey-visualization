const Donut = function() {
  this.svg = {};
  this.xScale = {};
  this.yScale = {};
  this.yLabels = [];
  this.width = 0;
  this.height = 0;
  this.margin = {};
  this.padding = 0;
  this.container = '';
  this.colors = [];

  Donut.prototype.plot = function(data, options) {
    this.width = options.width || 500;
    this.height = options.height || 500;
    this.margin = options.margin || { top: 0, bottom: 0, left: 50, right: 50 };
    this.radius = options.radius || 100;
    this.padding = options.padding || 0.2;
    this.container = options.container || 'body';

    const arc = d3.arc()
    	.outerRadius(this.radius - 10)
    	.innerRadius(this.radius / 2);

    const pie = d3.pie()
	    .sort(null)
	    .value(function(d) {
	        return d.value;
	    });

    const svg = d3.select(this.container)
      .append("svg")
  	    .attr("width", this.width)
  	    .attr("height", this.height)
	    .append("g")
	     .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

   const g = svg.selectAll(".arc")
     .data(pie(data))
     .enter()
     .append("g");

   g.append("path")
      .style("fill", function(d,i) {
       	return data[i].color;
       })
       .attr("d", arc);

   g.append("text")
   	.attr("transform", function(d) {
       var _d = arc.centroid(d);
       _d[0] *= 1.5;	//multiply by a constant factor
       _d[1] *= 1.5;	//multiply by a constant factor
       return "translate(" + _d + ")";
     })
     .attr("dy", ".50em")
     .style("text-anchor", "middle")
     .text(function(d) {
       return Math.round(d.value * 100) + '%';
     });

   let legend = d3.select(this.container).append('div')
			.attr('class', 'legend')

   let keys = legend.selectAll('.key')
   			.data(data)
   			.enter().append('div')
   			.attr('class', 'key')
   			.style('display', 'flex')
   			.style('align-items', 'center')
   			.style('margin-right', '20px');

 		keys.append('div')
 			.attr('class', 'symbol')
 			.style('height', '10px')
 			.style('width', '10px')
 			.style('margin', '5px 5px')
 			.style('background-color', (d, i) => data[i].color);

 		keys.append('div')
 			.attr('class', 'name')
 			.text(d => `${d.key}`);

 		keys.exit().remove();
  };

  Donut.prototype.updateData = function(data) {

  };
}

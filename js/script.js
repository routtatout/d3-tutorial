var D3Demo = D3Demo || {}
D3Demo = {
  W: 960,
  H: 500,
  DATA: [ 32, 57, 112, 293 ],

  svg: null,
  circles: null,
  text: null,

  buildSvg: function(){
    this.svg = d3.select("#chart")
      .append("svg")
      .attr("width", this.W)
      .attr("height", this.H);
  },
  addText: function(){
    this.text = this.svg
      .append("text")
      .text("hello world")
      .attr("y", 50);
  },
  makeCircles: function(){
    this.circles = this.svg.selectAll("circle")
      .data( this.DATA )
      .enter().append("circle")
      .attr("cy", 90)
      .attr("cx", String)
      .attr("r", Math.sqrt);
  },
  testExit: function(){
    this.DATA.pop();
    this.svg.selectAll("circle").data( this.DATA ).exit().remove();
  },
  debug: function(){
    alert(this.DATA);
  }
}

D3Demo.buildSvg();
D3Demo.makeCircles();
D3Demo.addText();

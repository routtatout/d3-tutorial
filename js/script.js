var D3Demo = D3Demo || {}
D3Demo = {
  CircleDemo: {
    W: 960,
    H: 200,
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
        .attr("cx", 0)      
        .attr("cy", 90)
        .attr("r", 0)
        .transition()
        .attr("cx", String)
        .attr("r", Math.sqrt);
    },
    testExit: function(){
      this.DATA.pop();
      this.svg.selectAll("circle")
      .data( this.DATA )
      .exit()
      .transition()
      .attr("cx", 0)
      .attr("r", 0)
      .remove();
    },
    debug: function(){
      alert(this.DATA);
    }
  },

  UpdateAlphabetDemo: {
    // from http://bl.ocks.org/3808218
    ALPHABET: "abcdefghijklmnopqrstuvwxyz".split(""),
    W: 960,
    H: 200,
    SHUFFLE_INTERVAL: null,

    svg: null,

    init: function(){
      this.appendSvg();
      this.update( this.ALPHABET );
    },

    appendSvg: function(){
      this.svg = d3.select("body").append("svg")
        .attr("width", this.W)
        .attr("height", this.H)
      .append("g")
        .attr("transform", "translate(32," + (this.H / 2) + ")");
    },

    shuffleAlphabet: function(){
      var that = this;
      var shuffle = function(a) {
        console.log(a + ":" + typeof a);
        var m = a.length, t, i;
        while (m) {
          i = Math.floor( Math.random() * m-- );
          t = a[m], a[m] = a[i], a[i] = t;
        }
        return a;
      }
      this.SHUFFLE_INTERVAL = setInterval( function() {
        console.log(that.ALPHABET);
        that.update( shuffle( that.ALPHABET )
            .slice( 0, Math.floor( Math.random() * 26) )
            .sort()
          );
      }, 10000 );
    },

    update: function( data ){
      var text = this.svg.selectAll("text")
      .data( data );

      // UPDATE
      // Update old elements as needed.
      text.attr( "class", "update ");

      // ENTER
      // Create new elements as needed.
      text.enter().append("text")
          .attr("class", "enter")
          .attr("x", function(d, i) { return i * 32; })
          .attr("dy", ".35em");

      // ENTER + UPDATE
      // Appending to the enter selection expands the update selection to include
      // entering elements; so, operations on the update selection after appending to
      // the enter selection will apply to both entering and updating nodes.
      text.text( function(d) { return d; } );

      // EXIT
      // Remove old elements as needed.
      text.exit().remove();
    }
  }
}


D3Demo.CircleDemo.buildSvg();
D3Demo.CircleDemo.makeCircles();
D3Demo.CircleDemo.addText();

D3Demo.UpdateAlphabetDemo.init();
D3Demo.UpdateAlphabetDemo.shuffleAlphabet();

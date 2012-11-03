var D3Demo = D3Demo || {}
D3Demo = {
  CircleDemo: {
    W: "100%",
    H: "120px",
    DATA: [ 32, 57, 112, 293 ],

    svg: null,
    circles: null,
    text: null,

    buildSvg: function(){
      this.svg = d3.select("#hw-chart")
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
    ORIGINAL_MY_NAME: null,
    MY_NAME_FREQUENCY: 7,
    W: "100%",
    H: "200",
    SHUFFLE_INTERVAL: null,
 
    myName: null,    
    svg: null,

    init: function(){
      this.myName = this.getMyNameText().split("");
      this.ORIGINAL_MY_NAME = this.getMyNameText().split("");
      this.appendSvg();
      this.update( this.myName );
    },

    getMyNameText: function(){
      return "John R. Reigart III";
    },

    appendSvg: function(){
      this.svg = d3.select( "body" ).append( "svg" )
        .attr( "width", this.W )
        .attr( "height", this.H )
      .append("g")
        .attr( "transform", "translate( 32," + ( this.H / 2 ) + ")" );
    },

    shuffleAlphabet: function(){
      var that = this, shuffleCount = 0;
      var showOriginalText = function(){
        return shuffleCount % that.MY_NAME_FREQUENCY == 0;
      }
      var shuffle = function( a ) {
        shuffleCount++;
        var m = a.length, t, i;
        while (m) {
          i = Math.floor( Math.random() * m-- );
          t = a[m], a[m] = a[i], a[i] = t;
        }
        if( !showOriginalText() ){
          return a.slice( 0, Math.floor( Math.random() * that.myName.length ) ).sort();
        } else {
          return that.ORIGINAL_MY_NAME;
        }
      };

      this.SHUFFLE_INTERVAL = setInterval( function() {
        that.update( shuffle( that.myName ) );
      }, 2000 );
    },

    update: function( data ){
      var text = this.svg.selectAll( "text" )
        .data( data, function(d) { return d; } );
      
      // UPDATE
      // Update old elements as needed.
      text.attr( "class", "update ")
        .transition()
          .duration( 750 )
          .attr( "x", function( d, i ) { return i * 32; } );

      // ENTER
      // Create new elements as needed.
      text.enter().append( "text" )
          .attr("class", "enter")
          .attr( "dy", ".35em")
          .attr( "y", -100 )
          .attr( "x", function( d, i ) { return i * 32; } )
          .style( "fill-opacity", 1e-6 )
          .text( function(d) { return d; } )
        .transition()
          .duration( 750 )
          .attr( "y", 0 )
          .style( "fill-opacity", 1 );

      // EXIT
      // Remove old elements as needed.
      text.exit()
          .attr("class", "exit")
        .transition()
          .duration( 750 )
          .attr( "y", 100 )
          .style( "fill-opacity", 1e-6 )
          .remove();
    }
  },

  BarChartDemo: {
    DATA: [ 4, 8, 15, 16, 23, 42, 80 ],
    divChart: null,
    svgChart: null,
    getBarWidth: null,
    getBarHeight: null,

    init: function(){
      this.setBarWidthAndHeight();
      this.appendDivChart();
      this.appendDivBars();
      this.appendSvgChart();
      this.appendSvgBars();
    },

    setBarWidthAndHeight: function(){
      this.getBarWidth = d3.scale.linear()
        .domain( [ 0, d3.max( this.DATA ) ] )
        .range( [ 0, "90%" ] );
      
      this.getBarHeight = d3.scale.ordinal()
        .domain( this.DATA )
          .rangeBands( [ 0, 120 ] );
    },

    appendDivChart: function(){
      this.divChart = d3.select( "body" ).append( "div" )
        .text( "Using <div>s" )
        .attr( "class", "chart" );
    },

    appendDivBars: function(){
      this.divChart.selectAll( "div" )
          .data( this.DATA )
        .enter().append( "div" )
            .style( "width", 0 )
          .transition()
            .duration( 1750 )
            .style( "width", this.getBarWidth )
            .transition()
            .text( String );
    },

    appendSvgChart: function(){
      this.svgChart = d3.select( "body" ).append( "div" )
          .text( "Using <svg>")
        .append( "svg" )
          .attr( "class", "chart" )
          .attr( "width", "100%" )
          .attr( "height", 20 * ( this.DATA.length + 1 ) )
        .append( "g" )
          .attr( "transform", "translate( 10, 15 )" );
    },

    appendSvgBars: function(){
      var that = this;
      this.svgChart.selectAll( "rect" )
          .data( this.DATA )
        .enter().append( "rect" )
            .attr( "y", function( d, i ) { return i * ( 120 / that.DATA.length ) ; } )
            .attr( "width", 0 )
            .attr( "height", 0 )
          .transition()
            .duration( 1750 )
            .attr( "width", this.getBarWidth )
            .attr( "height", this.getBarHeight.rangeBand() );

      this.appendTextToSvgBars( this.svgChart );
      this.appendTickMarksToSvg();

      this.svgChart.selectAll( "rect" )
          .data( this.DATA ) 
        .exit()
          .transition()
          .duration( 1750 )
          .attr( "transform", "rotate( 20 )")
          .attr( "y", 140 )
          .remove();      
    },

    appendTextToSvgBars: function( appendTo ){
      var that = this;
      appendTo.selectAll( "text" )
        .data( this.DATA  )
      .enter().append( "text" )
          .attr( "x", 0 )
          .attr( "y", function( d ) { return that.getBarHeight(d) + that.getBarHeight.rangeBand() / 2; } )
          .attr( "dx", -3 ) // padding-right
          .attr( "dy", ".35em" ) // vertical-align: middle
          .attr( "text-anchor", "end" ) // text-align: right
        .transition()
          .duration( 3750 )
          .attr( "x", this.getBarWidth )
          .text( String );

      appendTo.selectAll( "text" )
        .data( this.DATA )
      .exit().remove( "text" )
        .remove();
    },

    appendTickMarksToSvg: function(){
      this.svgChart.selectAll( "line" )
          .data( this.getBarWidth.ticks( 10 ) )
        .enter().append( "line" )
          .attr( "x1", this.getBarWidth )
          .attr( "x2", this.getBarWidth )
          .attr( "y1", 0 )
          .attr( "y2", 120 )
          .style( "stroke", "#ccc" );

      this.svgChart.selectAll( ".rule" )
          .data( this.getBarWidth.ticks( 10 ) )
        .enter().append( "text" )
          .attr( "class", "rule" )
          .attr( "x", this.getBarWidth )
          .attr( "y", 0 )
          .attr( "dy", -3 )
          .attr( "text-anchor", "middle" )
          .text( String );

      this.svgChart.append( "line" )
        .attr( "y1", 0 ) 
        .attr( "y2", 120 )
        .style( "stroke", "black" );
    }
  },

  BarChartTwoDemo: {
    WIDTH: 20,
    HEIGHT: 80,
    X: null,
    Y: null,
    DATA: [],
    TIME: 1297110663, // start time (seconds since epoch)

    subscribers: 70, // start value (subscribers)
    updateInterval: null,
    svgChart: null,

    init: function(){
      this.initXY();
      this.initData();
      this.appendSvgChart();
      console.log( 
        this.DATA[ this.DATA.length - 1 ] +
        this.X() + " " +
        this.Y()
      );
      this.updateData();
    },

    initData: function(){
      this.DATA = d3.range( 33 ).map( this.addNextData ); // starting dataset
    },

    initXY: function(){
      // var that = D3Demo.BarChartTwoDemo;
      this.X = d3.scale.linear()
        .domain( [ 0, 1] )
        .range( [ 0, this.WIDTH] );
      this.Y = d3.scale.linear()
        .domain( [ 0, 100 ] )
        .rangeRound( [ 0, this.HEIGHT ] );
    },

    addNextData: function(){
      var that = D3Demo.BarChartTwoDemo;
      return {
        time: ++that.TIME,
        value: that.subscribers = Math.floor( Math.max( 10, Math.min( 90, that.subscribers + 10 * ( Math.random() - .5 ) ) ) )
      }
    },

    updateData: function(){
      var that = this;
      this.updateInterval = setInterval( function() {
        that.DATA.shift();
        that.DATA.push( that.addNextData() );
        that.redrawBars();
      }, 1500 );
    },

    appendSvgChart: function(){
      var chart = this.svgChart;
      var data = this.DATA;
      var that = this;

      this.svgChart = d3.select( "body" ).append( "svg" )
        .attr( "class", "chart bar-chart-two" )
        .attr( "width", this.WIDTH * data.length - 1 )
        .attr( "height", this.HEIGHT );
  
      this.svgChart.selectAll( "rect" )
        .data( data )
        .enter().append( "rect" )
        .attr( "x", function( d, i ) { return that.X( i ) - .5; } )
        .attr( "y", function( d ) { return that.HEIGHT - that.Y( d.value ) - .5; } )
        .attr( "width", this.WIDTH )
        .attr( "height", function( d ) { return that.Y( d.value ); } );

      this.svgChart.append("line")
        .attr( "x1", 0 )
        .attr( "x2", this.WIDTH * this.DATA.length )
        .attr( "y1", this.HEIGHT - .5 )
        .attr( "y2", this.HEIGHT - .5 )
        .style( "stroke", "#000" );
    },

    redrawBars: function(){
      var that = this;
      var rect = this.svgChart.selectAll("rect")
        .data( this.DATA, function( d ) { return d.time; } );

      // Enter…
      rect.enter().insert( "rect", "line" )
          .attr( "x", function( d, i ) { return that.X( i + 1 ) - .5; } )
          .attr( "y", function( d ) { return that.HEIGHT - that.Y( d.value ) - .5; } )
          .attr( "width", that.WIDTH )
          .attr( "height", function( d ) { return that.Y( d.value); } )
        .transition()
          .duration( 1000 )
          .attr("x", function( d, i ) { return that.X( i ) - .5; } );

      // Update…
      rect.transition()
        .duration( 1000 )
        .attr( "x", function( d, i ) { return that.X(i) - .5; } );

      // Exit…
      rect.exit().transition()
        .duration(1000)
        .attr("x", function(d, i) { return that.X(i - 1) - .5; } )
        .remove();
    }
  }
}

D3Demo.CircleDemo.buildSvg();
D3Demo.CircleDemo.makeCircles();
D3Demo.CircleDemo.addText();

D3Demo.UpdateAlphabetDemo.init();
D3Demo.UpdateAlphabetDemo.shuffleAlphabet();

D3Demo.BarChartDemo.init();

D3Demo.BarChartTwoDemo.init();









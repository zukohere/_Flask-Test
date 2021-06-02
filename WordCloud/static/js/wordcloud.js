function colorChanged(selection) {
  UserColor = d3.select("#selColor").node().value

d3.select("#my_dataviz").selectAll("text")
      .transition()
      .duration(1000)
      .style("fill", UserColor)
}

function dataChanged(selection) {
  console.log(d3.select("#selData").node().value)
}

function init() {
  // Grab the color drop down
  var colorMenu = d3.select("#selColor");
  // create a list of color options and populate it
  ["Blue",
    "Red",
    "Maroon",
    "Yellow",
    "Olive",
    "Lime",
    "Green",
    "Aqua",
    "Teal",
    "Navy",
    "Fuchsia",
    "Purple",
    "lightgray",
    "Black",
  ].forEach(d => colorMenu.append("option").append("value").text(d))

  var stock_name = d3.select("#selData").node().value
  
  stockCloud(stock_name)

}

init()
//NOTE: Must link to stock select dropdown
//Other custom choices should include:
// - Part(s) of Speech
// - slice (num words)
// - color?

//NOTE: Tooltip info:
// - word definition?
// - article sources?
// - num times appears?


// Replace optionChanged with transition function instead of re-write/add.


var slice = 100000 // Enable user to select
// other variables maybe color
function stockCloud(stock_name,slice) {d3.json(`/stock-page/${stock_name}`).then(function(data) {
// Promise Pending
    const dataPromise = d3.json(`/stock-page/${stock_name}`);
    console.log("Data Promise: ", dataPromise);
    // console.log(data.map(function (d) { return { text: d.Words, size: d.Counts }; }))
    // // set the dimensions and margins of the graph
    var margin = { top: 10, right: 10, bottom: 10, left: 10 },
      width = 600 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

    // // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    // // Wordcloud features that are different from one word to the other must be here
    var layout = d3.layout.cloud()
      .size([width, height])
      .words(data.slice(0,slice).map(function (d) { return { text: d.Words, size: d.Counts }; }))
      .padding(5)        //space between words
      .rotate(function () { return ~~(Math.random() * 2) * 90; })
      .fontSize(function (d) { return d.size * 10; })      // font size of words
      .on("end", draw);
    layout.start();

    // // This function takes the output of 'layout' above and draw the words
    // // Wordcloud features that are THE SAME from one word to the other can be here
    function draw(words) {
      svg
        .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function (d) { return d.size; })
        .style("fill", d3.select("#selColor").node().value)
        .attr("text-anchor", "middle")
        .style("font-family", "Impact")
        .attr("transform", function (d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function (d) { return d.text; })
    }
  }
)
}


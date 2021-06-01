console.log("hello")
function optionChanged(selection) {
  // If all is selected, render original histogram
    stockCloud(selection);
}
var slice = 100000
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
        .style("fill", "#69b3a2")
        .attr("text-anchor", "middle")
        .style("font-family", "Impact")
        .attr("transform", function (d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function (d) { return d.text; });
    }
  }
)
}


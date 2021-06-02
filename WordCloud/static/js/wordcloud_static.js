function colorChanged(selection) {
  UserColor = d3.select("#selColor").node().value

d3.select("#my_dataviz").selectAll("text")
      .transition()
      .duration(1000)
      .style("fill", UserColor)
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
}
stockCloud()
init()

path = `../static/data/data.json` // path when running from app.py,  otherwise just start with data.
slice = 100000
// function stockCloud(stock_name,slice) {d3.json(`/stock-page/${stock_name}`).then(function(data) {
  function stockCloud() {d3.json(`../static/data/data.json`).then(function(data) {
  // Promise Pending
    // const dataPromise = d3.json(`/stock-page/${stock_name}`);
    const dataPromise = d3.json(`../static/data/data.json`);
    console.log("Data Promise: ", dataPromise);

    //filter the data by POS
    UserPOS = d3.select("#selPOS").node().value
    if (UserPOS) {
    var filteredData = data.filter(record =>record.POS === "ADJ")
    console.log(filteredData)}
    else {
      var filteredData = data
    }
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
      .words(filteredData.map(function (d) { return { text: d.Words, size: d.Counts }; }))
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
        .text(function (d) { return d.text; });
    
      }
  }
)
  }
// // for function
// }
function posChanged(selection) {d3.json(`../static/data/data.json`).then(function(data) {
  UserPOS = d3.select("#selPOS").node().value
  console.log(UserPOS)
  if (UserPOS) {
    var filteredData = data.filter(record =>record.POS === UserPOS)
    console.log(filteredData)}
    else {
      var filteredData = data
    }
    d3.select("#my_dataviz").html("")
    stockCloud()
    console.log(d3.select("#my_dataviz").select("svg"))
    // .transition()
    //   .duration(1000)
    //   .words(filteredData.map(function (d) { return { text: d.Words, size: d.Counts };}))
  })}


// stockCloud("AMZN",10)

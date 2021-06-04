function dataChanged(selection) {
  d3.select("#my_dataviz").selectAll("rect")
    stockCloud();
  
}

// Gets the width of text in pixels to create "impact boxes" around text in cloud to enable listening for user click events.
function getTextWidth(text, font) {
  var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  var context = canvas.getContext("2d");
  context.font = font;
  var metrics = context.measureText(text);
  return metrics.width;
}

stockCloud()

path = `../static/data/data.json`
// path when running from app.py,  otherwise just start with data.
// function stockCloud(stock_name,slice) {d3.json(`/stock-page/${stock_name}`).then(function(data) {
function stockCloud() {
  //clear the visualization and the list if existing
  d3.select("#my_dataviz").html("")
  d3.select("#my_datalist").html("")
  // get data and create wordcloud
  d3.json(`../static/data/data.json`).then(function (data) {
    // Promise Pending
    // const dataPromise = d3.json(`/stock-page/${stock_name}`);
    const dataPromise = d3.json(`../static/data/data.json`);
    console.log("Data Promise: ", dataPromise);

    //filter the data by POS
    // UserPOS = d3.select("#selPOS").node().value
    // if (UserPOS) {
    //   var filteredData = data.filter(record => record.POS === "ADJ")
    //   console.log(filteredData)
    // }
    // else {
    var filteredData = data.sort((a, b) => b.Counts - a.Counts).slice(0, 50)

    // create a linear scale to limit font size choices for the word cloud
    var wordSize = d3.scaleLinear()
      .domain(d3.extent(filteredData.map(d => d.Counts)))
      .range([12, 50])
// Create a list of possible colors for the words in the cloud.
      var colorList = ["Blue",
    "Red",
    "Maroon",
    // "Yellow",
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
  ]
    // set the dimensions and margins of the graph
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
      .words(filteredData.map(function (d) {
        return {
          text: d.Words,
          size: wordSize(d.Counts),
          pos: d.POS, links: d.links
        };
      }))
      .padding(2.5)        //space between words
      .rotate(function () { return ~~(Math.random() * 2) * 90; })
      .fontSize(function (d) { return d.size; })      // font size of words
      .on("end", draw);
    layout.start();
    console.log(filteredData)

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
        .style("fill", function (d) { return colorList[~~(Math.random() * colorList.length)]})
        .attr("stroke","black")
        .attr("stroke-width", 0.5)
        .attr("text-anchor", "start")
        .attr("dominant-baseline", "hanging") // to get rectangles and text to rotate same
        .style("font-family", "Impact")
        .attr("transform", function (d) {
          return "translate(" + [d.x, d.y]
            + ")rotate(" + d.rotate + ")";
        })
        .text(function (d) { return d.text; })
      console.log(words)
      svg
        .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("dot")
        .data(words)
        .enter().append("rect")
        .attr("width", function (d) { return 0.8 * getTextWidth(d.text, d.size + "pt Impact") })
        .attr("height", function (d) { return d.size })
        .style("opacity", 0)
        .attr("transform", function (d) {
          return "translate(" + [d.x, d.y]
            + ")rotate(" + d.rotate + ")";
        })
        .on("click", function (d) {
          d3.select("#my_datalist").html(
            `Word: ${d.text} <br>
            
            Occurrences: ${d.size}<br>
            Headlines: <br>`)
          // Part of Speech: ${d.pos}<br>

          Object.entries(d.links).forEach(([key, value]) => {
            var option = d3.select("#my_datalist").append("ul");
            var item = option.append("li");
            item.html(`<a href="https://${value}">${key} </a>`);
            // console.log(value)
          })
        })
    }
  })}


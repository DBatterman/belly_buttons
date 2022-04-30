function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    let samparr = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let filtsamp = samparr.filter(function(samp){
      return samp.id == sample}
    );
    // 5. Create a variable that filters the metadata array for the object with the desired sample number.
    let metaarr = data.metadata;
    
    let metafilt = metaarr.filter(function(meta){
      return meta.id == sample} 
    );
    console.log(metafilt);
    //  6. Create a variable that holds the first sample in the array.
    let firstsamp = filtsamp[0];  
    
    // // 7. Create a variable that holds the first sample in the metadata array.
    let metafirst = metafilt[0];

    // 8. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otuids = firstsamp.otu_ids;
    let otulabels = firstsamp.otu_labels;
    let sampval = firstsamp.sample_values;

    // Creating a sliced sample value variable for the bar chart.
    let sv2 = sampval.slice(0,10);
    sv2.reverse();

    // // 9. Create a variable that holds the washing frequency.
    let wash = metafirst.wfreq;

    // 10. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    let yticks = otuids.sort((a,b) => b.otu_ids - a.otu_ids).slice(0,10).map(elem => "OTU " + elem);
    yticks.reverse()

    // 11. Create the trace for the bar chart. 
    let trace1 = {
      x: sv2, 
      y: yticks,
      text: otulabels,
      type: "bar",
      orientation: "h"
    };

    let barData = [trace1];
    // 12. Create the layout for the bar chart. 
    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      paper_bgcolor: "lavender",
      font: { color: "darkblue", family: "Georgia" } 
    };
    // 13. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 14. Create the trace for the bubble chart.
    let trace2 = {
      x: otuids,
      y: sampval,
      text: otulabels,
      mode: "markers",
      marker: {
        color: otuids,
        size: sampval
      }
    };
    
    let bubbleData = [trace2];

    // 15. Create the layout for the bubble chart.
    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      showlegend: false,
      xaxis: {title: "OTU IDs"},
      paper_bgcolor: "lavender",
      font: { color: "darkblue", family: "Georgia" }  
    };

    // 16. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    
    // // // 17. Create the trace for the gauge chart.
    let trace3 = {
      domain: { x: [0,1], y: [0,1] },
      type: "indicator",
      mode: "gauge+number",
      value: wash,
      title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
      gauge: {
        axis: { range: [null, 10], tickwidth: 1, tickcolor: "black" },
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "yellowgreen" },
          { range: [8, 10], color: "green" }
        ],
      }
    };
    
    let gaugeData = [trace3];
    
    // // 18. Create the layout for the gauge chart.
    let gaugeLayout = { 
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "lavender",
      font: { color: "darkblue", family: "Georgia" }
    };

    // // 19. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
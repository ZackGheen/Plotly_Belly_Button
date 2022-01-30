function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
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

// // 1. Create the buildCharts function.
function buildCharts(sample) {
//   // 2. Use d3.json to load and retrieve the samples.json file 
   d3.json("samples.json").then((data) => {
//     // 3. Create a variable that holds the samples array. 
      var SamplesArray = data.samples;
//     // 4. Create a variable that filters the samples for the object with the desired sample number.
      var SampleId = SamplesArray.filter(sampleObj => sampleObj.id == sample);
//     //  5. Create a variable that holds the first sample in the array.
      var firstSample = SampleId[0];

      console.log(firstSample);


//     // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otuIDs = firstSample.otu_ids; 
      var otuLabels = firstSample.otu_labels;
      var sampleValues = firstSample.sample_values;
      //console.log(otuIDs);
      // console.log(otuLabels);

//     // 7. Create the yticks for the bar chart.
//     // Hint: Get the the top 10 otu_ids and map them in descending order  
//     //  so the otu_ids with the most bacteria are last. 

      var yticks = otuIDs.slice(0,10).reverse();
      var xticks = sampleValues.slice(0,10).reverse();
      var labels = otuLabels.slice(0,10).reverse();
    
      //console.log(yticks);

//     // 8. Create the trace for the bar chart. 
      var barData = {
        x: xticks,
        y: yticks,
        type: 'bar',
        orientation: 'h',
        text: labels,
        marker: {
          color: '#CF9FFF'
        }
   };

   var trace = [barData]

//     // 9. Create the layout for the bar chart. 
      var barLayout = {
        title: `<b>Top 10 Bacteria Cultures <br>for Subject ${sample}</b>`,
        yaxis: {type: 'category'},
        plot_bgcolor: "#605f75",
        paper_bgcolor: "#605f75",
        font: {
          size: 16,
          color: "#f7f7f7"
        }
      };
//     // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", trace, barLayout);
    
// BUBBLE CHART 
    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: yticks,
      y: xticks,
      text: labels,
      mode: 'markers',
      marker: {
        size: xticks,
        color: yticks,
        colorscale: [
          ['0.0', '#cd38e0'],
          ['0.111111111111', '#c25bcf'],
          ['0.222222222222', '#a068a6'],
          ['0.333333333333', '#c066a2'],
          ['0.444444444444', '#dd6497'],
          ['0.555555555556', '#f46585'],
          ['0.666666666667', '#ff6c6e'],
          ['0.777777777778', '#ff7b54'],
          ['0.888888888889', '#ff8f36'],
          ['1.0', '#ffa600']]
      },
     
    };
     
    var trace2 = [bubbleData];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: '<b>Bacteria Culture per Sample</b>',
      showlegend: false,
      plot_bgcolor: "#605f75",
      paper_bgcolor: "#605f75",
      font: {
        size: 16,
        color: "#f7f7f7"
      },
      height: 600,
      width: 1200,
      xaxis: {
        title: {
          text: 'OTU ID'
        }
      }
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", trace2, bubbleLayout); 

  //GAUGE GRAPHIC
  var metadata = data.metadata;
  // Filter the data for the object with the desired sample number
  var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
  var result = resultArray[0];
  // 3. Create a variable that holds the washing frequency.
  var wfreq = result.wfreq;
  console.log(wfreq);
   
  // 4. Create the trace for the gauge chart.
  var gaugeData = {
    domain: { x: [0, 1], y: [0, 1] },
	  value: wfreq,
	  title: { text: "<b>Wash Frequency</b> <br> Belly button washs per week" },
	  type: "indicator",
		mode: "gauge+number",
    gauge: {
      bar: { color: "#848fa3" },
      axis: { range: [null, 10] },
      steps: [
        { range: [0, 2], color: "#ffe5a8" },
        { range: [2, 4], color: "#f7d98d" },
        { range: [4, 6], color: "#efcd72" },
        { range: [6, 8], color: "#e6c155" },
        { range: [8, 10], color: "#d8b64f" }
      ]
    }
  };
    
  var trace3 = [gaugeData];

  // 5. Create the layout for the gauge chart.
  var gaugeLayout = { 
    width: 450, height: 350, margin: { t: 0, b: 0 }, plot_bgcolor: "#605f75",
    paper_bgcolor: "#605f75",
    font: {
      size: 16,
      color: "#f7f7f7"
    }
  };

  // 6. Use Plotly to plot the gauge data and layout.
  Plotly.newPlot("gauge", trace3, gaugeLayout);

   });
 }

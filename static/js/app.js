// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let meta=data.metadata; 
    //console.log(meta);
    // Filter the metadata for the object with the desired sample number
    let metasample= meta.filter(
      (samplenum) => samplenum.id == sample)[0];
    console.log(metasample)
    // Use d3 to select the panel with id of `#sample-metadata`
    let metadatasample = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata

    metadatasample.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
   
    Object.entries(metasample).forEach(([key, value]) => {
      metadatasample.append("p").text(`${key}: ${value}`)
  })
    


  })
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples=data.samples; 

    // Filter the samples for the object with the desired sample number
    let filteredsample= samples.filter(
      (samplenum) => samplenum.id == sample)[0];
    //let filteredsample= samples[0]; just for testing
    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids=filteredsample.otu_ids;
    let otu_labels=filteredsample.otu_labels;
    let sample_values=filteredsample.sample_values;
  
    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let trace = {
      x: sample_values.slice(0, 10).reverse(),
      y: otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse(),
      hovertext: otu_labels.slice(0, 10).reverse(),
      hoverinfo: "text",
      type: "bar",
      orientation: "h",
    };
    let bar_Data = [trace];
    //define layout for bar plot
    let bar_layout={
      title:"Top 10 Microbial Cultures Found",
      xaxis:{title: "sample values"},
      yaxix:{title: "otu ids"}
    };
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
   
    // Render the Bar Chart
    Plotly.newPlot("bar", bar_Data ,bar_layout)
  
  // Build a Bubble Chart
  var trace_buble = {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: 'markers',
    marker: {
      size: sample_values,
      color: otu_ids,
      colorscale: 'YlOrRd'
    }
  };
  
  var bubble_data = [trace_buble];
  
  var bubble_layout = {
    title: 'Bacteria Cultures by Sample',
    showlegend: false,
    xaxis: { title: "OTU IDs" },
    yaxis: { title: "Sample Values" },
    height: 600,
    width: 1200
  };
  
  Plotly.newPlot("bubble", bubble_data, bubble_layout);

    // Render the Bubble Chart
  
  
  
  });

}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
   
    let nameslist = data.names;
    
    // Use d3 to select the dropdown with id of `#selDataset`
    
    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
  const dropdownMenu = d3.select("#selDataset");
    nameslist.forEach((nameslist) => {
      dropdownMenu
      .append("option")
      .text(nameslist)
      .property("value", nameslist);
      

    });
    
    // Get the first sample from the list
    let samplename= dropdownMenu.property("value");
    let firstsample=nameslist[0];

    // Build charts and metadata panel with the first sample
   
    buildCharts(firstsample);
    buildMetadata(firstsample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  console.log(newSample);
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();

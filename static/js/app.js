/*-------------------------------------------------------
             Reading the belly button data
-------------------------------------------------------*/
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// initiating a new object that will include all data per subject
let organizedData = {};

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and create/ update page
d3.json(url).then(function(data) {
  console.log(data);
  createDropdown(data);
  processData(data); 
  d3.select("#sample-metadata").append("ul"); //this will add a list element to the meta data element
  d3.select("#sample-metadata").select("ul").style("list-style-type", "none"); // Use CSS to remove bullet points
  updatePage("940"); // this will initialize the page wth the first subject
}); 

/*-------------------------------------------------------
        Creating the drop down menu
-------------------------------------------------------*/
function createDropdown(data) {
    let selection = document.getElementById("selDataset");
    for (let i = 0; i < data.names.length; i++) {
        let option = document.createElement("option");
        option.value = data.names[i];
        option.text = data.names[i];
        selection.appendChild(option);
    }
}

/*-----------------------------------------------------------
    getting test subject id from drop down menu when clicked
 -----------------------------------------------------------*/
function optionChanged() {
    let selectedValue = d3.select("#selDataset").property("value");
    selectedValue = selectedValue.toString()
    updatePage(selectedValue);
}

/*-------------------------------------------------------
    Reorganizing the data to one object (for efficiency)
-------------------------------------------------------*/
function processData(data) {
    // iterating through the data to combine the data for each subject
    for (let i = 0; i < data.names.length; i++) {
        let subjectID = data.names[i];
        let metadata = data.metadata[i];
        let samplesData = data.samples[i];
        organizedData[subjectID] = {"metadata": metadata, "samplesData": samplesData};
    };
}
  
/*------------------------------------------------------------------------------------
    horizontal bar chart with a dropdown menu to display the top 10 OTUs found.
------------------------------------------------------------------------------------*/
// function to select top 10 OTU data
function selectTopTen(subjectData) {
    let idLabels = subjectData.otu_ids.slice(0,10).reverse();
    //adding the label OTC in front of the otu ids
    let barLabels = idLabels.map((label) => `OTU ${label}`)
    let barPlotValues = subjectData.sample_values.slice(0,10).reverse();
    let barHoverText = subjectData.otu_labels.slice(0,10).reverse();
    console.log(barPlotValues, barLabels, barHoverText) // printing to console to verify data
    return [barPlotValues, barLabels, barHoverText]; // returning an array of the three arrays needed to construct the bar chart
}

// function to set bar chart elements
function barChart(barData) { // he barData array contains the samples values, otu ids, otu labels
    let plotData = [{
        y: barData[1],
        x: barData[0],
        type: 'bar',
        orientation: 'h',
        text: barData[2],
        name: barData[2],
        marker: {
            color: 'rgba(54, 162, 235, 0.7)', 
            line: {
                color: 'rgba(54, 162, 235, 1)', 
                width: 1
            }
        }
    }];
    Plotly.newPlot("bar", plotData);
};

/*------------------------------------------------------------------------------------
    bubble chart
------------------------------------------------------------------------------------*/
// function to set bubble chart elements
function bubbleChart(subjectData) {
    // Setting data arrays
    let xValues = subjectData.otu_ids; // use x Values also for marker colors
    let yValues = subjectData.sample_values; // use y values also for marker size
    let textValues = subjectData.otu_labels;
    // Defining chart data
    var plotData = [{
        x: xValues,
        y: yValues,
        text: textValues,
        mode: 'markers',
        marker: {
          color: xValues,
          size: yValues
        }
      }];
    let layout = {
        xaxis: {
            title: 'OTU ID'
          },
        showlegend: false,
        height: 600,
        width: 1200
      };
    Plotly.newPlot("bubble", plotData, layout);
}

/*------------------------------------------------------------------------------------
    metadata display
------------------------------------------------------------------------------------*/
function metaData(subjectData) {
    // Removing all list items from the html element with the ID "sample-metadata"
    d3.select("#sample-metadata").selectAll("li").remove();
    // Creating an array of the list items 
    let displayItems = Object.entries(subjectData).map(([key, value]) => `${key}: ${value}`);
    // Add items to the <ul> element
    for (let i=0; i < displayItems.length; i++) {
        let ul = d3.select("#sample-metadata").select("ul")
        ul.append("li").text(displayItems[i]);
    };
}

/*------------------------------------------------------------------------------------
    gauge chart
------------------------------------------------------------------------------------*/


/*------------------------------------------------------------------------------------
       Update page 
------------------------------------------------------------------------------------*/
function updatePage(selectedValue) {
    let subjectData  = organizedData[selectedValue];
    // bar chart
    barChart(selectTopTen(subjectData.samplesData));
    // bubble chart
    bubbleChart(subjectData.samplesData);
    // metadata 
    metaData(subjectData.metadata);
};




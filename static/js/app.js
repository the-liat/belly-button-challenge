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
  createDashboard(); // this will use the global var organizedData
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
    console.log("Selected value: " + selectedValue);
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
        organizedData[subjectID] = Object.assign({}, metadata, samplesData);
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
    console.log(plotData) // printing to console to verify data
    return plotData;
};

/*------------------------------------------------------------------------------------
    bubble chart
------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------
    metadata display
------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------
    gauge chart
------------------------------------------------------------------------------------*/


/*-------------------------------------------------------
    Initiate first dashboard (selecting first subject)
-------------------------------------------------------*/
function createDashboard() {
    let subjectData  = organizedData["940"];
    // bar chart
    let plotData = barChart(selectTopTen(subjectData)); 
    Plotly.newPlot("bar", plotData);
    // bubble chart
    // metadata 
}
 
/*------------------------------------------------------------------------------------
       Update page 
------------------------------------------------------------------------------------*/
function updatePage(selectedValue) {
    let subjectData  = organizedData[selectedValue];
    // bar chart
    let plotData = barChart(selectTopTen(subjectData));
    Plotly.newPlot("bar", plotData);
    //Plotly.restyle("bar", plotData);
    // bubble chart
    // metadata 
}




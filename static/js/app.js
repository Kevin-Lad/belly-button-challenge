let url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

function demographics(id, allData) {
    let metaData = allData.metadata;
    let selectedMeta = metaData.filter(meta => meta.id == id)[0];
    console.log(selectedMeta);
   
    let panelBody = d3.select('.panel-body');
    panelBody.html('');

    // Make an h5 for each item
    for (let [key, value] of Object.entries(selectedMeta)) {
        console.log(key, value);
        let text = `${key}: ${value}`;
        panelBody.append('h5').text(text);
    }
}



function displayCharts(id) {
    
    console.log(id);

    d3.json(url).then(function(data){

        let samples = data.samples;

        // Filter the data to get sample_values, otu_ids and otu_labels for the selected ID

        let selectedSample = samples.filter(sample => sample.id == id);

        let otuIds = selectedSample[0].otu_ids;
        let otuLabels = selectedSample[0].otu_labels;
        let sampleValues = selectedSample[0].sample_values;

        // Slice the first 10 objects for plotting
        let slicedOtu = otuIds.slice(0,10);
        let slicedSample = sampleValues.slice(0,10);
        let slicedLabel = otuLabels.slice(0,10);

        let mappedOtu = slicedOtu.map(otuText => `OTU ${otuText}`).reverse();
        let mappedSample = slicedSample.reverse();
        let mappedLabel = slicedLabel.reverse();

        // Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
        // Trace for the bar chart

        let trace1 = {

            x: mappedSample,
            y: mappedOtu,
            hovertext: mappedLabel,
            type: 'bar',
            orientation : 'h'
        };
        
        // Data trace array
        let traceOtuIDs = [trace1];

        // Apply a title to the layout
        let layout1 = {
            title: 'Top 10 Bacteria Cultures Found'
        };

        // Render the plot to the div tag with id 'bar'
        Plotly.newPlot('bar', traceOtuIDs, layout1);

        // // Trace for the bubble chart
        let trace2 = {
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                color: otuIds,
                size: sampleValues,
                colorscale: 'Earth'
            },
            type : 'scatter'
        }

        // Data trace arrary
        let traceBubble = [trace2];

        // Render the plot to the div tag with id 'bubble'
        Plotly.newPlot('bubble', traceBubble);

        // Display the sample metadata, i.e., an individual's demographic information.
        // Display each key-value pair from the metadata JSON object somewhere on the page.

       demographics(id, data);
    });
}


function optionChanged(selectedId) {

    displayCharts(selectedId);
}


function init() {
    // Fetch the JSON data and console log it
    d3.json(url).then(function(data){
        console.log(data);

        // Fill the dropdown menu with all the IDs
        let dropDownMenu = d3.select('#selDataset');
        let ids = data.names;

        for (let i=0; i< ids.length; i++) {
            dropDownMenu.append('option').text(ids[i]).property('value', ids[i]);
        }
        
        let first_id = ids[0];

        displayCharts(first_id);

    });
}

init();
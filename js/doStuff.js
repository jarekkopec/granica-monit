google.charts.load('current');
google.charts.setOnLoadCallback(init);

function renderMap(array) {

    d3.json('js/woj.geojson')
    .then(function(data) {
        console.log(data);
        
        let projection = d3.geoMercator();
        projection.fitExtent([[0, 20], [500, 400]], data);
        
        let geoGenerator = d3.geoPath()
            .projection(projection);
        
        geoGenerator(data);

        let u = d3.select('#content g.map')
            .selectAll('path')
            .data(data.features)
            .join('path')
            .attr('d', geoGenerator)
            .classed('wojewodztwo', true);

        let points = d3.select('#content g.points')
            .selectAll('circle')
            .data(array)
            .enter().append('circle')
            .attr('cx', function(d) { return projection([d.lon, d.lat])[0]; })
            .attr('cy', function(d) { return projection([d.lon, d.lat])[1]; })
            .attr('r', 10)
            .attr('fill', 'red');
        
            // let points = d3.select('#content g.points')
            // .selectAll('circle')
            // .data(array)
            // .enter().append('circle')
            // .attr('cx', function(d) { return projection([d.lon, d.lat])[0]; })
            // .attr('cy', function(d) { return projection([d.lon, d.lat])[1]; })
            // .attr('r', 10)
            // .attr('fill', 'red');
    })

};

function processSheetsData(response) {
    var array = [];
    var data = response.getDataTable();
    var numberOfRows = data.getNumberOfRows();
    var numberOfColumns = data.getNumberOfColumns();
    console.log(numberOfRows);
    console.log(numberOfColumns);
    for (r=1; r<numberOfRows; r++) {
        row = {
            place_name: data.getFormattedValue(r, 0),
            lat: data.getFormattedValue(r, 1),
            lon: data.getFormattedValue(r, 2),
            status: data.getFormattedValue(r, 3)
        };
        
        array.push(row);
    }

    renderMap(array);
}

function init() {
  var url = 'https://docs.google.com/spreadsheets/d/1id8a5Hp8OCk9PSgoCY4b9mSOCZLJ_YgUW1bQHmaUGPI/edit?usp=sharing';
  var query = new google.visualization.Query(url);
  query.setQuery('select A, B, C, D, E, F, G, H');
  query.send(processSheetsData);
}
google.charts.load('current');
google.charts.setOnLoadCallback(init);


function renderPanel(event, d, shallClear) {
    if (!(shallClear)) {
        d3.select('#panel').html(
               '<table>'
                + '<tr><td>Przejście graniczne</td><td>' + d.place_name + '</td></tr>'
                + '<tr><td>Dojazd</td><td>' + d.dojazd + '</td></tr>>'
                + '<tr><td>Auta i kierowcy</td><td>' + d.auta_kierowcy + '</td></tr>'
                + '<tr><td>Wolontariusze</td><td>' + d.wolontariusze + '</td></tr>'
                + '<tr><td>Magazyny</td><td>' + d.magazyny + '</td></tr>'
            + '</table>'
        )
    }
    else {
        d3.select('#panel').html(
            'wybierz przejście graniczne'
        )
    }        
}


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
            .classed('point', true)
            .attr('cx', function(d) { return projection([d.lon, d.lat])[0]; })
            .attr('cy', function(d) { return projection([d.lon, d.lat])[1]; })
            .attr('r', 10)
            .attr('fill', 'red')
            // .on('mouseover', function(event, d) {  })
            .on('mouseover', function(event, d) {
                renderPanel(event, d, false);
                points.attr('opacity', 0.5);
                d3.select(this).attr('opacity', 1);
                }
            );
        
        let labels = d3.select('#content g.labels')
            .selectAll('text')
            .data(array)
            .enter().append('text')
            .attr('x', function(d) { return projection([d.lon, d.lat])[0] - 15; })
            .attr('y', function(d) { return projection([d.lon, d.lat])[1]; })
            .html(function (d) { return d.place_name })
            .attr('text-anchor', 'end');
        
        d3.selectAll('.point').on('mousover', function() {
            d3.selectAll('.point').attr('opcaity', 0.5);
            // d3.select(this).attr('opcaity', 1);
        })
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
            dojazd: data.getFormattedValue(r, 3),
            auta_kierowcy: data.getFormattedValue(r, 4),
            wolontariusze: data.getFormattedValue(r, 6),
            magazyny: data.getFormattedValue(r, 7),
            
        };
        
        array.push(row);
    }

    renderMap(array);
}

function init() {
  var url = 'https://docs.google.com/spreadsheets/d/1flnke1rf4VLH3aIDzexff5preObfFL66tPuylkCcsnI/edit?usp=sharing';
  var query = new google.visualization.Query(url);
  query.setQuery('select A, B, C, D, E, F, G, H');
  query.send(processSheetsData);
}
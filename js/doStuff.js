google.charts.load('current');
google.charts.setOnLoadCallback(init);


function composeLabel(d) {
    console.log(d.wolontariusze);
    let labelConent = '';
    if (d.auta_kierowcy == 1) {
        labelConent = '<tspan class="iconGrey">\ue84d</tspan>'
    } else if (d.auta_kierowcy == 2) {
        labelConent = '<tspan class="iconYellow">\ue84d</tspan>'
    } else if (d.auta_kierowcy == 3) {
        labelConent = '<tspan class="iconGrey">\ue84d</tspan>'
    }


    if (d.wolontariusze == 1) {
        labelConent += '<tspan class="iconGrey">&nbsp;\ue8a5</tspan>'
    } else if (d.wolontariusze == 2) {
        labelConent += '<tspan class="iconYellow">&nbsp;\ue8a5</tspan>'
    } else if (d.wolontariusze == 3) {
        labelConent += '<tspan class="iconRed">&nbsp;\ue8a5</tspan>'
    }

    if (d.magazyny == 1) {
        labelConent += '<tspan class="iconGrey">&nbsp;\ue844</tspan>'
    } else if (d.magazyny == 2) {
        labelConent += '<tspan class="iconYellow">&nbsp;\ue844</tspan>'
    } else if (d.magazyny == 3) {
        labelConent += '<tspan class="iconRed">&nbsp;\ue844</tspan>'
    }
    
    return labelConent;
}


function renderMap(array) {

    d3.json('js/woj.geojson')
    .then(function(data) {
        console.log(data);
        
        let projection = d3.geoMercator();
        projection.fitExtent([[0, 0], [350, 400]], data);
        
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
            .attr('r', 5);

        
        let labels = d3.select('#content g.labels')
            .selectAll('g.label')
            .data(array)
            .enter().append('g')
            .classed('label', true);
        
        let labelName = labels.append('text').text(function(d) { return d.place_name; })    
            .attr('x', function(d) { return projection([d.lon, d.lat])[0] - 10; })
            .attr('y', function(d) { return projection([d.lon, d.lat])[1] + 3; })
            .attr('text-anchor', 'end');
        
        let labelIcons = labels.append('text').html(function(d) { return composeLabel(d); })
            .attr('x', function(d) { return projection([d.lon, d.lat])[0] + 15; })
            .attr('y', function(d) { return projection([d.lon, d.lat])[1] + 3; });
        

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
        console.log(data.getFormattedValue(r, 0))
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
  var url = 'https://docs.google.com/spreadsheets/d/1id8a5Hp8OCk9PSgoCY4b9mSOCZLJ_YgUW1bQHmaUGPI/edit?usp=sharing';
  var query = new google.visualization.Query(url);
  query.setQuery('select A, B, C, D, E, F, G, H, I, J, K');
  query.send(processSheetsData);
}
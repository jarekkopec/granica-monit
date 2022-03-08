google.charts.load('current');
google.charts.setOnLoadCallback(init);


function composeLabelPolishSide(d) {
    let labelConent = '<tspan class="labelText">' + d.place_name + '</tspan>&nbsp;';
    if (d.autaKierowcy == 1) {
        labelConent += '<tspan class="iconGrey">\ue84d</tspan>'
    } else if (d.autaKierowcy == 2) {
        labelConent += '<tspan class="iconYellow">\ue84d</tspan>'
    } else if (d.autaKierowcy == 3) {
        labelConent += '<tspan class="iconRed">\ue84d</tspan>'
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

function composeLabelUkrainianSide(d) {
    let labelConent = '';
    if (d.zapchanieOgolne == 1) {
        labelConent += '<tspan class="iconGrey">\ue82b</tspan>'
    } else if (d.zapchanieOgolne == 2) {
        labelConent += '<tspan class="iconYellow">\ue82b</tspan>'
    } else if (d.zapchanieOgolne == 3) {
        labelConent += '<tspan class="iconRed">\ue82b</tspan>'
    }
    
    return labelConent;
}

function renderMap(array) {

    d3.json('js/woj.geojson')
    .then(function(data) {
        
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
        
        let labelPolishSide = labels.append('text').html(function(d) { return composeLabelPolishSide(d); })    
            .attr('x', function(d) { return projection([d.lon, d.lat])[0] - 10; })
            .attr('y', function(d) { return projection([d.lon, d.lat])[1] + 3; })
            .attr('text-anchor', 'end');
        
        let labelUkrainianSide = labels.append('text').html(function(d) { return composeLabelUkrainianSide(d); })
            .attr('x', function(d) { return projection([d.lon, d.lat])[0] + 15; })
            .attr('y', function(d) { return projection([d.lon, d.lat])[1] + 3; });
        
        let updateDatesArray = array;
        
        let updateDatesPoland = [];
        let updateDatesUkraine = [];
        
        for (i=0; i<array.length; i++) {
            updateDatesPoland.push(array[i].updatePolska);
            updateDatesUkraine.push(array[i].updateUkraina);
        }

        console.log(updateDatesPoland);
        console.log(updateDatesUkraine);
        
        // let updateData = d3.select('#updateDates')
        //     .append('p')
        //     .text(function(d) {

        //     })
        

    })

};

function processSheetsData(response) {
    var array = [];
    var data = response.getDataTable();
    var numberOfRows = data.getNumberOfRows();
    var numberOfColumns = data.getNumberOfColumns();
    for (r=0; r<numberOfRows; r++) {
        console.log(data.getFormattedValue(r, 0))
        row = {
            place_name: data.getFormattedValue(r, 0),
            lat: data.getFormattedValue(r, 1),
            lon: data.getFormattedValue(r, 2),
            dojazd: data.getFormattedValue(r, 3),
            autaKierowcy: data.getFormattedValue(r, 4),
            potrzebyMedyczne: data.getFormattedValue(r, 5),
            wolontariusze: data.getFormattedValue(r, 6),
            magazyny: data.getFormattedValue(r, 7),
            zapchanieOgolne: data.getFormattedValue(r, 8),
            updateUkraina: data.getFormattedValue(r, 11),
            updatePolska: data.getFormattedValue(r, 12)

        };
        
        array.push(row);
    }

    renderMap(array);
}

function init() {
  var url = 'https://docs.google.com/spreadsheets/d/1id8a5Hp8OCk9PSgoCY4b9mSOCZLJ_YgUW1bQHmaUGPI/edit?usp=sharing';
  var query = new google.visualization.Query(url);
  query.setQuery('select A, B, C, D, E, F, G, H, I, J, K, L, M');
  query.send(processSheetsData);
}
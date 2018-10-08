L.mapbox.accessToken = 'pk.eyJ1IjoicnVzc2x5b244IiwiYSI6IjBSaDVoeW8ifQ.UMzpeudvSJ3dHxAtKiakFg';
        var map = L.mapbox.map('map', null, {
			maxZoom:18,
			zoomControl: false}).setView([-13.163, -72.545], 15);
        var layers = {
            Streets: L.mapbox.tileLayer('mapbox.streets'),
            Outdoors: L.mapbox.styleLayer('mapbox://styles/russlyon8/ciwjh10yq000d2qo73t44eva0'),
            Satellite: L.mapbox.styleLayer('mapbox://styles/russlyon8/cioowi3rs001rbnnnsmkskehw')
        };

        layers.Outdoors.addTo(map);
        L.control.layers(layers).addTo(map);
        //add zoom control with your options
		L.control.zoom({
     		position:'topright'
		}).addTo(map);
        // Set CartoDB Username
        var cartoUserName = "redclayantony";
        
        // Add archaeologicalsites geojson from Carto
        var archSite = null;

        // sql query call on archaeological sites
        var sqlQueryArch = "SELECT * FROM archSiteMachu";

        // remove archsites if already loaded
        function showAll(){
         if(map.hasLayer(archSiteMachu)){
           map.removeLayer(archSiteMachu);
        }}
  
         //archIcon style
        var archIcon = L.icon({
            iconUrl: 'icons/archIcon2.svg',
            iconSize: [28,28],
            iconAnchor: [5,5],
            popupanchor: [0,-3]
        });

        // Get CartoDB selection as GEOJSON and Add to Map
        $.getJSON("https://"+cartoUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlQueryArch, function(data) {
            archSite = L.geoJson(data,{
                onEachFeature: function (feature, layer) {
                   layer.bindPopup(feature.properties.name);
                }, pointToLayer: function (feature, latlng) {
                    var marker = L.marker(latlng,{icon: archIcon});
                    return marker;
                }
            }).addTo(map);
        });

        // Add trailheadcusco.geojson
        var trailHead = null;
        
        // sql query on trailheads
        var sqlQueryTH = "SELECT * FROM trailheadscusco";

        // remove trailheads if already loaded
        function showAll(){
            if(map.hasLayer(trailheadscusco)){
                map.removeLayer(trailheadscusco);
            }}
  
       //archIcon
        var trailheadIcon = L.icon({
            iconUrl: 'icons/walker.svg',
            iconSize: [14,14],
            iconAnchor: [5,5],
            popupanchor: [0,-3]
        });

        // Get CartoDB selection as GEOJSON and Add to Map
        $.getJSON("https://"+cartoUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlQueryTH, function(data) {
            trailHead = L.geoJson(data,{
                onEachFeature: function (feature, layer) {
                    layer.bindPopup(feature.properties.name);
                }, pointToLayer: function (feature, latlng) {
                    var marker = L.marker(latlng,{icon: trailheadIcon});
                    return marker;
                }
            }).addTo(map);
        }); 
  
        // Add treksMachuGeo2.geojson
        var treksMachu = null;
            
        //event listener for mouseover   
        function highlightFeature(e) {
            var layer = e.target;

                layer.setStyle({
                    weight: 8,
                    color: '#7D26CD',
                    dashArray: ''
                });

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }
            info.update(layer.feature.properties);
            }

        function resetHighlight(e) {
            treksMachu.resetStyle(e.target);
            info.update();
        }

        //click listen zooms to feature
        function zoomToFeature(e) {
            map.fitBounds(e.target.getBounds());
        }

        // sql query on treksmachgeo2
        var sqlQueryInca = "SELECT * FROM treksmachugeo2_1";

        //machuTrek line style
        var trekStyle = {
            color: "#aa6e8e",
            weight: 3,
            opacity: 1,
            dashArray: "5"
        };

        // remove treksMachu if preloaded
        function showAll(){
            if(map.hasLayer(treksMachu)){
                map.removeLayer(treksMachu);
            }
        }
        // add listeners to treksmachu
        function onEachFeature(feature, layer){
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            });
        }
 
        // load treksmachu from carto and assign oneachfeature
        $.getJSON("https://"+cartoUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlQueryInca, function(data) {
            treksMachu = L.geoJson(data,{
                style: trekStyle,
                onEachFeature: onEachFeature
            }).addTo(map);
        });

        // Add sanctuarymp.geojson
        var sanctMachu = null;

        // sql query for machupicchu santuary
        var sqlQueryMachu = "SELECT * FROM sanctuarymp";

        //sanctMP style
        var sanctStyle = {
            color: "#659D32",
            fill: false,
            weight: 3,
            opacity: 0.7,
            dashArray: "1"
        };

        // remove if preloaded
        function showAll(){
            if(map.hasLayer(sanctuarymp)){
                map.removeLayer(sanctuarymp);
            }
        }
        // Get CartoDB selection as GEOJSON and Add to Map
        $.getJSON("https://"+cartoUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlQueryMachu, function(data) {
            sanctMachu = L.geoJson(data,{
                style: sanctStyle,
                onEachFeature: function (feature, layer) {
                    layer.bindPopup(feature.properties.label);
                    layer.cartodb_id=feature.properties.cartodb_id;
                }
            }).addTo(map);
        });
 
        // Custom Control Box  
        var info = L.control();

        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
            this.update();
            return this._div;
        };

        // method that we will use to update the control based on feature properties passed
        info.update = function (props) {
            this._div.innerHTML = '<h3>Trek Details: </h3>' +  (props ?
                '<b>' + props.name + '</b><br /><br />' +"Approx "+ props.length_km + ' km<br /><br />' +"Approx "+ props.length_mi + ' miles<br /><br />' +"Starts at: "+ props.startat + '<br /><br />' +"Ends at: "+ props.endat
            : '(Hover to see details)');
        };

        info.addTo(map);
  
        //Run showAll function when doc loads
        $( document ).ready(function() {
            showAll();
        });
		var sidebar = L.control.sidebar('sidebar').addTo(map);
		var gotocountry = function(c){
        // set new view 
         if(c=='mp')
         map.setView(new L.LatLng(-13.163, -72.545), 15);
	     if(c=='az')
         map.setView(new L.LatLng(-13.755, -71.24), 13);
         if(c=='sk')
         map.setView(new L.LatLng(-13.35, -72.55), 11.5);
		 if(c=='lr')
         map.setView(new L.LatLng(-13.22, -72.08), 12);
		 if(c=='cc')
         map.setView(new L.LatLng(-13.53, -71.97), 14);
		 if(c=='cq')
         map.setView(new L.LatLng(-13.425, -72.89), 13);
         return;
        
        
      };
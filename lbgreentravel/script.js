    		
            var bikeGeoJsonUrl = "https://opendata.arcgis.com/datasets/167bb084757842daa22a56023759c995_14.geojson";

            //Replace with your own token
            L.mapbox.accessToken = "pk.eyJ1Ijoib2N0b2RjIiwiYSI6ImNpeWRjZm0yNDAwMDUzMGs1Z3JyZmd2NXQifQ.Y8a2TFYzj-5Oy3hTVb9cfw";

            var map = L.mapbox.map('map', 'mapbox.streets', {maxZoom: 19,  minZoom: 9, zoomControl: false}).setView([33.81, -118.15], 12);
            
            var marker = L.marker(new L.LatLng(33.789930, -118.142429), {
                icon: L.mapbox.marker.icon({
                    "marker-color": "#0000ff",
                    "title": "where is bikeshare?",
                    "marker-symbol": "pitch",
                    "marker-size": "large"
                }),
                draggable: true,
                zIndexOffset: 999
            });

    		// every time the marker is dragged, update the coordinates container
            marker.on('dragend', ondragend);

            var coordinates = document.getElementById('coordinates');
            var currentPosition;
            var currentRadius = 0.5;

            function ondragend() {
    			    var m = marker.getLatLng();
    			    coordinates.innerHTML = 'Latitude: ' + m.lat + '<br />Longitude: ' + m.lng;
    			}

            L.control.fullscreen({position:'topright'}).addTo(map); 
            new L.Control.Zoom({position: 'topright'}).addTo(map); 
            L.control.locate({position: 'topright'}).addTo(map);

            L.mapbox.geocoderControl('mapbox.places', { autocomplete:true , position: 'topright'}).addTo(map);
           
            L.control.layers({ 
                                Streets: L.mapbox.tileLayer('mapbox.streets'),
                                Outdoors: L.mapbox.tileLayer('mapbox.outdoors'),
                                Dark: L.mapbox.tileLayer('mapbox.dark'),
                                Satellite: L.mapbox.tileLayer('mapbox.satellite')
                                },
                                {
                                LB_Basemap: L.tileLayer.wms('http://52.33.188.225:8080/geoserver/LongBeach/wms',
                                {
                                    format: 'image/png', 
                                    transparent: true,
                                    version: '1.1.0',
                                    layers:'LongBeach:LB_Basemap'

                                }),
                                Elevation: L.tileLayer.wms('http://52.33.188.225:8080/geoserver/LongBeach/wms',
                                {
                                    format: 'image/png', 
                                    transparent: true,
                                    version: '1.1.0',
                                    layers:'LongBeach:LB_DEM'
                                }),
                                Slope: L.tileLayer.wms('http://52.33.188.225:8080/geoserver/LongBeach/wms',
                                {
                                    format: 'image/png', 
                                    transparent: true,
                                    version: '1.1.0',
                                    layers:'LongBeach:lbslope'
                                }),
                                Major_Roads: L.tileLayer.wms('http://52.33.188.225:8080/geoserver/LongBeach/wms',
                                {
                                    format: 'image/png', 
                                    transparent: true,
                                    version: '1.1.0',
                                    layers:'LongBeach:major_streets'
                                }),
                                Bikeways: L.tileLayer.wms('http://52.33.188.225:8080/geoserver/LongBeach/wms',
                                {
                                    format: 'image/png', 
                                    transparent: true,
                                    version: '1.1.0',
                                    layers:'LongBeach:bikeways'
                                }),
                                Proposed_Bikeways: L.tileLayer.wms('http://52.33.188.225:8080/geoserver/LongBeach/wms',
                                {
                                    format: 'image/png', 
                                    transparent: true,
                                    version: '1.1.0',
                                    layers:'LongBeach:proposed_bikeways'
                                }),
                                Parks: L.tileLayer.wms('http://52.33.188.225:8080/geoserver/LongBeach/wms',
                                {
                                    format: 'image/png', 
                                    transparent: true,
                                    version: '1.1.0',
                                    layers:'LongBeach:parks'
                                }),
                                Points_Of_Interest: L.esri.dynamicMapLayer({ url:'http://tsdgis.longbeach.gov/webgis/rest/services/OPENDATA/MapItData/MapServer', opacity : 0.5}),
                                Tourist_Zones: L.tileLayer.wms('http://52.33.188.225:8080/geoserver/LongBeach/wms',
                                {
                                    format: 'image/png', 
                                    transparent: true,
                                    version: '1.1.0',
                                    layers:'LongBeach:touristZones'
                                })                            
                            }).addTo(map);

            var poi = L.esri.dynamicMapLayer({ url:'http://tsdgis.longbeach.gov/webgis/rest/services/OPENDATA/MapItData/MapServer', opacity : 0}).addTo(map);
            var identifiedFeature;
      		var pane = document.getElementById('selectedFeatures');

    		map.on('click', function (e) {
    						    pane.innerHTML = 'Loading';
    						    if (identifiedFeature){
    						      map.removeLayer(identifiedFeature);
    						    }
    						    poi.identify().on(map).at(e.latlng).run(function(error, featureCollection){
    						      // make sure at least one feature was identified.
    						      if (featureCollection.features.length > 0) {
    						        identifiedFeature = L.geoJSON(featureCollection.features[0]).addTo(map);
    						        var poiDescription =
    						          featureCollection.features[0].properties['NAME'] +
    						          ' - ' +
    						          featureCollection.features[0].properties['ADDRESS'];
    						        pane.innerHTML = poiDescription;
    						      }
    						      else {
    						        pane.innerHTML = 'No features identified.';
    						      }
    						    });
    						  });                
                                 

    	    // Since featureLayer is an asynchronous method, we use the `.on('ready' call to only use its marker data once we know it is actually loaded.
    		L.mapbox.featureLayer('https://opendata.arcgis.com/datasets/167bb084757842daa22a56023759c995_14.geojson').on('ready', function(e) {
    			    // The clusterGroup gets each marker in the group added to it
    			    // once loaded, and then is added to the map
    			    	var clusterGroup = new L.MarkerClusterGroup({
    			      // The iconCreateFunction takes the cluster as an argument and returns
    			      // an icon that represents it. We use L.mapbox.marker.icon in this
    			      // example, but you could also use L.icon or L.divIcon.
    			      iconCreateFunction: function(cluster) {
    			        return L.mapbox.marker.icon({
    			          // show the number of markers in the cluster on the icon.
    			          'marker-symbol': cluster.getChildCount(),
    			          'marker-color': '#422'
    			        })
    			      }
    			    });
    			    e.target.eachLayer(function(layer) {
    			        clusterGroup.addLayer(layer);
    			    });
    			    map.addLayer(clusterGroup);
    			});					

    		
            // create the initial directions object, from which the layer and inputs will pull data.
            var directions = L.mapbox.directions({
                                        profile: 'mapbox.cycling'
                                    });

            var directionsLayer = L.mapbox.directions.layer(directions).addTo(map);

            var directionsInputControl = L.mapbox.directions.inputControl('inputs', directions).addTo(map);

            var directionsErrorsControl = L.mapbox.directions.errorsControl('errors', directions).addTo(map);

            var directionsRoutesControl = L.mapbox.directions.routesControl('routes', directions).addTo(map);

            var directionsInstructionsControl = L.mapbox.directions.instructionsControl('instructions', directions).addTo(map);

            //FUNCTION FOR BIKE STATIONS
                                
            function bikehandleJson(data) {
                                    console.log(data)
                                    bikegeojsonLayer = new L.GeoJSON(data, {

                                        onEachFeature: onEachFeature,
                                    });
                                    bikegeojsonLayer.addData(data);
                                    map.addLayer(bikegeojsonLayer); 
                                    }

                       
            //Geocoder lookup
            var geocoder = L.mapbox.geocoder('mapbox.places-v1');
            
            //geolocation
            function getLocation() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(showPosition);
                }
            }

            function showPosition(position) {
                $('#findme').show();
                $('#geolocation-prompt').hide();
                currentPosition = [position.coords.latitude, position.coords.longitude];
            }

            function pointBuffer(pt, radius, units, resolution) {
                var ring = []
                var resMultiple = 360 / resolution;
                for (var i = 0; i < resolution; i++) {
                    var spoke = turf.destination(pt, radius, i * resMultiple, units);
                    ring.push(spoke.geometry.coordinates);
                }
                if ((ring[0][0] !== ring[ring.length - 1][0]) && (ring[0][1] != ring[ring.length - 1][1])) {
                    ring.push([ring[0][0], ring[0][1]]);
                }
                return turf.polygon([ring])
            }

            $.get(bikeGeoJsonUrl, function (data) {

                var fc = (data);

                //find me functionality
                $('#findme').on('click', function () {
                    marker.setLatLng(currentPosition);
                    map.setView(currentPosition, 15);
                    updateVenues();
                });

                //click-move functionality
                map.on('click', function (e) {
                    marker.setLatLng([e.latlng.lat, e.latlng.lng]);
                    map.setView([e.latlng.lat, e.latlng.lng], 15);
                    updateVenues();
                });

                //input search functionality
                $('fieldset input').keyup(function (event) {
                    var addrs = [];
                    var addrCoords = [];
                    var contents = $('fieldset input').val();
                    var url = 'https://api.tiles.mapbox.com/v4/geocode/mapbox.places/' + contents + '.json?access_token=' + L.mapbox.accessToken;

                    $.get(url, function (data) {
                        $('.result').remove();
                        data.features.forEach(function (result) {
                            var place = result['place_name'];
                            var reg = new RegExp(contents, "gi");

                            var dcplace = "Long Beach";
                            if (place.includes(dcplace)) {
                                place = place.replace(dcplace, "CA");
                                place = place.replace(", United States", "");
                                addrCoords.push(result.center);
                                addrs.push(place);
                                place = place.replace(reg, function (match) {
                                    return "<strong>" + match + "</strong>"
                                });

                                $('#search-results')
                                    .append('<div class="result keyline-bottom keyline-left keyline-right small">' + place + '</div>');
                            }
                        });
                        $('.result').each(function (index) {
                            var dcplace = "Long Beach";

                            $(this).on('click', function () {
                                var coords = addrCoords[index];
                                $('fieldset input').val(addrs[index]);

                                map.setView([coords[1], coords[0]], 15);
                                marker.setLatLng([coords[1], coords[0]]);
                                marker.addTo(map);
                                updateVenues();
                            })
                        })
                    })

                    if (event.keyCode == 13) {
                        geocoder.query(contents, showMap);
                        $('input').blur();
                    }

                });

                function showMap(err, data) {
                    map.setView([data.latlng[0], data.latlng[1]], 15);
                    marker.setLatLng([data.latlng[0], data.latlng[1]]);
                    updateVenues();
                }

                $('.leaflet-marker-draggable').on('mousewheel', function (event) {
                    var wheelDelta = event.originalEvent.wheelDeltaY;
                    if (currentRadius - wheelDelta * 0.001 >= 0.5 && currentRadius - wheelDelta * 0.001 <= 2) {
                        currentRadius = currentRadius - wheelDelta * 0.001;
                        updateVenues();
                        var distancePhrase;
                        switch (parseFloat(currentRadius.toFixed(2))) {
                            case 0.50:
                                distancePhrase = 'a half mile'
                                break;
                            case 1.00:
                                distancePhrase = 'a mile'
                                break;
                            case 2.00:
                                distancePhrase = 'two miles'
                                break;
                            default:
                                distancePhrase = currentRadius.toFixed(2) + ' miles'
                                break;
                        }
                        $('#distance').html(distancePhrase);
                    }

                    event.stopPropagation();
                    return false;
                });

                // get position, get radius, draw buffer, find within, calculate distances, find nearest, add to map
                function updateVenues() {
                    $('path').remove();
                    $('.leaflet-marker-pane *').not(':first').remove();
                    var position = marker.getLatLng();
                    var point = turf.point(position.lng, position.lat);

                    //draw buffer
                    var bufferLayer = L.mapbox.featureLayer().addTo(map);
                    var buffer = pointBuffer(point, currentRadius, 'miles', 120);
                    buffer.properties = {
                        "fill": "#00704A",
                        "fill-opacity": 0.2,
                        "stroke": "#00704A",
                        "stroke-width": 3,
                        "stroke-opacity": 0.4
                    };

                    bufferLayer.setGeoJSON(buffer);

                    var within = turf.featurecollection(fc.features.filter(function (shop) {
                        if (turf.distance(shop, point, 'miles') <= currentRadius) return true;
                    }));
                    $('#milecount').html(within.features.length);

                    function mileConvert(miles) {
                        if (miles <= 0.25) {
                            return (miles * 5280).toFixed(0) + ' ft'
                        } else {
                            return miles.toFixed(2) + ' mi'
                        }
                    }

                    within.features.forEach(function (feature) {
                        var distance = parseFloat(turf.distance(point, feature, 'miles'));
                        feature.properties["marker-color"] = "#6E6E6E";
                        feature.properties["title"] = '<span>' + mileConvert(distance) + '</span><br>Name: ' + feature.properties["TOC"] + '<br>Address: ' + feature.properties["ADDRESS"] + '<br>Number of Bikes: ' + feature.properties["NUMBER_OF_BIKES"] + '<br>Empty Docks: ' + feature.properties["NUMBER_OF_EMPTY_DOCKS"] + '<br><strong>Click for walking route</strong>';
                        feature.properties["marker-size"] = "medium";
                        feature.properties["marker-symbol"] = "bicycle";
                    })

                    var nearest = turf.nearest(point, fc);
                    var nearestdist = parseFloat(turf.distance(point, nearest, 'miles'));

                    nearest.properties["marker-color"] = "#C73E3E";
                    nearest.properties["title"] = '<span>' + mileConvert(nearestdist) + '</span><br>Name: ' + nearest.properties["TOC"] + '<br>Address: ' + nearest.properties["ADDRESS"] + '<br>Number of Bikes: ' + nearest.properties["NUMBER_OF_BIKES"] + '<br>Empty Docks: ' + nearest.properties["NUMBER_OF_EMPTY_DOCKS"] + '<br><strong>Click for walking route</strong>';
                    nearest.properties["marker-size"] = "large";
                    nearest.properties["marker-symbol"] = "bicycle";

                    var nearest_fc = L.mapbox.featureLayer().setGeoJSON(turf.featurecollection([within, nearest])).addTo(map);

                    // hover tooltips and click to zoom/route functionality
                    nearest_fc
                        .on('mouseover', function (e) {
                            e.layer.openPopup();
                        })
                        .on('mouseout', function (e) {
                            e.layer.closePopup();
                        })
                        .on('click', function (e) {

                            // assemble directions URL based on position of user and selected bike share
                            var startEnd = position.lng + ',' + position.lat + ';' + e.latlng.lng + ',' + e.latlng.lat;
                            var directionsAPI = 'https://api.tiles.mapbox.com/v4/directions/mapbox.walking/' + startEnd + '.json?access_token=' + L.mapbox.accessToken;

                            // query for directions and draw the path
                            $.get(directionsAPI, function (data) {
                                var coords = data.routes[0].geometry.coordinates;
                                coords.unshift([position.lng, position.lat]);
                                coords.push([e.latlng.lng, e.latlng.lat]);
                                var path = turf.linestring(coords, {
                                    "stroke": "#00704A",
                                    "stroke-width": 4,
                                    "opacity": 1
                                	});

                                $('.distance-icon').remove();
                                map.fitBounds(map.featureLayer.setGeoJSON(path).getBounds(), { padding: [100, 100] });
                                window.setTimeout(function () {
                                    $('path').css('stroke-dashoffset', 0)
                                    }, 400);
                                var duration = parseInt((data.routes[0].duration) / 60);
                                if (duration < 100) {
                                    	L.marker([coords[parseInt(coords.length * 0.5)][1], coords[parseInt(coords.length * 0.5)][0]], {
                                        	icon: L.divIcon({
                                            	className: 'distance-icon',
                                            	html: '<strong style="color:#00704A">' + duration + '</strong> <span class="micro">min</span>',
                                            	iconSize: [45, 23]
                                        		})
                                    	}).addTo(map);
                                	}
                          	  })
                        });
                }
                marker.on('drag', function () {
                    updateVenues();
                });
                updateVenues();
            });

            getLocation();
            marker.addTo(map);

            //open About This panel
            function openAbout() {
                $("#about").show();
                return false;
            }

            //close About This panel
            function closeAbout() {
                $("#about").hide();
                return false;
            }
(function (w,i,d,g,e,t,s) {w[d] = w[d]||[];t= i.createElement(g);
            t.async=1;t.src=e;s=i.getElementsByTagName(g)[0];s.parentNode.insertBefore(t, s);
          })(window, document, '_gscq','script','//widgets.getsitecontrol.com/92044/script.js');
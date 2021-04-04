<template>
    <div style="width: 100%; height: 100%">
        <div id="mymap" style="width: 100%; height: 100%"></div>
        <div class="global-stats pa-2" style="border-radius: 5px">
            <v-card>
                <v-card-title style="height: 50px; align-items: center; justify-content: center" class="pa-0">
                    GLOBAL STATS
                    <!-- <v-btn @click="mapCountries">Countries</v-btn> -->
                </v-card-title>
                <v-divider/>
                <v-card-text>
                    <v-simple-table v-if="globalStats">
                        <template v-slot:default>
                            <tbody>
                                <tr>
                                    <td style="height: 36px"> <v-icon class="mr-3">mdi-bug</v-icon>Coronavirus cases</td>
                                    <td style="color: #b30000; height:36px">{{globalStats.cases}}</td>
                                </tr>
                                <tr>
                                    <td style="height: 36px"> <v-icon class="mr-3">mdi-radioactive</v-icon>Deaths</td>
                                    <td style="color: #b30000; height:36px">{{globalStats.deaths}}</td>
                                </tr>
                                <tr>
                                    <td style="height: 36px"> <v-icon class="mr-3">mdi-refresh</v-icon>Recovered</td>
                                    <td style="color: green">{{globalStats.recovered}}</td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-card-text>
            </v-card>
        </div>
        <div class="chartData" v-if="isChart">
            <div style="width: 100%; height: 25px; text-align: end">
                <v-btn icon @click="isChart = false" color="white"><v-icon>mdi-arrow-collapse</v-icon></v-btn>
            </div>
            <chart style="width: 100%; height: 100%"/>
        </div>
        <v-btn v-if="!isChart" title="Open Chart" fab color="#fffff11" style="position: absolute; right: 10px; bottom: 50px" @click="isChart = true"><v-icon>mdi-arrow-expand-all</v-icon></v-btn>
        <div class="current-location pa-2" style="border-radius: 5px" v-if="currentLocation">
            <v-card>
                <v-card-title style="height: 50px; align-items: center; justify-content: center" class="pa-0">
                    {{currentLocation.location}}
                </v-card-title>
                <v-divider/>
                <v-card-text>
                    <v-simple-table >
                        <template v-slot:default>
                            <tbody>
                            <tr>
                                <td style="height:36px"> <v-icon class="mr-3">mdi-bug</v-icon>Confirmed</td>
                                <td style="color: #b30000; height:36px">{{currentLocation.confirmed}}</td>
                            </tr>
                            <tr>
                                <td style="height:36px"> <v-icon class="mr-3">mdi-radioactive</v-icon>Deaths</td>
                                <td style="color: #b30000; height:36px">{{currentLocation.dead}}</td>
                            </tr>
                            <tr>
                                <td style="height:36px"> <v-icon class="mr-3">mdi-refresh</v-icon>Recovered</td>
                                <td style="color: green; height:36px">{{currentLocation.recovered}}</td>
                            </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-card-text>
            </v-card>
        </div>
    </div>
</template>
<script>
    var map
    import chart from '@/assets/chart/chart.js';
    import turf  from "turf";
    import { Bar } from "vue-chartjs";
    export default {
        components: {
            chart
        },
        props: {
            source: String,
        },
        data: () => ({
            isChart: false,
            datacollection: undefined,
            currentLocation: undefined,
            listMarker: [],
            globalStats: undefined,
            drawer: null
        }),
        mounted() {
            map = new mapboxgl.Map({
                container: "mymap",
                style: {
                    version: 8,
                    sources: {
                        "raster-tiles": {
                            type: "raster",
                            tiles: [
                                "https://api.mapbox.com/styles/v1/anhphamskymap/ckaglokn00srq1imxsozwh98l/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYW5ocGhhbXNreW1hcCIsImEiOiJjazN1MDFzenIwOGk3M2VxbHQ4c2t3ZXNtIn0.1lpqYp_SodejP4Blwy9IoQ"
                            ],
                            tileSize: 256,
                            attribution: ""
                        }
                    },
                    layers: [
                        {
                            id: "simple-tiles",
                            type: "raster",
                            source: "raster-tiles",
                            minzoom: 0,
                            maxzoom: 22
                        }
                    ]
                },
                minZoom: 2
            })
            let hoveredStateId = null;
            map.on('load', function () {
                let countriesGEOM = require('../assets/style/test')
                // for (let i = 0; i < countriesGEOM.features.length; i++) {
                //     countriesGEOM.features[i].id = i + 1
                // }
            
                map.addSource('countries', {
                    'type': 'geojson',
                    'data': countriesGEOM
                });
                map.addLayer({
                    'id': 'country-fills',
                    'type': 'fill',
                    'source': 'countries',
                    'layout': {},
                    'paint': {
                        'fill-color': '#ffffff',
                        'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.5, 0]
                    }
                });
                map.addLayer({
                    'id': 'country-borders',
                    'type': 'line',
                    'source': 'countries',
                    'layout': {},
                    'paint': {
                    'line-color': '#e6e6e6',
                    'line-width': 2
                    }
                });
                map.on('mousemove', 'country-fills', function (e) {
                    if (e.features.length > 0) {
                        if (hoveredStateId) {
                            map.setFeatureState(
                                { source: 'countries', id: hoveredStateId },
                                { hover: false }
                            );
                        }
                        hoveredStateId = e.features[0].id;
                        map.setFeatureState({ source: 'countries', id: hoveredStateId },
                            { hover: true });
                    }
                });
                map.on('mouseleave', 'country-fills', function () {
                    if (hoveredStateId) {
                    map.setFeatureState(
                        { source: 'countries', id: hoveredStateId },
                        { hover: false }
                        );
                        }
                    hoveredStateId = null;
                });
            })
            map.on('click', 'country-fills', (e) => {
                if (e.features.length) {
                    let bbox = turf.bbox(e.features[0].geometry);
                    map.fitBounds(bbox)
                this.$emit('setCurrentLocation', e.features[0])
                }
            });
        },
        created() {
        },
        watch: {
        },
        methods: {
            mapCountries (data) {
                // let count = 0
                // let boundingBox = require('../assets/style/boundingboxCountries')
                // console.log(boundingBox);
                // let countriesGEOM = require('../assets/style/test')
                // console.log(countriesGEOM);
                // for (const key in boundingBox) {
                //     for (let i = 0; i < countriesGEOM.features.length; i++) {
                //         if (boundingBox[key][0].toUpperCase() === countriesGEOM.features[i].properties.ADMIN.toUpperCase()) {
                //         //    countriesGEOM.features[i].properties.ISO_A3 = key
                //         count = count +1
                //         }
                //     }
                // }
                // // console.log(JSON.stringify(countriesGEOM));
                // console.log(count);
            },
            getGlobalStatsData (data) {
                this.globalStats = data
                this.$vuetify.theme.dark = true
            },
            addDataToMap (data) {
                this.listMarker = data.forEach(val => {
                    new mapboxgl.Marker().setLngLat(val.lnglat).addTo(map);
                })
            },
            setLocation (data) {
                this.currentLocation = data
            },
            setCurrentLocation (data) {
                if (!this.currentLocation) {
                    this.currentLocation = data
                    if (data.bounds) {
                        map.fitBounds(data.bounds, {
                            padding: 20
                        })
                    } else {
                        map.flyTo({
                            zoom: 5,
                            center: data.lnglat,
                            essential: true // this animation is considered essential with respect to prefers-reduced-motion
                        });
                    }
                } else if (this.currentLocation.country_code !== data.country_code) {
                    this.currentLocation = data
                    if (data.bounds) {
                        map.fitBounds(data.bounds, {
                            padding: 20
                        })
                    } else {
                        map.flyTo({
                            zoom: 5,
                            center: data.lnglat,
                            essential: true // this animation is considered essential with respect to prefers-reduced-motion
                        });
                    }
                }  else {
                    this.currentLocation = undefined
                }
            }
        }
    }
</script>
<style>
    .global-stats {
        position: absolute;
        top: 10px;
        width: 350px;
        right: 10px;
        background-color: black;
    }
    .current-location {
        position: absolute;
        top: 10px;
        width: 350px;
        right: 380px;
        background-color: black;
    }
    .chartData {
        position: absolute;
        bottom: 0;
        right: 10px;
        width:95%;
        height: 300px;
        border: 1px solid red;
        background-color: black;
    }
    #bar-chart {
        height: 100% !important
    }
</style>

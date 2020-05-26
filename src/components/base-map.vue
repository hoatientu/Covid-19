<template>
    <div style="width: 100%; height: 100%">
        <div id="mymap" style="width: 100%; height: 100%"></div>
        <div class="global-stats pa-2" style="border-radius: 5px">
            <v-card>
                <v-card-title>
                    GLOBAL STATS
                </v-card-title>
                <v-divider/>
                <v-card-text>
                    <v-simple-table v-if="globalStats">
                        <template v-slot:default>
                            <tbody>
                                <tr>
                                    <td> <v-icon class="mr-3">mdi-bug</v-icon>Coronavirus cases</td>
                                    <td style="color: #b30000">{{globalStats.cases}}</td>
                                </tr>
                                <tr>
                                    <td> <v-icon class="mr-3">mdi-radioactive</v-icon>Deaths</td>
                                    <td style="color: #b30000">{{globalStats.deaths}}</td>
                                </tr>
                                <tr>
                                    <td> <v-icon class="mr-3">mdi-refresh</v-icon>Recovered</td>
                                    <td style="color: green">{{globalStats.recovered}}</td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-card-text>
            </v-card>
        </div>
        <div class="current-location pa-2" style="border-radius: 5px" v-if="currentLocation">
            <v-card>
                <v-card-title>
                    {{currentLocation.location}}
                </v-card-title>
                <v-divider/>
                <v-card-text>
                    <v-simple-table>
                        <template v-slot:default>
                            <tbody>
                            <tr>
                                <td> <v-icon class="mr-3">mdi-bug</v-icon>Confirmed</td>
                                <td style="color: #b30000">{{currentLocation.confirmed}}</td>
                            </tr>
                            <tr>
                                <td> <v-icon class="mr-3">mdi-radioactive</v-icon>Deaths</td>
                                <td style="color: #b30000">{{currentLocation.dead}}</td>
                            </tr>
                            <tr>
                                <td> <v-icon class="mr-3">mdi-refresh</v-icon>Recovered</td>
                                <td style="color: green">{{currentLocation.recovered}}</td>
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
    export default {
        props: {
            source: String,
        },
        data: () => ({
            currentLocation: undefined,
            listMarker: [],
            globalStats: undefined,
            drawer: null,
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
        },
        created() {
        },
        methods: {
            getGlobalStatsData (data) {
                this.globalStats = data
                this.$vuetify.theme.dark = true
            },
            addDataToMap (data) {
                this.listMarker = data.forEach(val => {
                    new mapboxgl.Marker().setLngLat(val.lnglat).addTo(map);
                })
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
        top: 280px;
        width: 350px;
        right: 10px;
        background-color: black;
    }
</style>

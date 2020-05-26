<template>
  <div style="height: 100%">
    <v-navigation-drawer
        style="background-color: black; overflow: hidden"
        v-model="drawer"
        app
        clipped
        width="350px"
    >
      <div class="d-flex flex-column">
        <v-card style="background-color: #222222bf; height: 100px" v-if="globalData" class=" mt-2 mb-2">
          <v-layout justify-center class="pt-3">
            <span style="font-size: 14px">Total comfirmed</span>
          </v-layout>
          <v-layout justify-center>
            <span style="font-size: 36px; color: red">{{globalData.cases}}</span>
          </v-layout>
        </v-card>
        <v-card style="background-color: #222222bf; overflow: auto" v-if="dataConfirm">
          <v-card-title style="font-size: 13px">
            Confirmed Cases by Country/Region/Sovereignty
          </v-card-title>
          <v-card-text>
            <v-list dense>
              <v-list-item v-bind:style="{'background-color' : currentLocation === item ? 'red' : ''}" v-for="item of dataConfirm" :key="item.country_code"
                           @click="getDataLocation(item)">
                <v-list-item-action>
                  <v-icon>mdi-home</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title><span v-bind:style="{'color' : currentLocation === item ? 'black' : 'red'}"
                                           class="mr-2">{{item.confirmed}}</span><span>{{item.location}}</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </div>
    </v-navigation-drawer>
    <v-app-bar
        app
        clipped-left
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>COVID-19</v-toolbar-title>
    </v-app-bar>
    <BaseMap ref="baseMap"/>
    <v-footer app>
      <span>&copy; 2020</span>
    </v-footer>
  </div>
</template>

<script>
    import BaseMap from './base-map.vue'

    export default {
        props: {
            source: String,
        },
        components: {BaseMap},
        data: () => ({
            currentLocation: undefined,
            globalData: undefined,
            dataConfirm: undefined,
            drawer: null,
        }),
        mounted () {
            this.getData()
        },
        created () {
            // let country = require('../assets/style/mapStyle')
            this.$vuetify.theme.dark = true
            setInterval(() => {
                this.getData()
            }, 5*1000*60)
        },
        methods: {
            getDataLocation(location) {
                if (!this.currentLocation) {
                    this.currentLocation = location
                } else if (this.currentLocation.country_code !== location.country_code) {
                    this.currentLocation = location
                }  else {
                    this.currentLocation = undefined
                }
                this.$refs.baseMap.setCurrentLocation(location)
            },
            getData() {
                let boundingBox = require('../assets/style/boundingboxCountries')
                axios.get('https://www.trackcorona.live/api/countries').then(res => {
                    let data = res.data.data
                    data.map(val => {
                        if (boundingBox[val.country_code.toUpperCase()]){
                            val.bounds = boundingBox[val.country_code.toUpperCase()][1]
                        }
                        val.lnglat = [val.longitude, val.latitude]
                    })
                    this.$refs.baseMap.addDataToMap(data)
                    data.sort((a, b) => {
                        let val1 = a.confirmed
                        let val2 = b.confirmed
                        return parseInt(val2) - parseInt(val1)
                    })
                    this.dataConfirm = data
                    axios.get('https://coronavirus-19-api.herokuapp.com/all').then(res => {
                        this.globalData = res.data
                        this.$refs.baseMap.getGlobalStatsData(this.globalData)
                    }).catch(er => {
                        console.log(er)
                    })
                }).catch(er => {
                    console.log(er)
                })
            }
        }
    }
</script>
<style>
</style>

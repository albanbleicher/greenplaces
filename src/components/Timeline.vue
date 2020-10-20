<template>
  <div style="height: 50vh">
    <!-- <l-map
      style="height: 100%; width: 100%"
      :zoom="zoom"
      :center="center"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @update:bounds="boundsUpdated"
      v-if='places'
    >
      <l-tile-layer :url="url"></l-tile-layer>

      <l-polygon v-for='(place,i) in places' :key="i" :lat-lngs="polygons[i]" @click='log(place.fields.nom_ev)' color="green">
      </l-polygon>
    </l-map> -->
    <input type="range" v-model="years" @change='updateMap' min="1900" max="2020"  step="10"> <label>Année : {{years}}</label>
    <div id="map" style="height:100%"></div>
  </div>
</template>

<script>
// import {LMap, LTileLayer, LPolygon} from 'vue2-leaflet';
import axios from 'axios'
import L from 'leaflet'
export default {
  components: {
    // LMap,
    // LTileLayer,
    // LPolygon
  },
  data() {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      zoom: 11.3,
      center: [48.857441913731854, 2.335502632266837],
      bounds: null,
      places: null,
      polygon: {
        latlngs: [
          [47.2263299, -1.6222],
          [47.21024000000001, -1.6270065],
          [47.1969447, -1.6136169],
          [47.18527929999999, -1.6143036],
          [47.1794457, -1.6098404],
          [47.1775788, -1.5985107],
          [47.1676598, -1.5753365],
          [47.1593731, -1.5521622],
          [47.1593731, -1.5319061],
          [47.1722111, -1.5143967],
          [47.1960115, -1.4841843],
          [47.2095404, -1.4848709],
          [47.2291277, -1.4683914],
          [47.2533687, -1.5116501],
          [47.2577961, -1.5531921],
          [47.26828069, -1.5621185],
          [47.2657179, -1.589241],
          [47.2589612, -1.6204834],
          [47.237287, -1.6266632],
          [47.2263299, -1.6222],
        ],
        color: 'green',
      },
      polygons: [],
      years:1900,
      map: {},
      data: {}
    }
  },
  async mounted() {
    this.map = L.map('map').setView(this.center, this.zoom)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map)
    this.data = await axios.get(
      'https://opendata.paris.fr/api/records/1.0/search/?dataset=espaces_verts&rows=2000'
    )
    this.updateMap()
  },
  methods: {
    async updateMap(){
      // L.clearShapes(this.map)
      document.querySelectorAll('path').forEach(item => item.remove())
      console.log(this.data)
      // this.places = await data.data.records.filter(place => );
    this.places = await this.data.data.records.filter(
      (place) =>
        place.fields.categorie !== "Jardin d'immeubles" &&
        place.fields.categorie !== 'Jardinet' &&
        place.fields.categorie !== 'Jardiniere' &&
        place.fields.categorie !== 'Terre-plein' &&
        place.fields.categorie !== 'Terrain de boules' &&
        place.fields.categorie !== 'Talus' &&
        place.fields.categorie !== 'Decoration' &&
        place.fields.categorie !== 'Cimetière' &&
        place.fields.categorie !== 'Mur vegetalises' &&
        place.fields.categorie !== 'Jardin partage' &&
        (parseInt(place.fields.annee_ouverture) <= this.years || place.fields.hasOwnProperty('annee_ouverture') === false)
    )
    console.log(this.places)
    this.places.forEach((element) => {
      if(element.fields.geom.type === 'MultiPolygon') {
        let multipolygon = [];
        element.fields.geom.coordinates[0].forEach((item) => {
          let array = []
          item.forEach(element => {
            let dot = [element[1], element[0]]
          array.push(dot)
          })
          multipolygon.push(array)
        })
        L.polygon(multipolygon).addTo(this.map);

      }
      else {
        let polygon = []
      element.fields.geom.coordinates[0].forEach((item) => {
        let dot = [item[1], item[0]]
        polygon.push(dot)
      })
      L.polygon(polygon).addTo(this.map);
      }
    })
    } 
}
}
</script>

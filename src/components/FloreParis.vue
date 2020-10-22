<template>
  <div class="flore">
    <div class="sub">
      <h2>La flore de Paris</h2>
      <p>
        Cliquer sur les flêches du slider des familles d’arbre les plus
        rencontrées dans les parcs de Paris sur les années 1830 à 2020 pour en
        apprendre plus.
      </p>
    </div>
    <div class="navigate-trees">
      <div class="back">
        <transition name="fade">
          <img
            @click="tree = 'Platanus'"
            v-if="tree === 'Aesculus'"
            src="@/assets/icons/arrow-left.svg"
            alt="Passé"
          />
        </transition>
      </div>
      <div class="label">{{ tree }}</div>
      <div class="next">
        <transition name="fade">
          <img
            
            @click="tree = 'Aesculus'"
            v-if="tree === 'Platanus'"
            src="@/assets/icons/arrow-right.svg"
            alt="Passé"
          />
        </transition>
      </div>
    </div>
            
        <p v-if="tree === 'Aesculus'" class="sub-info"><img :src="require('@/assets/leaf.svg')" alt="Leaf">Plus de {{qt_aesculus}} arbres compris dans cette famille</p>
        <p v-if="tree === 'Platanus'" class="sub-info"><img :src="require('@/assets/leaf.svg')" alt="Leaf">Plus de {{qt_platanus}} arbres compris dans cette famille</p>

    <div class="platanus">

      <transition name="fade">
          <div class="infos-tree" v-if="stat_aesculus.length && tree === 'Platanus'">
        <ul class="circ-infos">
          <li>Circonférence minimum <span>{{stat_platanus[0][0].toPrecision(3)}} cm</span></li>
          <li>Circonférence moyenne <span>{{stat_platanus[0][1].toPrecision(3)}} cm</span></li>
          <li>Circonférence maximum <span>{{stat_platanus[0][2].toPrecision(8)}} cm</span></li>
        </ul>
        <ul class="hauteur-infos">
          <li>Hauteur minimum <span>{{stat_platanus[1][0].toPrecision(3)}} m</span></li>
          <li>Hauteur moyenne <span>{{stat_platanus[1][1].toPrecision(3)}} m</span></li>
          <li>Hauteur maximum <span>{{stat_platanus[1][2].toPrecision(3)}} m</span></li>
        </ul>

      </div>
      </transition>
      <transition name="fade">
          <div class="infos-tree" v-if="stat_aesculus.length && tree === 'Aesculus'">
        <ul class="circ-infos">
          <li>Circonférence minimum <span>{{stat_aesculus[0][0].toPrecision(3)}} cm</span></li>
          <li>Circonférence moyenne <span>{{stat_aesculus[0][1].toPrecision(3)}} cm</span></li>
          <li>Circonférence maximum <span>{{stat_aesculus[0][2].toPrecision(8)}} cm</span></li>
        </ul>
        <ul class="hauteur-infos">
          <li>Hauteur minimum <span>{{stat_aesculus[1][0].toPrecision(3)}} m</span></li>
          <li>Hauteur moyenne <span>{{stat_aesculus[1][1].toPrecision(3)}} m</span></li>
          <li>Hauteur maximum <span>{{stat_aesculus[1][2].toPrecision(3)}} m</span></li>
        </ul>
      </div>
      </transition>
      <transition name="fade">
      <canvas v-show="tree === 'Platanus'" id="platane"></canvas>
      </transition>
      <transition name="fade">
      <canvas v-show="tree === 'Aesculus'" id="aesculus"></canvas>
        
      </transition>

    </div>
  </div>
</template>
<script>
import axios from 'axios'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default {
  data() {
    return {
      tree: 'Platanus',
      stat_platanus: [],
      stat_aesculus: [],
      qt_platanus:0,
      qt_aesculus:0
    }
  },
  async mounted() {
    // console.log(this.data)
    this.addPlatane()
    this.addAesculus()
    await this.loadDataPlatane()
    await this.loadDataAesculus()
  },
  methods: {
    addAesculus() {
      var self = this;
      // move the rock
      const canvas = document.querySelector('#aesculus')
      let time = 0
      let scene = new THREE.Scene()
      let camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      var renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
      })
      renderer.setClearColor(0x000000, 0)
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)

      let manager = new THREE.LoadingManager()
      let textureLoader = new THREE.TextureLoader(manager)
      const loader = new GLTFLoader()
      let model
      let feuille = textureLoader.load('/feuille.png')
      let material_feuille = new THREE.MeshBasicMaterial({
        map: feuille,
      })
      let wood = textureLoader.load('/bois.png')
      let material_wood = new THREE.MeshBasicMaterial({
        map: wood,
      })
      let flower = textureLoader.load('/flower.png')
      let material_flower = new THREE.MeshBasicMaterial({
        map: flower,
      })
      let cht = textureLoader.load('/chataigne.png')
      let material_cht = new THREE.MeshBasicMaterial({
        map: cht,
      })

      loader.load('/bloom.glb', (gltf) => {
        // called when the resource is loaded
        // pointing Mesh
        model = gltf.scene
        // Overiding Material
        model.children[5].material = material_wood
        model.children[5].children.forEach((item) => {
          if (item.name.includes('Cube')) {
            item.material = material_feuille
          }
          if (item.name.includes('Sphere') || item.name.includes('MBall')) {
            item.material = material_cht
            item.material.side = THREE.DoubleSide
          }
          if (
            item.name.includes('Cube.001_1') ||
            item.name.includes('Cube002') ||
            item.name.includes('Cube003') ||
            item.name.includes('Cube004')
          ) {
            item.material = material_flower
          }
        })

        model.position.y = -40
        model.position.x = -15
        model.scale.x = 22
        model.scale.y = 22
        model.scale.z = 22
        // Add to scene
        scene.add(model)
      })
      window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(window.devicePixelRatio)
      })

      camera.position.z = 80
      camera.position.y = 18

      // à chaque image : 60fps
      const update = () => {
        requestAnimationFrame(update)
        time += 0.009
        if (model) {
            model.rotation.y = time;
        }

        // Render WebGL Scene
        renderer.render(scene, camera)
      }
      requestAnimationFrame(update)
    },
    addPlatane() {
      var self = this;
      // move the rock
      const canvas = document.querySelector('#platane')
      let time = 0
      let scene = new THREE.Scene()
      let camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      var renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
      })
      renderer.setClearColor(0x000000, 0)
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)

      let manager = new THREE.LoadingManager()
      let textureLoader = new THREE.TextureLoader(manager)
      const loader = new GLTFLoader()
      let model
      let feuille = textureLoader.load('/feuille.png')
      let material_feuille = new THREE.MeshBasicMaterial({
        map: feuille,
      })
      let wood = textureLoader.load('/bois.png')
      let material_wood = new THREE.MeshBasicMaterial({
        map: wood,
      })
      let flower = textureLoader.load('/flower.png')
      let material_flower = new THREE.MeshBasicMaterial({
        map: flower,
      })
      let cht = textureLoader.load('/chataigne.png')
      let material_cht = new THREE.MeshBasicMaterial({
        map: cht,
      })

      loader.load('/platane.glb', (gltf) => {
        // called when the resource is loaded
        // pointing Mesh
        model = gltf.scene
        // Overiding Material
         // Add to scene
        
        let pointLight = new THREE.PointLight(0xffffff, 5)
        pointLight.position.x = -20
        pointLight.position.y = 20
        scene.add(pointLight)

        let ambientLight = new THREE.AmbientLight(0x111111)
        scene.add(ambientLight)
        model.children[4].material = material_wood
        model.children[4].geometry.attributes.position.count=33
        model.children[5].material = material_feuille
     

        model.position.y =200
        model.position.x = -15
        model.scale.x = 22
        model.scale.y = 22
        model.scale.z = 22
        // Add to scene
        scene.add(model)
        console.log(model)
      })
      window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(window.devicePixelRatio)
      })

      camera.position.z = 700
      camera.position.y = -20

      // à chaque image : 60fps
      const update = () => {
        requestAnimationFrame(update)
        time += 0.01
        if (model) {
            model.rotation.y = time;
        }

        // Render WebGL Scene
        renderer.render(scene, camera)
      }
      requestAnimationFrame(update)
    },
    async loadDataPlatane() {
        var self = this;
      let data_platanus = await axios.get(
        'https://opendata.paris.fr/api/records/1.0/search/?dataset=les-arbres&q=&rows=10000&facet=typeemplacement&facet=domanialite&facet=arrondissement&facet=libellefrancais&facet=genre&facet=espece&facet=varieteoucultivar&facet=circonferenceencm&facet=hauteurenm&facet=stadedeveloppement&facet=remarquable&refine.genre=Platanus'
      )
      self.qt_platanus = data_platanus.data.nhits
     console.log(self.qt_platanus)
      let circ_platanus = []
      let sum_circ_platanus = 0;
      let ht_platanus = []
      let sum_ht_platanus = 0;
      data_platanus.data.records.forEach((tree, i) => {
        if (
          tree.fields.circonferenceencm &&
          tree.fields.circonferenceencm > 0
        ) {
          circ_platanus.push(tree.fields.circonferenceencm)
          sum_circ_platanus += tree.fields.circonferenceencm
        }
          if (
          tree.fields.hauteurenm &&
          tree.fields.hauteurenm > 0 &&
          tree.fields.hauteurenm <46
        ) {
          ht_platanus.push(tree.fields.hauteurenm)
          sum_ht_platanus += tree.fields.hauteurenm
        }
      })
     console.log(ht_platanus)
      self.stat_platanus= [
          [Math.min.apply(Math, circ_platanus),sum_circ_platanus / circ_platanus.length,Math.max.apply(Math, circ_platanus)],
          [Math.min.apply(Math, ht_platanus),sum_ht_platanus / ht_platanus.length,Math.max.apply(Math, ht_platanus)]]
        console.log(self.stat_platanus)
    },
    async loadDataAesculus() {
        var self = this;
      let data_aesculus = await axios.get(
        'https://opendata.paris.fr/api/records/1.0/search/?dataset=les-arbres&q=&facet=typeemplacement&facet=domanialite&rows=10000&facet=arrondissement&facet=libellefrancais&facet=genre&facet=espece&facet=varieteoucultivar&facet=circonferenceencm&facet=hauteurenm&facet=stadedeveloppement&facet=remarquable&refine.genre=Aesculus'
      )
      self.qt_aesculus = data_aesculus.data.nhits
      let circ_aesculus = []
      let sum_circ_aesculus = 0;
      let ht_aesculus = []
      let sum_ht_aesculus = 0;
      data_aesculus.data.records.forEach((tree, i) => {
        if (
          tree.fields.circonferenceencm &&
          tree.fields.circonferenceencm > 0
        ) {
          circ_aesculus.push(tree.fields.circonferenceencm)
          sum_circ_aesculus += tree.fields.circonferenceencm
        }
          if (
          tree.fields.hauteurenm &&
          tree.fields.hauteurenm > 0 &&
          tree.fields.hauteurenm <46
        ) {
          ht_aesculus.push(tree.fields.hauteurenm)
          sum_ht_aesculus += tree.fields.hauteurenm
        }
      })
     console.log(ht_aesculus)
      self.stat_aesculus= [
          [Math.min.apply(Math, circ_aesculus),sum_circ_aesculus / circ_aesculus.length,Math.max.apply(Math, circ_aesculus)],
          [Math.min.apply(Math, ht_aesculus),sum_ht_aesculus / ht_aesculus.length,Math.max.apply(Math, ht_aesculus)]]
        console.log(self.stat_aesculus)
    },
    
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
}
</script>
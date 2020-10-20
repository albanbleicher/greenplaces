<template>
  <div class="home">
    <div class="headline">
      <canvas class="rock"></canvas>
      <div class="headline-content">
        <h1>Green places</h1>
      <p>Walk barefoot in the city</p>
      </div>
    </div>
    <div class="timeline">
      <Timeline/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Timeline from '@/components/Timeline.vue'
export default {
  name: 'Home',
  components: {
    Timeline
  },
  mounted() {
    // move the rock
    const canvas = document.querySelector('.rock')
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
      alpha: true 
    })
    renderer.setClearColor( 0x000000, 0 );
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)


let manager = new THREE.LoadingManager();
let textureLoader = new THREE.TextureLoader(manager)
const loader = new GLTFLoader();
let model;
let texture = textureLoader.load('/rock.jpg')
let material = new THREE.MeshBasicMaterial({
   map: texture,
})

loader.load(
   '/untitled.glb',
   (gltf) => {
       // called when the resource is loaded
       console.log(gltf);

       // pointing Mesh
       model = gltf.scene.children[0]
       // Overiding Material
       model.material = material
       console.log(model);
        model.position.y=0;
        model.scale.x=5.2
        model.scale.y=5.2
        model.scale.z=5.2
       // Add to scene
       scene.add(model);
       let pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.x = -20
pointLight.position.y = 20
scene.add(pointLight);

let ambientLight = new THREE.AmbientLight(0x111111)
scene.add(ambientLight);
   },
);
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

})


camera.position.z = 20

// à chaque image : 60fps
const update = () => {
   requestAnimationFrame(update)
    time+= 0.001
    model.rotation.y = time;
    model.rotation.z = time;

   // Render WebGL Scene
   renderer.render(scene, camera);
}
requestAnimationFrame(update)
  },
}
</script>

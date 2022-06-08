import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

const gltfloader = new GLTFLoader()

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
// const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );

// Materials
// const material = new THREE.MeshBasicMaterial()
// material.color = new THREE.Color(0xff0000)

// Mesh
// const sphere = new THREE.Mesh(geometry, material)
// scene.add(sphere)

let tl = gsap.timeline()

/**
 * Influences
 */
let influences;


/**
 * Sizes
 */
 const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Loaders
 */
const ktx2Loader = new KTX2Loader()
    .setTranscoderPath( '/' ) // ../node_modules/three/examples/js/libs/basis/ with copy-webpack-plugin
    .detectSupport( renderer )


gltfloader
    .setKTX2Loader( ktx2Loader )
    .setMeshoptDecoder( MeshoptDecoder )
    .load('cube.gltf', (gltf) => {
        console.log(gltf)

        gltf.scene.scale.set(0.6, 0.6, 0.6)

        scene.add(gltf.scene)

        gui.add(gltf.scene.rotation, 'x').min(0).max(9)
        gui.add(gltf.scene.rotation, 'y').min(0).max(9)
        gui.add(gltf.scene.rotation, 'z').min(0).max(9)

        const mesh = gltf.scene.children[0]

        influences = mesh.morphTargetInfluences;

        for ( const [ key, value ] of Object.entries( mesh.morphTargetDictionary ) ) {
            gui.add( influences, value, 0, 1, 0.01 )
                .name( key.replace( 'blendShape1.', '' ) )
                .listen( influences );
        }

        tl.to(gltf.scene.rotation, {y: -0.3, duration: 0.7})
        tl.to(gltf.scene.rotation, {y: 0.3, duration: 0.7})
        tl.to(gltf.scene.rotation, {y: -0.2, duration: 1})
    })


// Lights
const pointLight = new THREE.AmbientLight(0xffffff, 1)
pointLight.position.x = 0
pointLight.position.y = 0
pointLight.position.z = 1
scene.add(pointLight)


window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 3
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // sphere.rotation.y = .5 * elapsedTime


    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}


tick()
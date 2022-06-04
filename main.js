import * as THREE from 'three'
import {gsap} from 'gsap'
import { Lethargy } from 'lethargy'
import Hammer from 'hammerjs'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import GUI from 'lil-gui'
import './style.css'
import { DoubleSide } from 'three'


// /*--------------------
// Options
// --------------------*/
const opts = {
  body:{
    background: '#000000'
  },
  light1: {
    x: 1,
    y: 4,
    z: 1,
    color: '#ff0000',
    intensity: 1
  },
  sphere: {
    damping: 0.01,
    color: '#ffffff'
  }
}


// /*--------------------
// Renderer
// --------------------*/
const renderer = new THREE.WebGLRenderer({
  canvas:document.querySelector('#canvas'),
  antialias:true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio)


// // /*------------------------------
// // Shadows
// // ------------------------------*/
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap


// // /*--------------------
// // Camera
// // --------------------*/
const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight,0.01,100);
camera.position.z = 4
camera.position.y = 1
camera.lookAt(0,0,0)

// // /*--------------------
// // Scene
// // --------------------*/
const scene = new THREE.Scene();

// // /*--------------------
// // Light
// // --------------------*/
const light = new THREE.AmbientLight( '#000000', 0.1 );
// soft white light
scene.add( light );

const light1 = new THREE.DirectionalLight( 0x222222, 0.9 )
light1.castShadow = true
light1.position.set( 10, 3, 50 )
scene.add( light1 )

// // /*--------------------
// // Resize
// // --------------------*/
function handleResize(){
  camera.aspect = window.innerWidth/window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth,window.innerHeight)
}
window.addEventListener('resize', handleResize)


// // /*--------------------
// // GUI
// // --------------------*/
// // // const gui = new GUI()

// // // const bgGui = gui.addFolder('bg')
// // // bgGui.addColor(opts.body, 'background').onChange(value=>{
// // //   scene.background = new THREE.Color(value)
// // // })


// // // const lightGui = gui.addFolder('Light')
// // // lightGui.add(opts.light1, 'x', -10, 10).onChange( 
// // //   (value) => {
// // //     light1.position.x = value
// // //   } );
// // // lightGui.add(opts.light1, 'y', -10, 10).onChange( 
// // //   (value) => {
// // //     light1.position.y = value
// // //   } );

// // // lightGui.add(opts.light1, 'z', -10, 10).onChange( 
// // //   (value) => {
// // //     light1.position.z = value
// // //   } );
// // // lightGui.addColor(opts.light1, 'color').onChange( 
// // //   (value) => {
// // //     light1.color = new THREE.Color(value)
// // //   } );


// //   /*--------------------
// // Sphere
// // --------------------*/
const sphereGeo = new THREE.SphereGeometry(1, 22, 22)
const sphereMat = new THREE.MeshToonMaterial({
  color: new THREE.Color(0xffffff),
})
const sphere = new THREE.Mesh(sphereGeo, sphereMat)
sphere.castShadow = true
sphere.receiveShadow = true
sphere.rotation.x = -0.2
scene.add(sphere)

const count = sphereGeo.attributes.position.count;
const position_clone = JSON.parse(JSON.stringify(sphereGeo.attributes.position.array));
const normals_clone = JSON.parse(JSON.stringify(sphereGeo.attributes.normal.array));




// // /*--------------------
// // Animate
// // --------------------*/
function animate(){
  const now = Date.now() / 200
  for (let i = 0; i < count; i++)
  {
    const uX = sphereGeo.attributes.uv.getX(i) * Math.PI * 10;
    const uY = sphereGeo.attributes.uv.getY(i) * Math.PI * 10;

    const xangle = (uX + now + 1)
    const xsin = Math.sin(xangle) * opts.sphere.damping
    const yangle = (uY + now + 1)
    const ycos = Math.cos(yangle) * opts.sphere.damping

    const ix = i * 3
    const iy = i * 3 + 1
    const iz = i * 3 + 2

    sphereGeo.attributes.position.setX(i, position_clone[ix] + normals_clone[ix] * (xsin + ycos))
    sphereGeo.attributes.position.setY(i, position_clone[iy] + normals_clone[iy] * (xsin + ycos))
    sphereGeo.attributes.position.setZ(i, position_clone[iz] + normals_clone[iz] * (xsin + ycos))

    sphereGeo.computeVertexNormals();
    sphereGeo.attributes.position.needsUpdate = true;
  }
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

animate()

let cambia = false

const scroll = () => {
  cambia = !cambia
  if(cambia)
  {
    gsap.to(opts.sphere,{
      damping: 0.035,
    })
  }
  else
  {
    gsap.to(opts.sphere,{
      damping: 0.01
    })
  }
}





const lethargy = new Lethargy()
let isSliding = false
let firstScroll = false
let index = 0

// window.addEventListener('mousemove', onMouseMove, false );
const content = document.querySelector('.contents');
const materia = document.querySelectorAll('.div');
const title = document.querySelector('.presentation');
const page = document.querySelector('.page');
let name = document.querySelectorAll('.name');
name[0].classList.add('show')
let position = 27.2
let titlePosition = 50
let detail = false
gsap.set(content,{
  x:position+'%',
})



window.addEventListener('wheel', (e) =>{
  
  if(lethargy.check(e) !== false){
    if(detail==true)return
    if (isSliding)return
    if(e.deltaY < -10)
    {
      if(position>=13.)return
      titlePosition  = titlePosition - 20
        let animazioneTesto = gsap.to(title,{
          transform: 'translateY(-'+titlePosition+'%)',
          ease: 'Power4.EaseOut'
        })
        animazioneTesto.duration(0.7)

      isSliding = true
      materia.forEach(element => {
        let skewAnimaton = gsap.to(element,{
          transform: 'skew(-10deg)',
        })
        skewAnimaton.duration(0.6)
        skewAnimaton.reverse(0.5)
      });
      
      // scroll()
      position += 13.5
      let animazione = gsap.to(content,{
        x:position+'%',
        ease: 'Power4.EaseOut',
        duration: '2s'
      })
      animazione.duration(0.6)
      // name[index].classList.remove('show')
      // name[index-1].classList.add('show')
      // index--
      setTimeout(() => {isSliding = false;}, 500)
    }
    if(e.deltaY > 10)
    {
      if(detail==true)return
      if(position<-26.9)return
      titlePosition  = titlePosition + 20
        let animazioneTesto = gsap.to(title,{
          transform: 'translateY(-'+titlePosition+'%)',
          ease: 'Power4.EaseOut'
        })
        animazioneTesto.duration(0.7)

      
      isSliding = true
      materia.forEach(element => {
        let skewAnimaton = gsap.to(element,{
          transform: 'skew(10deg)',
        })
        skewAnimaton.duration(0.8)
        skewAnimaton.reverse(0.6)
      });

      // scroll()
      position -= 13.5
      let animazione = gsap.to(content,{
        x: position+'%',
        ease: 'Power4.EaseOut'
      })
      animazione.duration(0.6)
      
      // name[index].classList.remove('show')
      // name[index+1].classList.add('show')

      // index++
      setTimeout(() => {isSliding = false; }, 500)
    }
  }
});

const wrapper = document.querySelector('body')
const hammertime = new Hammer(wrapper)

hammertime.get('swipe').set({direction: Hammer.DIRECTION_HORIZONTAL })

hammertime.on('swipe', (e) => {
  if(e.deltaY > 5)
  {
    if(position>=13.6)return

    if(position>=13.)return
    titlePosition  = titlePosition - 20
      let animazioneTesto = gsap.to(title,{
        transform: 'translateY(-'+titlePosition+'%)',
        ease: 'Power4.EaseOut'
      })
      animazioneTesto.duration(0.7)

    isSliding = true
    materia.forEach(element => {
      let skewAnimaton = gsap.to(element,{
        transform: 'skew(-10deg)',
      })
      skewAnimaton.duration(0.6)
      skewAnimaton.reverse(0.5)
    });
    
    // scroll()
    position += 13.5
    let animazione = gsap.to(content,{
      x:position+'%',
      ease: 'Power4.EaseOut',
      duration: '2s'
    })
    animazione.duration(0.6)
    // name[index].classList.remove('show')
    // name[index-1].classList.add('show')
    // index--
    setTimeout(() => {isSliding = false;}, 500)
  }
  if(e.deltaY < -5)
    {
      if(detail==true)return
      if(position<-26.9)return
      titlePosition  = titlePosition + 20
        let animazioneTesto = gsap.to(title,{
          transform: 'translateY(-'+titlePosition+'%)',
          ease: 'Power4.EaseOut'
        })
        animazioneTesto.duration(0.7)

      
      isSliding = true
      materia.forEach(element => {
        let skewAnimaton = gsap.to(element,{
          transform: 'skew(10deg)',
        })
        skewAnimaton.duration(0.8)
        skewAnimaton.reverse(0.6)
      });

      // scroll()
      position -= 13.5
      let animazione = gsap.to(content,{
        x: position+'%',
        ease: 'Power4.EaseOut'
      })
      animazione.duration(0.6)
      
      // name[index].classList.remove('show')
      // name[index+1].classList.add('show')

      // index++
      setTimeout(() => {isSliding = false; }, 500)
    }
})

materia.forEach((el)=>{
  el.addEventListener('click', ()=>{
    console.log('click ---->', );
    gsap.to(page, {
      transform: 'translateY(0) skew(0)'
    })
    detail = true
    setTimeout(() => {document.querySelector('html').classList.add('overflow');}, 400)
  })
})

page.addEventListener('click', ()=>{
  console.log('clicked ---->', );
  gsap.to(page, {
    transform: 'translateY(100vh) skew(10deg)',
    delay: 0.2
  })
  detail = false
  document.querySelector('html').classList.remove('overflow')
})




const $bigBall = document.querySelector('.cursor__ball--big');
const $hoverables = document.querySelectorAll('.hoverable');

// Listeners
for (let i = 0; i < $hoverables.length; i++) {
  $hoverables[i].addEventListener('mouseenter', onMouseHover);
  $hoverables[i].addEventListener('mouseleave', onMouseHoverOut);
}

// Move the cursor
window.addEventListener('mousemove', function(e){
  document.body.style.setProperty('--mouse-x', e.clientX + 'px');
  document.body.style.setProperty('--mouse-y', e.clientY + 'px');

});

// Hover an element
function onMouseHover() {
  let scale = gsap.to($bigBall,  {
    scale: 4,
  })
  scale.duration(0.2)
  scroll()
}
function onMouseHoverOut() {
  let scale = gsap.to($bigBall,{
    scale: 1
  })
  scale.duration(0.2)
  scroll()
}

const logo = document.querySelector('.logo');
let colore = false
logo.addEventListener('click', ()=>{
  colore = !colore
  if(!colore)
  {
    document.body.style.setProperty('--main-color','#E8E8E8');
    document.body.style.setProperty('--font-color','#141414');
    document.body.style.setProperty('--back-color','#ddd');
    light1.color = new THREE.Color(0x222222)
    
  }
  else
  {
    document.body.style.setProperty('--main-color','#141414');
    document.body.style.setProperty('--font-color','#E8E8E8');
    document.body.style.setProperty('--back-color','#222');
    light1.color = new THREE.Color(0xE8E8E8)
  }
})
const loader = document.querySelector('.loader');
const loaderText = document.querySelector('.loaderText');
gsap.set(loaderText, {
  autoAlpha: 0,
  scale:0.3,
})
gsap.to(loader, {
  y:0,
})

window.addEventListener('DOMContentLoaded', (event) => {
  const load = gsap.to(loaderText, {
    autoAlpha: 1,
    scale:1,
    ease: 'power4.out'
  })
  load.duration(4)
  const loadPage = gsap.to(loader, {
    y: '-100vh',
    delay: 4
  })
  loadPage.duration(0.8)
});

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}
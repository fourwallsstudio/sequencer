const THREE = require('three');
import { drumSequencerGrid, analyser, dataArray, getCurrentCol } from '../sample';
import { createDrumCubes, createMusicCubes, createOsciCubes, createHead } from './shapes';


/* =====================================
    SCENE, CAMERA, RENDERER
  ======================================== */

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth/window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;
export const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

const light1 = new THREE.AmbientLight(0xffffff, 0.1)
const light2 = new THREE.PointLight(0xffffff, .8, 100)
light2.position.set( 0, 0, 10 );
scene.add(light1, light2);



/* =====================================
    SHAPES
  ======================================== */

const drumCubes = createDrumCubes(scene);
const musicCubes = createMusicCubes(scene);
const osciCubes = createOsciCubes(scene);
const head = createHead(scene);


/* =====================================
    RAYCASTER
  ======================================== */

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const onClick = (event) => {
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  raycaster.setFromCamera( mouse, camera );
  const intersects = raycaster.intersectObjects( scene.children );

  for ( let i = 0; i < intersects.length; i++ ) {
    const obj = intersects[ i ].object;
    if (obj.name === 'drumCube') {
      const [row, col] = obj.gridPosition;

      if (obj.active === 'false') {
        obj.material.color.set( 0xF07474 );
        obj.active = 'true';
        drumSequencerGrid[row][col] = true;

      } else {
        obj.material.color.set( 0xaddfff );
        obj.active = 'false';
        drumSequencerGrid[row][col] = false;
      }
    }

    if (obj.name === 'musicCube') {
      const [row, col] = obj.gridPosition;

      if (obj.active === 'false') {
        obj.material.color.set( 0xF07474 );
        obj.active = 'true';

      } else {
        obj.material.color.set( 0xaddfff );
        obj.active = 'false';
      }
    }
  }
}

window.addEventListener( 'click', onClick, false );


/* =====================================
    ANIMATE
  ======================================== */

const switchGrids = () => {
  if (drumCubes[0].position.x < 6) {
    drumCubes.forEach( dc => {
      dc.position.x += 0.3;
    })

    musicCubes.forEach( mc => {
      mc.position.x += 0.3;
    })
  }
}

const dataArray = new Uint8Array(128);

export const animate = () => {
  requestAnimationFrame( animate );

  head.position.x = -6 + (getCurrentCol() * 0.75);

  analyser.getByteTimeDomainData(dataArray);

  for (let i = 0; i < 128; i++) {
    osciCubes[i].position.y = dataArray[i] / 64.0 -5.3;
    osciCubes[i].position.z = dataArray[i] / 64.0 - 2;
  }

  renderer.render( scene, camera );
}

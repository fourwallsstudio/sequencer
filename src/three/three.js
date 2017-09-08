const THREE = require('three');
import { sequencerGrid, analyser, dataArray } from '../sample';


/* =====================================
    SCENE, CAMERA, RENDERER
  ======================================== */

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 5;
export const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

const light1 = new THREE.AmbientLight(0xffffff, 0.1)
const light2 = new THREE.PointLight(0xffffff, .8, 100)
light2.position.set( 0, 0, 10 );
scene.add(light1, light2);



/* =====================================
    CUBES
  ======================================== */

const refY = -1;
const refX = -6;

for (let row = 0; row < 4; row++) {
  for (let col = 0; col < 16; col++) {
    const geometry = new THREE.BoxGeometry( 0.5, 0.5, 0.01 );
    const material = new THREE.MeshPhongMaterial( { color: 0xaddfff } );
    const cube = new THREE.Mesh( geometry, material );
    cube.name = 'cube';
    cube.active = 'false';
    cube.gridPosition = [col, row];
    cube.position.x = refX + (col * 0.75);
    cube.position.y = refY + row;

    scene.add(cube);
  }
}

/* =====================================
    OSCILLOSCOPE CUBES
  ======================================== */

const osciCubes = [];
const startX = -5;

for (let i = 0; i < 128; i++) {
  const geometry = new THREE.CubeGeometry( 0.05, 0.05, 0.01 );
  const material = new THREE.MeshPhongMaterial( { color: 0x6C7A83 } );
  const cube = new THREE.Mesh( geometry, material );
  cube.name = 'osciCube';
  cube.position.x = startX + (i * 0.075);
  cube.position.y = -3;

  osciCubes.push(cube);
  scene.add(cube);
}


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
    if (obj.name !== 'cube') continue;

    const [row, col] = obj.gridPosition;

    if (obj.active === 'false') {
      obj.material.color.set( 0xF07474 );
      obj.active = 'true';
      sequencerGrid[row][col] = true;

    } else {
      obj.material.color.set( 0xaddfff );
      obj.active = 'false';
      sequencerGrid[row][col] = false;
    }
  }
}

window.addEventListener( 'click', onClick, false );


/* =====================================
    ANIMATE
  ======================================== */

const dataArray = new Uint8Array(128);

export const animate = () => {
  requestAnimationFrame( animate );
  analyser.getByteTimeDomainData(dataArray);

  for (let i = 0; i < 128; i++) {
    osciCubes[i].position.y = dataArray[i] / 64.0 -5.3;
    osciCubes[i].position.z = dataArray[i] / 64.0 - 2;
  }

  renderer.render( scene, camera );
}

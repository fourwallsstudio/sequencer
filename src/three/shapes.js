const THREE = require('three');


/* =====================================
    DRUM CUBES
  ======================================== */

export const createDrumCubes = (scene) => {

  const drumCubes = [];
  const refY = 2;
  const refX = -6;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 16; col++) {
      const geometry = new THREE.BoxGeometry( 0.5, 0.5, 0.01 );
      const material = new THREE.MeshPhongMaterial( { color: 0xaddfff } );
      const cube = new THREE.Mesh( geometry, material );
      cube.name = 'drumCube';
      cube.active = 'false';
      cube.gridPosition = [row, col];
      cube.position.x = refX + (col * 0.75);
      cube.position.y = refY - row;

      drumCubes.push(cube);
      scene.add(cube);
    }
  }

  return drumCubes;
}




/* =====================================
    MUSIC CUBES
  ======================================== */


export const createMusicCubes = (scene) => {

  const musicCubes = [];
  const refY = 2;
  const refX = -22;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 16; col++) {
      const geometry = new THREE.BoxGeometry( 0.5, 0.5, 0.01 );
      const material = new THREE.MeshPhongMaterial( { color: 0xaddfff } );
      const cube = new THREE.Mesh( geometry, material );
      cube.name = 'musicCube';
      cube.active = 'false';
      cube.gridPosition = [row, col];
      cube.position.x = refX + (col * 0.75);
      cube.position.y = refY - row;

      musicCubes.push(cube);
      scene.add(cube);
    }
  }

  return musicCubes;
}



/* =====================================
    OSCILLOSCOPE CUBES
  ======================================== */


export const createOsciCubes = (scene) => {
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

  return osciCubes;
}



/* =====================================
    HEAD
  ======================================== */

export const createHead = (scene) => {
  const headGeometry = new THREE.BoxGeometry( 0.5, 3.75, 1, 2, 2 );
  const headMaterial = new THREE.MeshPhongMaterial({
    color: 0xFFFC15,
    transparent: true,
    opacity: 0.3,
    wireframe: true
  });
  const head = new THREE.Mesh( headGeometry, headMaterial );
  head.position.z = -0.5;
  head.position.x = -6;
  head.position.y = 0.5;
  scene.add(head);

  return head;
}

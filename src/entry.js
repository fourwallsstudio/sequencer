import { renderer, animate } from './three/three';


document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild( renderer.domElement );
  animate();
})

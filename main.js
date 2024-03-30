const THREE = window.MINDAR.IMAGE.THREE;
import {CSS3DObject} from "./libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js";
document.addEventListener('DOMContentLoaded', () => {
  const startAsync = async() => {

    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: './assets/bussinesscard.mind',
    });
    const {renderer, cssRenderer, scene, cssScene, camera} = mindarThree;

    const obj = new CSS3DObject(document.querySelector("#my-card"));
    const cssAnchor = mindarThree.addCSSAnchor(0);
    cssAnchor.group.add(obj);

    cssAnchor.onTargetFound = () => {
      console.log("hello");
    }
    cssAnchor.onTargetLost = () => {
      console.log("bye");
    }

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      cssRenderer.render(cssScene, camera);
    });
  }
  startAsync();
});


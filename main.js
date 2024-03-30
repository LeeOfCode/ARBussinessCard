const THREE = window.MINDAR.IMAGE.THREE;
import {CSS3DObject} from "./libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js";
import {FBXLoader} from "./libs/three.js-r132/examples/jsm/loaders/FBXLoader.js";
import {loadAudio} from "./libs/loader.js"

const loadFBX = (path) => {
      return new Promise((resolve, reject) => {
          const loader = new FBXLoader();
          loader.load(path, (fbx) => {
            resolve(fbx);
          });
      });
}
  const createYoutube = () => {
    return new Promise( (resolve, reject) => {
      var tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  
      const onYouTubeIframeAPIReady = () => {
        const player = new YT.Player("player", {
          videoId: '-w2g-SJwnPs',
          events: {
            onReady: () => {
              resolve(player);
            }
          }
        });
      }
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    });
  }

document.addEventListener('DOMContentLoaded', () => {
  const startAsync = async() => {

    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: './assets/bussinesscard.mind',
    });
    const {renderer, cssRenderer, scene, cssScene, camera} = mindarThree;
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    const model = await loadFBX("./assets/models/dancing.fbx")
    model.scale.set(0.003,0.003,0.003);
    model.position.set(0.7,-0.3,0);

    const mixer = new THREE.AnimationMixer(model);
    const action = mixer.clipAction(model.animations[0]);
    action.play();

    const modelAnchor = mindarThree.addAnchor(0);
    modelAnchor.group.add(model);

    const audioClip = await loadAudio("./assets/sound.wav");
    const audioListener = new THREE.AudioListener();
    const audioSource = new THREE.Audio(audioListener);
    audioSource.setBuffer(audioClip);
    modelAnchor.group.add(audioSource);

    const player = await createYoutube();

    const cssObj = new CSS3DObject(document.querySelector("#my-card"));
    const cssAnchor = mindarThree.addCSSAnchor(0);
    cssAnchor.group.add(cssObj);

    cssAnchor.onTargetFound = () => {
      console.log("hello");
      audioSource.play();
      player.playVideo();
    }
    cssAnchor.onTargetLost = () => {
      console.log("bye");
      audioSource.stop();
      player.pauseVideo();
    }

    const clock = new THREE.Clock();
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      mixer.update(delta);
      cssRenderer.render(cssScene, camera);
      renderer.render(scene, camera);
    });
  }
  startAsync();
});


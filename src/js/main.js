import '../css/style.scss'
import * as THREE from "three";
import { gsap, Power2 } from 'gsap';
import Figure from './figure';
import { SplitText } from './splitText';
import { ScrollObserver } from './scrollObserver';

class Main {
  constructor() {
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    this.canvas = document.querySelector("#canvas");
    this.renderer = null;
    this.scene = new THREE.Scene();
    this.camera = null;
    this.cameraFov = 45;
    this.cameraFovRadian = (this.cameraFov / 2) * (Math.PI / 180);
    this.cameraDistance = (this.viewport.height / 2) / Math.tan(this.cameraFovRadian);
    this.geometry = null;
    this.material = null;
    this.mesh = null;

    this.imgPlaneArray = [];

    this.ttls = document.querySelectorAll('.ttl');

    this.init();

  }

  _setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.viewport.width, this.viewport.height);
  }

  _setCamera() {

    //ウインドウとWebGL座標を一致させる
    this.camera = new THREE.PerspectiveCamera(this.cameraFov, this.viewport.width / this.viewport.height, 1, this.cameraDistance * 2);
    this.camera.position.z = this.cameraDistance;
    // this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.camera);
  }

  _addMesh() {
    const imgArray = [...document.querySelectorAll('.list img')];
    for(const img of imgArray) {
      const imgMesh = new Figure(img, this.scene);
      
      this.imgPlaneArray.push(imgMesh);
    }
  }

  _anim(el, inview) {
    if(inview) {
      el.classList.add('is-anim');
      console.log('start anim');
      let chars = el.querySelectorAll('.char');

      gsap.to(chars, {
        // y: 0,
        opacity: 1,
        rotateY: 0,
        duration: 0.7,
        ease: Power2.easeOut,
        stagger: {
          each: 0.05,
        }
      })
    } else {
      el.classList.remove('is-anim');
      console.log('end anim');

      let chars = el.querySelectorAll('.char');
      gsap.to(chars, {
        // y: 40,
        opacity: 0,
        rotateY: 70,
        duration: 0.4,
      })
    }
  }

  _textAnim() {
    this.ttls.forEach((ttl) =>{
      new SplitText(ttl);
    });

    new ScrollObserver('.js-anim', this._anim, {once: false});
  }

  init() {
    this._setRenderer();
    this._setCamera();

    this._addMesh();

    this._textAnim();

    this._update();
    this._addEvent();
  }

  _update() {

    for(const img of this.imgPlaneArray) {
      img.update();
    }

    //レンダリング
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this._update.bind(this));
  }

  _onResize() {
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    // レンダラーのサイズを修正
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    // カメラのアスペクト比を修正
    this.camera.aspect = this.viewport.width / this.viewport.height;
    this.camera.updateProjectionMatrix();
    // カメラの位置を調整
    this.cameraDistance = (this.viewport.height / 2) / Math.tan(this.cameraFovRadian); //ウインドウぴったりのカメラ距離
    this.camera.position.z = this.cameraDistance;
  }

  _addEvent() {
    window.addEventListener("resize", this._onResize.bind(this));
  }
}

const main = new Main();

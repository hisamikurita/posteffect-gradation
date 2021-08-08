import * as THREE from 'three';

export default class Stage {
  constructor() {
    this.renderParam = {
      clearColor: 'rgb(92,105,92)',
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.cameraParam = {
      fov: 45,
      near: 0.1,
      far: 100,
      lookAt: new THREE.Vector3(0, 0, 0),
      x: 0,
      y: 0,
      z: 10
    };

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.isInitialized = false;
  }

  init() {
    this._setScene();
    this._setRender();
    this._setCamera();
    this.isInitialized = true;
  }

  _setScene() {
    this.scene = new THREE.Scene();
  }

  _setRender() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(new THREE.Color(this.renderParam.clearColor));
    this.renderer.setSize(this.renderParam.width, this.renderParam.height);
    const wrapper = document.querySelector('#webgl');
    wrapper.appendChild(this.renderer.domElement);
  }

  _setCamera() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (!this.isInitialized) {
      this.camera = new THREE.PerspectiveCamera(
        this.cameraParam.fov,
        windowWidth / windowHeight,
        this.cameraParam.near,
        this.cameraParam.far
      );
      this.camera.position.set(
        this.cameraParam.x,
        this.cameraParam.y,
        this.cameraParam.z
      );
      this.camera.lookAt(this.cameraParam.lookAt);
    }

    this.camera.aspect = windowWidth / windowHeight;
    this.camera.fov = this.cameraParam.fov;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(windowWidth, windowHeight);
  }

  _render() {
    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    this._setCamera();
  }

  onRaf() {
    this._render();
  }
}
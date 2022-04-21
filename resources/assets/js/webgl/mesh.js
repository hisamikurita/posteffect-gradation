import * as THREE from 'three';
import vertexShader from './shaders/vertexshader.vert';
import fragmentShader from './shaders/fragmentshader.frag';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader';
import * as dat from 'dat.gui';
import Utils from '../utility/util';

export default class Mesh {
  constructor(stage) {
    this.stage = stage;
    this.num = 140;
    this.range = 20;
    this.objColorParam = {
      color_01: "rgb(255,0,0)",
      color_02: "rgb(0,0,255)",
      color_03: "rgb(255,255,0)",
    }
    this.color = [
      this.objColorParam.color_01,
      this.objColorParam.color_02,
      this.objColorParam.color_03
    ];

    this.clock = new THREE.Clock();
  }

  init() {
    this._setMesh();
    this._setPostEffect();
    this._setGui();
  }

  _setMesh() {
    const originalGeometry = new THREE.PlaneBufferGeometry(4.0, 4.0, 1.0, 1.0);
    const geometry = new THREE.InstancedBufferGeometry();

    const vertice = originalGeometry.attributes.position.clone();
    geometry.setAttribute('position', vertice);

    const normal = originalGeometry.attributes.normal.clone();
    geometry.setAttribute('normals', normal);

    const uv = originalGeometry.attributes.uv.clone();
    geometry.setAttribute('uv', uv);

    const indices = originalGeometry.index.clone();
    geometry.setIndex(indices);

    const u_ColorArray = [];
    const offsetPosition = [];
    const index = [];
    const angle = [];

    for (let i = 0; i < this.num; i++) {
      const x = Math.random() * this.range - this.range / 2.0;
      const y = Math.random() * this.range - this.range / 2.0;
      offsetPosition.push(x, y, 0);
      index.push(i);
      angle.push(Math.PI * 2 * Math.random());
      u_ColorArray.push(new THREE.Color(this.color[Utils.mod(i, this.color.length)]));
    }
    const offsetPositions = new THREE.InstancedBufferAttribute(new Float32Array(offsetPosition), 3);
    const indexs = new THREE.InstancedBufferAttribute(new Float32Array(index), 1);
    const angles = new THREE.InstancedBufferAttribute(new Float32Array(angle), 1);

    geometry.setAttribute('offsetPosition', offsetPositions);
    geometry.setAttribute('index', indexs);
    geometry.setAttribute('angle', angles);

    this.uniforms = {
      u_time: { type: "f", value: 0.0 },
      u_ColorArray: { type: "v3v", value: u_ColorArray },
    };

    const material = new THREE.RawShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      uniforms: this.uniforms
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.stage.scene.add(this.mesh);
  }

  _setPostEffect() {
    this.bloomPassParam = {
      strength: 1.4,
      kernelSize: 50.0,
      sigma: 10.0,
      resolution: 512,
    }

    this.composer = new EffectComposer(this.stage.renderer);
    this.composer.addPass(new RenderPass(this.stage.scene, this.stage.camera));

    this.effectBloom = new BloomPass(this.bloomPassParam.strength, this.bloomPassParam.kernelSize, this.bloomPassParam.sigma, this.bloomPassParam.resolution);
    this.composer.addPass(this.effectBloom);

    this.filmPassParam = {
      noiseIntensity: 0.35,
      scanlineIntensity: 0.025,
      scanlineCount: 648,
      grayscale: false,
    }

    this.filmPass = new FilmPass(this.filmPassParam.noiseIntensity, this.filmPassParam.scanlineIntensity, this.filmPassParam.scanlineCount, this.filmPassParam.grayscale);
    this.composer.addPass(this.filmPass);

    this.toScreen = new ShaderPass(CopyShader);
    this.toScreen.renderToScreen = true;
    this.composer.addPass(this.toScreen);
  }

  _setGui() {
    const parameter = {
      objColor_01: this.objColorParam.color_01,
      objColor_02: this.objColorParam.color_02,
      objColor_03: this.objColorParam.color_03,
      stageColor: this.stage.renderParam.clearColor,
      bloomStrength: this.bloomPassParam.strength,
      noiseIntensity: this.filmPassParam.noiseIntensity,
      scanlineIntensity: this.filmPassParam.scanlineIntensity,
      scanlineCount: this.filmPassParam.scanlineCount,
      grayscale: this.filmPassParam.grayscale,
    };
    const gui = new dat.GUI();
    gui.addColor(parameter, 'objColor_01').name('obj color 1').onChange((value) => {
      this._colorChange(value, 0);
    });
    gui.addColor(parameter, 'objColor_02').name('obj color 2').onChange((value) => {
      this._colorChange(value, 1);
    });
    gui.addColor(parameter, 'objColor_03').name('obj color 3').onChange((value) => {
      this._colorChange(value, 2);
    });
    gui.addColor(parameter, 'stageColor').name('bg color').onChange((value) => {
      const color = new THREE.Color(value);
      this.stage.renderer.setClearColor(color);
    });
    gui.add(parameter, 'bloomStrength', 0.0, 2.0, 0.1).name('bloom strength').onChange((value) => {
      this.toScreen.uniforms.opacity.value = value;
    });
    gui.add(parameter, 'noiseIntensity', 0.0, 1.0, 0.01).name('noise intensity').onChange((value) => {
      this.filmPass.uniforms.nIntensity.value = value;
    });
    gui.add(parameter, 'scanlineCount', 0.0, 1000.0, 1.0).name('scanline count').onChange((value) => {
      this.filmPass.uniforms.sCount.value = value;
    });
    gui.add(parameter, 'grayscale').name('grayscale').onChange((value) => {
      this.filmPass.uniforms.grayscale.value = value;
    });
  }

  _colorChange(value, index) {
    const color = new THREE.Color(value);
    this.mesh.material.uniforms.u_ColorArray.value[index] = color;
  }

  _render() {
    this.uniforms.u_time.value += this.clock.getDelta() / 4.0;
    this.composer.render();
  }

  onRaf() {
    this._render();
  }
}
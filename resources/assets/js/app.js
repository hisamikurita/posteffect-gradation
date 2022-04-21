import Mesh from './webgl/mesh';
import Stage from './webgl/stage';

const stage = new Stage();
stage.init();

const mesh = new Mesh(stage);
mesh.init();

window.addEventListener('resize', () => {
  stage.onResize();
});

const _raf = () => {
  window.requestAnimationFrame(() => {
    stage.onRaf();
    mesh.onRaf();

    _raf();
  });
}

_raf();
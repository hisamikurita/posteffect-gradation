import Mesh from './webgl/mesh';
import Stage from './webgl/stage';

export default class App {
  constructor() {
    const stage = new Stage();
    stage.init();

    const mesh = new Mesh(stage);
    mesh.init();

    window.addEventListener('resize', () => {
      stage.onResize();
      // mesh.onResize();
    });

    const _raf = () => {
      window.requestAnimationFrame(() => {
        stage.onRaf();
        mesh.onRaf();

        _raf();
      });
    }

    _raf();
  }
}

new App();
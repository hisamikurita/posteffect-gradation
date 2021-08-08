precision mediump float;
varying vec3 vColor;
varying vec2 vUv;

void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float len = length(p);
    float alpha = max(1.0 - len, 0.0);

    gl_FragColor = vec4(vColor, alpha);
}
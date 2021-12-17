// language=glsl
export const terrainFragmentShader = `
precision mediump float;

varying vec3 vNormal;
varying float vDiscard;

uniform vec3 sun;

void main() {
    if (vDiscard > 0.0) {
        discard;
    } else {
        vec3 light = normalize(sun);
        float brightness = max(dot(vNormal, light), 0.4);
        vec3 diffuse = brightness * vec3(1.0, 1.0, 1.0);
        gl_FragColor = vec4(diffuse, 1.0);
    }
}
`;

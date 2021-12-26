// language=glsl
export const terrainFragmentShader = `
precision mediump float;

varying vec3 vWorldPos;
varying vec3 vNormal;
varying float vDiscard;

uniform sampler2D grass;
uniform vec3 sun;

void main() {
    if (vDiscard > 0.0) {
        discard;
    } else {
        vec3 light = normalize(sun);
        float brightness = max(dot(vNormal, light), 0.4);
        vec3 blendAxes = abs(vNormal);
        vec3 uvSample = vWorldPos / 4.0; // texture fills 4x4 world units
        vec4 grassX = texture2D(grass, uvSample.yz) * blendAxes.x;
        vec4 grassY = texture2D(grass, uvSample.xz) * blendAxes.y;
        vec4 grassZ = texture2D(grass, uvSample.xy) * blendAxes.z;
        vec4 grassColor = grassX + grassY + grassZ;
        vec3 diffuse = brightness * normalize(grassColor.xyz);
        gl_FragColor = vec4(diffuse, 1.0);
    }
}
`;

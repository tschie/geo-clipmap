var R=Object.defineProperty;var y=Object.getOwnPropertySymbols;var A=Object.prototype.hasOwnProperty,q=Object.prototype.propertyIsEnumerable;var S=(o,e,i)=>e in o?R(o,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):o[e]=i,p=(o,e)=>{for(var i in e||(e={}))A.call(e,i)&&S(o,i,e[i]);if(y)for(var i of y(e))q.call(e,i)&&S(o,i,e[i]);return o};import{W as T,s as U,A as k,S as G,P as j,F as _,a as H,V as x,M as w,b as V,I as X,R as b,c as Z,d as Q,e as Y,G as B,C as K,f as $,Q as J}from"./vendor.f08891b6.js";const ee=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))z(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const v of r.addedNodes)v.tagName==="LINK"&&v.rel==="modulepreload"&&z(v)}).observe(document,{childList:!0,subtree:!0});function i(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerpolicy&&(r.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?r.credentials="include":t.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function z(t){if(t.ep)return;t.ep=!0;const r=i(t);fetch(t.href,r)}};ee();const te=`
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
`,oe=`
    precision mediump float;

    varying vec3 vNormal;
    varying float vDiscard;
    varying vec3 vWorldPos;

    uniform float gridSize;

    vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 mod289(vec4 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 permute(vec4 x) {
        return mod289((x * 34.0 + 1.0) * x);
    }

    vec4 taylorInvSqrt(vec4 v) {
        return 1.79284291400159 - 0.85373472095314 * v;
    }

    vec3 fade(vec3 t) {
        return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
    }

    float perlinNoise(vec3 v) {
        vec3 i0 = mod289(floor(v));
        vec3 i1 = mod289(i0 + vec3(1.0));
        vec3 f0 = fract(v);
        vec3 f1 = f0 - vec3(1.0);
        vec3 f = fade(f0);
        vec4 ix = vec4(i0.x, i1.x, i0.x, i1.x);
        vec4 iy = vec4(i0.y, i0.y, i1.y, i1.y);
        vec4 iz0 = vec4(i0.z);
        vec4 iz1 = vec4(i1.z);
        vec4 ixy = permute(permute(ix) + iy);
        vec4 ixy0 = permute(ixy + iz0);
        vec4 ixy1 = permute(ixy + iz1);
        vec4 gx0 = ixy0 * (1.0 / 7.0);
        vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
        vec4 gx1 = ixy1 * (1.0 / 7.0);
        vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
        gx0 = fract(gx0);
        gx1 = fract(gx1);
        vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
        vec4 sz0 = step(gz0, vec4(0.0));
        vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
        vec4 sz1 = step(gz1, vec4(0.0));
        gx0 -= sz0 * (step(0.0, gx0) - 0.5);
        gy0 -= sz0 * (step(0.0, gy0) - 0.5);
        gx1 -= sz1 * (step(0.0, gx1) - 0.5);
        gy1 -= sz1 * (step(0.0, gy1) - 0.5);
        vec3 g0 = vec3(gx0.x, gy0.x, gz0.x);
        vec3 g1 = vec3(gx0.y, gy0.y, gz0.y);
        vec3 g2 = vec3(gx0.z, gy0.z, gz0.z);
        vec3 g3 = vec3(gx0.w, gy0.w, gz0.w);
        vec3 g4 = vec3(gx1.x, gy1.x, gz1.x);
        vec3 g5 = vec3(gx1.y, gy1.y, gz1.y);
        vec3 g6 = vec3(gx1.z, gy1.z, gz1.z);
        vec3 g7 = vec3(gx1.w, gy1.w, gz1.w);
        vec4 norm0 = taylorInvSqrt(vec4(dot(g0, g0), dot(g2, g2), dot(g1, g1), dot(g3, g3)));
        vec4 norm1 = taylorInvSqrt(vec4(dot(g4, g4), dot(g6, g6), dot(g5, g5), dot(g7, g7)));
        g0 *= norm0.x;
        g2 *= norm0.y;
        g1 *= norm0.z;
        g3 *= norm0.w;
        g4 *= norm1.x;
        g6 *= norm1.y;
        g5 *= norm1.z;
        g7 *= norm1.w;
        vec4 nz = mix(
        vec4(
        dot(g0, vec3(f0.x, f0.y, f0.z)),
        dot(g1, vec3(f1.x, f0.y, f0.z)),
        dot(g2, vec3(f0.x, f1.y, f0.z)),
        dot(g3, vec3(f1.x, f1.y, f0.z))
        ),
        vec4(
        dot(g4, vec3(f0.x, f0.y, f1.z)),
        dot(g5, vec3(f1.x, f0.y, f1.z)),
        dot(g6, vec3(f0.x, f1.y, f1.z)),
        dot(g7, vec3(f1.x, f1.y, f1.z))
        ),
        f.z
        );
        return 2.2 * mix(mix(nz.x, nz.z, f.y), mix(nz.y, nz.w, f.y), f.x);
    }

    float perlinNoise(float x, float y) {
        return perlinNoise(vec3(x, y, 0.0));
    }

    // apply fractal brownian motion to noise
    float fbm(vec3 pos) {
        float scale = 0.0001;
        float lacunarity = 3.2;
        float gain = 0.45;
        float amplitude = 1.0;
        float frequency = 1.0;
        float sum = 0.0;
        // 5 "octaves"
        for (int i = 0; i < 5; i++) {
            float h = perlinNoise(pos * scale * frequency);
            sum += h * amplitude;
            amplitude *= gain;
            frequency *= lacunarity;
        }
        return sum;
    }

    float easeInCubic(float x) {
        return x * x * x;
    }

    float height(vec3 pos) {
        return 1000.0 * abs(easeInCubic(fbm(pos)));
    }

    // calculate normals based on central differences (average of heights around point)
    vec3 calcNormal(vec3 pos, float cellSize) {
        float heightLeft = height(vec3(pos.x - cellSize, 0.0, pos.z));
        float heightRight = height(vec3(pos.x + cellSize, 0.0, pos.z));
        float heightDown = height(vec3(pos.x, 0.0, pos.z - cellSize));
        float heightUp = height(vec3(pos.x, 0.0, pos.z + cellSize));
        return normalize(vec3(heightLeft - heightRight, 2.0 * cellSize, heightDown - heightUp));
    }

    void main() {
        float cellSize = pow(2.0, float(gl_InstanceID));
        if (gl_InstanceID > 0 && abs(position.x) < 0.25 && abs(position.z) < 0.25) {
            // for levels > 0, remove center area to make room for previous LOD
            // this leaves two unwanted triangles in the center but this doesn't have much of an effect
            vDiscard = 1.0;
        } else {
            float widthLocal = gridSize / (gridSize - 2.0);
            float edge = widthLocal / 2.0;// max x or z of whole geometry in local space
            float cellSizeLocal = widthLocal / gridSize;

            vec3 worldPosition = (instanceMatrix * vec4(position, 1.0)).xyz;
            vec3 center = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);

            vec3 centerOffset = center - floor(center / cellSize) * cellSize;
            worldPosition -= centerOffset;
            
            vec3 neighborCenterOffset = center - floor(center / cellSize / 2.0) * cellSize * 2.0;
            vec3 neighborOffset = neighborCenterOffset - centerOffset;

            // subtract extra one cell border if it's not needed to fill center offset gaps
            float rightEdge = edge - ((neighborOffset.x / cellSize) * cellSizeLocal + cellSizeLocal);
            float leftEdge = -edge - ((neighborOffset.x / cellSize) * cellSizeLocal - cellSizeLocal);
            float bottomEdge = edge - ((neighborOffset.z / cellSize) * cellSizeLocal + cellSizeLocal);
            float topEdge = -edge - ((neighborOffset.z / cellSize) * cellSizeLocal - cellSizeLocal);

            if (position.x > rightEdge || position.x < leftEdge || position.z > bottomEdge || position.z < topEdge) {
                // discard extra vertices that aren't needed for gaps
                vDiscard = 1.0;
            } else {
                float h = 0.0;

                if ((position.z == bottomEdge || position.z == topEdge) && mod(position.x - leftEdge, 2.0 * cellSizeLocal) > 0.0) {
                    // interpolate height with nextLOD at T-junctions on top and bottom sides
                    vec3 prevWorld = worldPosition - vec3(cellSize, 0.0, 0.0);
                    vec3 nextWorld = worldPosition + vec3(cellSize, 0.0, 0.0);
                    h = mix(height(prevWorld), height(nextWorld), 0.5);
                    vNormal = mix(calcNormal(prevWorld, cellSize), calcNormal(nextWorld, cellSize), 0.5);
                } else if ((position.x == rightEdge || position.x == leftEdge) && mod(position.z - topEdge, 2.0 * cellSizeLocal) > 0.0) {
                    // interpolate height with nextLOD at T-junctions on left and right sides
                    vec3 prevWorld = worldPosition - vec3(0.0, 0.0, cellSize);
                    vec3 nextWorld = worldPosition + vec3(0.0, 0.0, cellSize);
                    h = mix(height(prevWorld), height(nextWorld), 0.5);
                    vNormal = mix(calcNormal(prevWorld, cellSize), calcNormal(nextWorld, cellSize), 0.5);
                } else {
                    h = height(worldPosition);
                    vNormal = calcNormal(worldPosition, cellSize);
                }

                // adjust y value with noise height
                vec3 finalPosition = vec3(worldPosition.x, h, worldPosition.z);
                vWorldPos = finalPosition;
                gl_Position = projectionMatrix * viewMatrix * vec4(finalPosition, 1.0);
            }
        }
    }
`,L=7,l=Math.pow(2,L+1)+2,M=12,a=document.querySelector("canvas"),n=new T({canvas:a});n.setPixelRatio(window.devicePixelRatio);n.outputEncoding=U;n.toneMapping=k;n.toneMappingExposure=.5;const u=new G,c=new j(75,a.offsetWidth/a.offsetHeight,.1,1e6);c.position.set(0,3e3,0);const g=new _(c,n.domElement);g.dragToLook=!0;g.movementSpeed=2e3;g.rollSpeed=1;const d=new H;d.scale.setScalar(45e4);u.add(d);const s={turbidity:{value:10},rayleigh:{value:3},mieCoefficient:{value:.005},mieDirectionalG:{value:.7},elevation:{value:35},azimuth:{value:180},exposure:n.toneMappingExposure},m=new x,ie=w.degToRad(90-s.elevation.value),re=w.degToRad(s.azimuth.value);m.setFromSphericalCoords(1,ie,re);s.sunPosition={value:m};d.material.uniforms=p(p({},d.material.uniforms),s);n.toneMappingExposure=s.exposure;const E=new V(l/(l-2),l/(l-2),l,l);E.rotateX(-Math.PI/2);const h=X.loadTexture("/geo-clipmap/grass.png");h.wrapS=b;h.wrapT=b;const P=new Z({uniforms:{grass:{type:"t",value:h},gridSize:{value:l},sun:{value:m}},vertexShader:oe,fragmentShader:te}),f=new Q(E,P,M);u.add(f);const W=Y();document.body.appendChild(W.domElement);const N=new B,D={update:!0},C=N.addFolder("Clip Map");C.add(D,"update",!0);C.open();const I=N.addFolder("Material");I.add(P,"wireframe",!1);I.open();const O=()=>{a.width=a.offsetWidth,a.height=a.offsetHeight,c.aspect=a.offsetWidth/a.offsetHeight,c.updateProjectionMatrix(),n.setSize(window.innerWidth,window.innerHeight)};window.addEventListener("resize",O);O();const ae=new K,F=()=>{if(requestAnimationFrame(F),g.update(ae.getDelta()),D.update){for(let o=0;o<M;o++){const e=Math.pow(2,o+L+1);f.setMatrixAt(o,new $().compose(new x(Math.floor(c.position.x),0,Math.floor(c.position.z)),new J,new x(e,1,e)))}f.instanceMatrix.needsUpdate=!0,f.material.needsUpdate=!0}n.render(u,c),W.update()};F();

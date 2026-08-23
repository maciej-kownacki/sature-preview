(()=>{let e=[{selector:`.hero`,seed:12.5},{selector:`.section-dark`,seed:41},{selector:`.cta-band`,seed:67},{selector:`.site-footer`,seed:88}].flatMap(({selector:e,seed:t})=>Array.from(document.querySelectorAll(e),e=>({el:e,seed:t})));if(!e.length)return;let t={stops:[{c:`#000000`,p:0},{c:`#121212`,p:.4},{c:`#2A2A2A`,p:.72},{c:`#545454`,p:1}],scale:1.3,warp:1.1,speed:.44,contrast:1.25,angle:118,grain:.068,vignette:1,blend:.82,seed:12.5};function n(e,t,n,r){let i=e.getContext(`webgl`,{antialias:!1,alpha:!1,powerPreference:`high-performance`});if(!i)return null;let a=r,o=0,s=0,c=0,l=!1,u=!0;function d(e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),i.getShaderParameter(n,i.COMPILE_STATUS)||console.error(i.getShaderInfoLog(n)),n}let f=i.createProgram();i.attachShader(f,d(i.VERTEX_SHADER,t)),i.attachShader(f,d(i.FRAGMENT_SHADER,n)),i.linkProgram(f),i.useProgram(f);let p=i.createBuffer();i.bindBuffer(i.ARRAY_BUFFER,p),i.bufferData(i.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),i.STATIC_DRAW);let m=i.getAttribLocation(f,`aPos`);i.enableVertexAttribArray(m),i.vertexAttribPointer(m,2,i.FLOAT,!1,0,0);let h=[`uRes`,`uTime`,`uScale`,`uWarp`,`uContrast`,`uAngle`,`uGrain`,`uVignette`,`uBlend`,`uSeed`,`uCount`,`uCol[0]`,`uPos[0]`],g={};for(let e of h)g[e]=i.getUniformLocation(f,e);function _(e){let t=e.replace(`#`,``);t.length===3&&(t=t[0]+t[0]+t[1]+t[1]+t[2]+t[2]);let n=parseInt(t,16);return[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255]}function v(){let t=Math.min(window.devicePixelRatio||1,1.5),n=Math.max(1,Math.round((e.clientWidth||1)*t)),r=Math.max(1,Math.round((e.clientHeight||1)*t));(e.width!==n||e.height!==r)&&(e.width=n,e.height=r,i.viewport(0,0,n,r))}let y=window.matchMedia&&window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,b=0;function x(t){if(l)return;c||=t;let n=Math.min((t-c)/1e3,.05);if(c=t,!y&&!document.hidden&&(s+=n*a.speed),t-b<33.333333333333336){o=requestAnimationFrame(x);return}b=t,v(),i.useProgram(f);let r=a.stops,d=Math.min(r.length,6),p=new Float32Array(18),m=new Float32Array(6);for(let e=0;e<6;e++){let t=r[Math.min(e,d-1)],n=_(t.c);p[e*3]=n[0],p[e*3+1]=n[1],p[e*3+2]=n[2],m[e]=t.p}let h=Math.max(1,Math.min(e.clientWidth,e.clientHeight));if(i.uniform2f(g.uRes,e.width,e.height),i.uniform1f(g.uTime,s),i.uniform1f(g.uScale,h/558),i.uniform1f(g.uWarp,a.warp),i.uniform1f(g.uContrast,a.contrast),i.uniform1f(g.uAngle,a.angle*Math.PI/180),i.uniform1f(g.uGrain,a.grain),i.uniform1f(g.uVignette,a.vignette),i.uniform1f(g.uBlend,a.blend),i.uniform1f(g.uSeed,a.seed),i.uniform1i(g.uCount,d),i.uniform3fv(g[`uCol[0]`],p),i.uniform1fv(g[`uPos[0]`],m),i.drawArrays(i.TRIANGLES,0,3),!u||document.hidden){o=0,c=0;return}o=requestAnimationFrame(x)}function S(){!l&&!o&&(o=requestAnimationFrame(x))}return{start:S,setVisible(e){u=e,e&&S()},setParams(e){a=e},destroy(){l=!0,cancelAnimationFrame(o),i.deleteProgram(f),i.deleteBuffer(p)}}}let r=[];for(let{el:i,seed:a}of e){let e=null,o=new IntersectionObserver(s=>{let c=s[0].isIntersecting;if(c&&!e){let s=document.createElement(`canvas`);if(s.className=`bg-canvas gradient-canvas`,s.setAttribute(`aria-hidden`,`true`),i.appendChild(s),e=n(s,`attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`,`precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform float uScale;
uniform float uWarp;
uniform float uContrast;
uniform float uAngle;
uniform float uGrain;
uniform float uVignette;
uniform float uBlend;
uniform float uSeed;
uniform int   uCount;
uniform vec3  uCol[6];
uniform float uPos[6];

float hash(vec2 p){
  p = fract(p * vec2(443.897, 441.423));
  p += dot(p, p + 19.19);
  return fract((p.x + p.y) * p.x);
}

float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.62, 1.18, -1.18, 1.62);
  for (int i = 0; i < 5; i++){
    v += a * vnoise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

vec3 ramp(float t){
  t = clamp(t, 0.0, 1.0);
  vec3 c = uCol[0];
  for (int i = 0; i < 5; i++){
    if (i + 1 >= uCount) break;
    float d = max(uPos[i + 1] - uPos[i], 0.0001);
    float k = clamp((t - uPos[i]) / d, 0.0, 1.0);
    c = mix(c, uCol[i + 1], k * k * (3.0 - 2.0 * k));
  }
  return c;
}

void main(){
  vec2 p  = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
  vec2 sd = vec2(uSeed * 3.71, uSeed * 1.93);
  vec2 q  = p * uScale + sd;
  float t = uTime;

  vec2 w = vec2(
    fbm(q + vec2(0.0, t * 0.18)),
    fbm(q + vec2(5.2, 1.3) - t * 0.13)
  );
  vec2 r = q + uWarp * w + uWarp * 0.6 * vec2(
    fbm(q * 1.7 + 3.0 * w + t * 0.07),
    fbm(q * 1.4 - 3.0 * w - t * 0.05)
  );

  float n   = fbm(r);
  float lin = dot(p, vec2(cos(uAngle), sin(uAngle))) * 0.85 + 0.5;
  float v   = mix(lin, n, uBlend);
  v = (v - 0.5) * uContrast + 0.5;

  vec3 col = ramp(v);
  col *= 1.0 - uVignette * smoothstep(0.35, 1.15, length(p));

  float g = hash(gl_FragCoord.xy + fract(t) * vec2(37.0, 17.0)) - 0.5;
  col += g * uGrain;
  col += (hash(gl_FragCoord.xy * 1.37 + 0.5) - 0.5) / 255.0;

  gl_FragColor = vec4(col, 1.0);
}`,{...t,seed:a}),!e){s.remove(),o.disconnect();return}r.push(e),new ResizeObserver(()=>e.start()).observe(i)}e&&e.setVisible(c)},{threshold:0});o.observe(i)}document.addEventListener(`visibilitychange`,()=>{if(!document.hidden)for(let e of r)e.start()})})();
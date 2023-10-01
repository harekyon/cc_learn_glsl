#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2 u_resolution;
void main(){
  vec2 pos = gl_FragCoord.xy / u_resolution.xy;
  vec3 RED = vec3(1.0,0.0,0.0);
  vec3 BLUE = vec3(0.0,0.0,1.0);

  vec3[4] col4 = vec3[](
    vec3(1.0,0.0,0.0),
    vec3(0.0,0.0,1.0),
    vec3(0.0,1.0,0.0),
    vec3(1.0,1.0,0.0)
  );
  pos.x *= 2.0;
  int ind = int(pos.x);
  // vec3 col = mix(col3[ind],col3[ind+1],fract(pos.x));
  vec3 col = mix(mix(col4[0],col4[1],pos.x),mix(col4[2],col4[3],pos.x),pos.y);

  fragColor = vec4(col,1);
}
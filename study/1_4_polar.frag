#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2 u_resolution;
uniform float u_time;

int channel;
void main(){
  vec2 pos = gl_FragCoord.xy/u_resolution.xy;
  vec3[4] col4 = vec3[](
    vec3(1.0,0.0,0.0),
    vec3(1.0,1.0,0.0),
    vec3(1.0,0.0,1.0),
    vec3(1.0,1.0,1.0)
  );
  float n = 10.0;


  pos *= n;
  channel = int(2.0*gl_FragCoord.x/u_resolution.x);
  if(channel == 0){
    pos = floor(pos)+step(0.5,fract(pos));
  }else{
    float thr = 0.5 * sin(u_time);
    pos = floor(pos) + smoothstep(0.5+thr, 0.5-thr,fract(pos));
  }
  pos /= n;
  vec3 col = mix(mix(col4[0],col4[1],pos.x),mix(col4[2],col4[3],pos.x),pos.y);
  fragColor = vec4(col,1.0);
}

const float PI = 3.1415926;
float atan2(float y, float x){
  if(x==0.0){
    return sign(y)*PI/2.0;
  }else{
    return atan(y,x);
  }
}
vec2 xy2pol(vec2 xy){
  return vec2(atan2(xy.y,xy.x),length(xy));
}
vec2 pol2xy(vec2 pol){
  return pol.y * vec2(cos(pol.x),sin(pol.x));
}
#version 300 es

precision highp float;
out vec4 fragColor;
uniform float u_time;
uniform vec2 u_resolution;

vec2 hash( vec2 p )
{
  p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
  return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise( in vec2 p )
{
  const float K1 = 0.366025404; // (sqrt(3)-1)/2;
  const float K2 = 0.211324865; // (3-sqrt(3))/6;
  
  vec2 i = floor( p + (p.x+p.y)*K1 );
  
  vec2 a = p - i + (i.x+i.y)*K2;
  vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0*K2;
  
  vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
  
  vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
  
  return dot( n, vec3(70.0) );
}

float fbm(vec2 uv)
{
  float f;
  mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
  f  = 0.5000*noise( uv ); uv = m*uv;
  f += 0.2500*noise( uv ); uv = m*uv;
  f += 0.1250*noise( uv ); uv = m*uv;
  f += 0.0625*noise( uv ); uv = m*uv;
  f = 0.5 + 0.5*f;
  return f;
}
vec3 HSVtoRGB(vec3 hsv)
{
	vec3 col;
	float hue = mod(hsv.r, 360.0);
	float s = max(0.0, min(1.0, hsv.g));
	float v = max(0.0, min(1.0, hsv.b));
	if(s > 0.0) {
		int h = int(floor(hue / 60.0));
		float f = hue / 60.0 - float(h);
		float p = v * (1.0 - s);
		float q = v * (1.0 - f * s);
		float r = v * (1.0 - (1.0 - f) * s);

		if(h == 0) col = vec3(v, r, p);
		else if(h == 1) col = vec3(q, v, p);
		else if(h == 2) col = vec3(p, v, r);
		else if(h == 3) col = vec3(p, q, v);
		else if(h == 4) col = vec3(r, p, v);
		else col = vec3(v, p, q);
	}else{
		col = vec3(v);
	}
	return col;
}

void main(){
    vec2 uv = (gl_FragCoord.xy / u_resolution.xy);
    uv *= 10.;
    // fragColor = vec4(0.0, floor(uv.x) * 0.1, floor(uv.y) * 0.1, 1.0);
    // fragColor = vec4(hash(uv).x,  1.0,hash(uv).y, 1.0);
    fragColor.rgb = HSVtoRGB(vec3(gl_FragCoord.x * 360.0, gl_FragCoord.y, 1.0));
    fragColor.a = 1.0;
}
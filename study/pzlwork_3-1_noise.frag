#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2 u_resolution;
uniform float u_time;
ivec2 channel;

//================================
//040 2.3 ビット円山を使ったハッシュ関数
//================================
const uint UINT_MAX = 0xffffffffu; //符号なし整数の最大値
uvec3 k = uvec3(0x456789abu, 0x6789ab45u, 0x89ab4567u); //算術積で使う定数
uvec3 u = uvec3(1,2,3); //シフト数
uvec2 uhash22(uvec2 n){
    n ^= (n.yx << u.xy);
    n ^= (n.yx >> u.xy);
    n *= k.xy;
    n ^= (n.yx << u.xy);
    return n * k.xy;
}
uvec3 uhash33 (uvec3 n){
    n ^= (n.yzx << u);
    n ^= (u.yzx >> u);
    n *= k;
    n ^= (n.yzx << u);
    return n * k;
}
vec2 hash22(vec2 p){
    uvec2 n = floatBitsToUint(p);
    return vec2(uhash22(n)) / vec2(UINT_MAX);
}
vec3 hash33(vec3 p){
    uvec3 n = floatBitsToUint(p);
    return vec3(uhash33(n)) / vec3(UINT_MAX);
}
float hash21(vec2 p){
    uvec2 n = floatBitsToUint(p);
    return float(uhash22(n).x)/float(UINT_MAX);
}
float hash31(vec3 p){
    uvec3 n = floatBitsToUint(p);
    return float(uhash33(n).x)/float(UINT_MAX);
}
// float vnoise21(vec2 p){//2次元値ノイズ
//     vec2 n = floor(p);
//     float[4] v;
//     for(int j = 0; j< 2; j++){
//         for(int i = 0;i<2;i++){
//             v[i+2*j] = hash21(n + vec2(i,j));//マスの４頂点のハッシュ値
//         }
//     }
//     vec2 f = fract(p);
//     if (channel == 1){
//         f = f * f * (3.0 -2.0 * f);
//     }
//     return mix(mix(v[0],v[1],f[0]),mix(v[2],v[3],f[0]),f[1])//左：双線形補完
// }
float vnoise21(vec2 p){
    vec2 n = floor(p);
    float[4] v;
    for (int j = 0; j < 2; j ++){
        for (int i = 0; i < 2; i++){
            v[i+2*j] = hash21(n + vec2(i, j));
        }
    }
    vec2 f = fract(p);
    if (channel == 1){
        f = f * f * (3.0 -2.0 * f); // Hermite interpolation
    }
    return mix(mix(v[0], v[1], f[0]), mix(v[2], v[3], f[0]), f[1]);
}


void main(){
    float time = floor(60.0 * u_time); //1秒ごとに60カウント
    vec2 pos = gl_FragCoord.xy/min(u_resolution.x,u_resolution.y);
    channel = int (gl_FragCoord.x*3.0/u_resolution.x);
    pos = 10.0 * pos + u_time;
    if(channel < 2){
        fragColor = vec4(vnoise21(pos));
    }else{
        fragColor = vec4(vnoise31(vec3(pos,u_time)));///右：3次元値ノイズ
    }

}

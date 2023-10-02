#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2 u_resolution;
uniform float u_time;

//================================
//040 2.3 ビット円山を使ったハッシュ関数
//================================
uint k = 0x456789abu; //算術積に使う大きな桁数の定数
const uint UINT_MAX = 0xffffffffu; //符号なし整数の最大値

uint uhash11(uint n){ //符号なし整数のハッシュ関数
    n ^= (n << 1); //1左シフトしてXOR
    n ^= (n >> 1); //1右シフトしてXOR
    n *= k; //算術積
    n ^= (n << 1); //左シフトしてXOR
    return n * k; //算術積
}
float hash11(float p){ //浮動小数点数のハッシュ関数
    uint n = floatBitsToUint(p); // ビット列を符号なし整数に変換
    return float(uhash11(n))/float(UINT_MAX); //値の正規化
}

void main(){
    float time = floor(60.0 * u_time); //1秒ごとに60カウント
    vec2 pos = gl_FragCoord.xy + time; //フラグメントをずらす
    fragColor.rgb = vec3(hash11(pos.x));
    fragColor.a = 1.0;
}

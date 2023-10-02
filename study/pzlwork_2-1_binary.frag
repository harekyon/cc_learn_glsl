#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2 u_resolution;
uniform float u_time;

//================================
//038 符号なし整数の可視化
//================================

void main(){
    vec2 pos = gl_FragCoord.xy/u_resolution.xy; //フラグメント座標範囲の正規化
    pos *= vec2(32.0,9.0); //座標のスケール
    uint[9] a = uint[]( //２進数表示する符号なし整数の配列
        uint(u_time), //a[0] 経過時間
        0xbu, //a[1] 符号なし整数としての16新数のB
        9u, //a[2] 符号なし整数としての9
        0xbu^9u, //a[3] XOR演算
        0xffffffffu,//[4]符号なし整数の最大値
        0xffffffffu + uint(u_time),//a[5]オーバーフロー
        floatBitsToUint(floor(u_time)),//a[6]浮動小数点数のビット列を符号なし
        floatBitsToUint(-floor(u_time)),//a[7]
        floatBitsToUint(30.5625)//a[8]
    );
    if(fract(pos.x)<0.1){
        if(floor(pos.x)==1.0){
            fragColor=vec4(1,0,0,1);
        }else if(floor(pos.x)==9.0){
            fragColor=vec4(0,1,0,1);
        }else{
            fragColor=vec4(0.5);
        }
    }else if(fract(pos.y)<0.1){
        fragColor = vec4(0.5);
    }else{
        uint b = a[int(pos.y)];
        b= (b << uint(pos.x) >> 31);
        fragColor = vec4(vec3(b),1.0);
    }
}
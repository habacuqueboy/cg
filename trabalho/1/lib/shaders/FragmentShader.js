const FragmentShader = (gl) => ({

    tipo: gl.FRAGMENT_SHADER ,

    codigo:`#version 300 es

    precision mediump float;

    in vec4 vColor; // recebe valor do vertex shader
    in vec2 vTexCord;
    in vec3 vPotenciaLuz;
    in float vUsarCor;

    uniform sampler2D uTex;

    out vec4 fragmentColor;

    void main() {
        if( vUsarCor == 1.0 ) {
            fragmentColor = vColor * vec4(vPotenciaLuz,1);
        } else {
            vec4 texColor = texture(uTex, vec2(vTexCord.s, vTexCord.t));
            fragmentColor = vec4(texColor.rgb * vPotenciaLuz, texColor.a);
        }
    }`
})

export default FragmentShader

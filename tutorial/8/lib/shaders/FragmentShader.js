const FragmentShader = (gl) => ({

    tipo: gl.FRAGMENT_SHADER ,

    codigo:`#version 300 es

    precision mediump float;

    in vec4 vColor; // recebe valor do vertex shader
    in vec2 vTexCord;
    in vec3 vPotenciaLuz;

    uniform sampler2D uTex;

    out vec4 fragmentColor;

    void main() {
        //fragmentColor = texture(uTex,vTexCord) * vColor;
        //fragmentColor = texture(uTex,vTexCord);
        vec4 texColor = texture(uTex, vec2(vTexCord.s, vTexCord.t));
        fragmentColor = vec4(texColor.rgb * vPotenciaLuz, texColor.a);
    }`
})

export default FragmentShader

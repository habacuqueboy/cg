const FragmentShader = (gl) => ({

    tipo: gl.FRAGMENT_SHADER ,

    codigo:`#version 300 es

    precision mediump float;

    in vec4 vColor; // recebe valor do vertex shader
    in vec2 vTexCord;

    uniform sampler2D uTex;

    out vec4 fragmentColor;

    void main() {
        //fragmentColor = texture(uTex,vTexCord) * vColor;
        fragmentColor = texture(uTex,vTexCord);
    }`
})

export default FragmentShader

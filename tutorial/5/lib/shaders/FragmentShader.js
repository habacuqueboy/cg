const FragmentShader = (gl) => ({

    tipo: gl.FRAGMENT_SHADER ,

    codigo:`#version 300 es

    precision mediump float;

    in vec4 vColor; // recebe valor do vertex shader

    out vec4 fragmentColor;

    void main() {
        fragmentColor = vColor;
    }`
})

export default FragmentShader

const VertexShader = (gl) => ({

    tipo: gl.VERTEX_SHADER ,

    codigo:`#version 300 es

    in vec4 aVertexPosition; // attribute == input specif to vertex
    in vec4 aVertexColor;
    in vec2 aTexCord;

    uniform mat4 uModelMatrix; // uniform input aplied to all vertex
    uniform mat4 uViewMatrix;
    uniform mat4 uProjectionMatrix;

    out vec4 vColor; // varying que vai para o fragment shader
    out vec2 vTexCord;

    void main() {
        gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;
        vColor = aVertexColor; 
        vTexCord = aTexCord;
    }`
})

export default VertexShader

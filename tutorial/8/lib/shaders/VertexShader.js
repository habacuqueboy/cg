const VertexShader = (gl) => ({

    tipo: gl.VERTEX_SHADER ,

    codigo:`#version 300 es

    uniform vec3 uCorAmbiente;
    uniform vec3 uDirecaoLuz;
    uniform vec3 uCorDifusa;
      
    uniform bool uUsarLuz;     

    in vec4 aVertexPosition; // attribute == input specif to vertex
    in vec3 aVertexNormal;
    in vec4 aVertexColor;
    in vec2 aTexCord;

    in vec3 aPotenciaLuz;

    uniform mat4 uModelMatrix; // uniform input aplied to all vertex
    uniform mat4 uViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat3 uNormalMatrix;

    out vec4 vColor; // varying que vai para o fragment shader
    out vec2 vTexCord;
    out vec3 vPotenciaLuz;

    void main() {
        gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;
        vTexCord = aTexCord;
        //vColor = aVertexColor; 
        if(!uUsarLuz) { vPotenciaLuz = vec3(1.0,1.0,1.0); }
        else {
            vec3 normalTransformado = uNormalMatrix * aVertexNormal;
            float potenciaLuz = max(dot(normalTransformado, uDirecaoLuz),0.0);
            vPotenciaLuz = uCorAmbiente + uCorDifusa * potenciaLuz;
        }
    }`
})

export default VertexShader

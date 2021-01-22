import { mat4 , vec3 } from '../../ext/gl-matrix/index.js'

const iniciarGL = () => {
    const canvas = document.querySelector("#canvas")  
    const gl = canvas.getContext("webgl2")
    if( !gl ) { throw new Error("WebGl não pôde ser inicializado") }
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height )
    return gl
}

const iniciarPrograma = (gl,shadersClasses) => {
    const shaderProgram = gl.createProgram()
    shadersClasses.map( sc => gl.attachShader( shaderProgram , carregaShader(gl,sc) ) ) 
    gl.linkProgram(shaderProgram)
    if(  !gl.getProgramParameter(shaderProgram, gl.LINK_STATUS) ) {
        const info = gl.getProgramInfoLog(shaderProgram)
        gl.deleteProgram(shaderProgram)
        throw new Error("Programa não pôde ser inicializado: "+ info)
    }
    gl.useProgram(shaderProgram)
    return shaderProgram
}

const iniciarLocations = (gl,programa) => {
    const locations = {}
    const nA = gl.getProgramParameter(programa, gl.ACTIVE_ATTRIBUTES)
    const nU = gl.getProgramParameter(programa, gl.ACTIVE_UNIFORMS)
    for( let i = 0 ; i < nA ; i++ ) { 
        const aName = gl.getActiveAttrib(programa,i).name
        const aLocation = gl.getAttribLocation(programa,aName)
        locations[aName] = aLocation
    }
    for( let i = 0 ; i < nU ; i++ ) { 
        const uName = gl.getActiveUniform(programa,i).name
        const uLocation = gl.getUniformLocation(programa,uName)
        locations[uName] = uLocation
    }
    return locations
}

const iniciarBuffers = (gl,formasClasses) => {
    return formasClasses.map( formaClasse => {
        const formaObj = formaClasse(gl)
        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER,buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(formaObj.vertices), gl.STATIC_DRAW);
        return { vertexPos : buffer , ...formaObj }
    })
}

const iniciarAmbiente = (gl) => {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
}

const initMatrix = (gl) => {

    const model = mat4.create()
    const view = mat4.create()
    const projection = mat4.create()

    const translation = vec3.create()

    mat4.perspective( projection , 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0 ),
    mat4.identity(model)
    mat4.identity(view)

    return { model , view , projection , translation }
}

const translate = (matrix,trans) => {
    vec3.set( matrix.translation , ...trans ) 
    mat4.translate( matrix.model , matrix.model , matrix.translation )
}

const setMatrixUniforms = (gl,locations,matrix) => {
    console.log(locations)
    console.log(matrix)
    gl.uniformMatrix4fv(locations.uProjectionMatrix,false,matrix.projection)
    gl.uniformMatrix4fv(locations.uModelMatrix,false,matrix.model)
    gl.uniformMatrix4fv(locations.uViewMatrix,false,matrix.view)
}

const desenharCena = (gl,locations,buffers,matrix,translations) => {
    gl.clear(gl.COLOR_BUFFER_BIT)
    const buf = buffers[0]
    const i = 0
    //buffers.forEach( (buf,i) => {
        const vao = gl.createVertexArray()
        gl.bindVertexArray(vao)
        gl.enableVertexAttribArray(locations.aVertexPosition)
        gl.vertexAttribPointer(locations.aVertexPosition,buf.itemSize,gl.FLOAT,false,0,0)
        translate(matrix,translations[0])
        setMatrixUniforms(gl,locations,matrix)
        gl.drawArrays(buf.tipo,0,buf.numItems)
    //})
}


const carregaShader = (gl,shaderClass) => {
    const shaderObj = shaderClass(gl)
    const shader = gl.createShader(shaderObj.tipo)
    gl.shaderSource(shader,shaderObj.codigo)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader)
        gl.deleteShader(shader)
        throw new Error('Ocorreu um erro compilado o shader: ' + info)
    }
    return shader
}


const init = (shadersClasses,formasClasses,translations) => {
    const gl = iniciarGL()
    const programa = iniciarPrograma(gl,shadersClasses)
    const locations = iniciarLocations(gl,programa)
    const buffers = iniciarBuffers(gl,formasClasses)
    const matrix = initMatrix(gl)
    iniciarAmbiente(gl)
    desenharCena(gl,locations,buffers,matrix,translations)
}

export default init

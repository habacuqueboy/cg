import { mat4 , vec3 } from '../../ext/gl-matrix/index.js'

const iniciarGL = (width,height) => {
    const canvas = document.querySelector("#canvas")  
    canvas.width = width
    canvas.height = height
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

const iniciarBuffers = (gl,locations,formasClasses) => {
    return formasClasses.map( formaClasse => {

        const formaObj = formaClasse(gl)

        // estado que vai ter os buffers
        const state = gl.createVertexArray()
        gl.bindVertexArray(state)

        // muda para o buffer de cor
        const colorBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(formaObj.color), gl.STATIC_DRAW);

        // aplica o buffer de cor no estado
        gl.enableVertexAttribArray(locations.aVertexColor);
        gl.vertexAttribPointer(locations.aVertexColor,4,gl.FLOAT,false,0,0)

        // muda para o buffer de posicao
        const positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(formaObj.vertices), gl.STATIC_DRAW);

        // aplica o buffer de posicao no estado
        gl.enableVertexAttribArray(locations.aVertexPosition);
        gl.vertexAttribPointer(locations.aVertexPosition,formaObj.itemSize,gl.FLOAT,false,0,0)


        return { state , ...formaObj }
    })
}

const iniciarAmbiente = (gl) => {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
}

const initMatrix = (gl) => {

    let model = mat4.create()
    const view = mat4.create()
    const projection = mat4.create()


    const pilha = []
    const [ , ,vW,vH] = gl.getParameter(gl.VIEWPORT)

    mat4.perspective( projection , 45, vW/vH , 0.1, 100.0 ),
    mat4.identity(model)
    mat4.identity(view)

    const push = () => pilha.push( mat4.clone(model) )
    const pop = () => {
        if( pilha.length == 0 ) { throw new Error('pop inválido') }
        model = pilha.pop()
    }

    return { model , view , projection , pop , push }
}

const translate = (matrix,trans) => {
    mat4.translate( matrix.model , matrix.model , trans )
}

const rotate = (matrix,degree,axis) => {
    mat4.rotate( matrix.model , matrix.model , degree * ( Math.PI / 180 ) , axis )
}

const setUnif = (gl,locations,matrix) => {
    gl.uniformMatrix4fv(locations.uProjectionMatrix,false,matrix.projection)
    gl.uniformMatrix4fv(locations.uModelMatrix,false,matrix.model)
    gl.uniformMatrix4fv(locations.uViewMatrix,false,matrix.view)
}

const desenharCena = (gl,locations,buffers) => {

    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.depthFunc(gl.LEQUAL) // ???

    const matrix = initMatrix(gl)

    buffers.forEach( (buf) => {
    
        gl.bindVertexArray(buf.state)

        translate(matrix,buf.translate)

        matrix.push()
        rotate(matrix,buf.rot,buf.rotAxis)
    
        setUnif(gl,locations,matrix)
        gl.drawArrays(buf.tipo,0,buf.numItems)

        matrix.pop()
    })
}

let last = 0
const animateBuilder = (gl,locations,buffers) => {
    return () => {
        desenharCena(gl,locations,buffers)
        const now = Date.now()
        if ( last != 0 ) { 
            const delta = now - last
            buffers.forEach( (buf) => {
                buf.rot +=  ( ( buf.rotStep * delta ) / 1000 ) % 360
            })
        }
        last = now
    }
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


const run = (width,height,shadersClasses,formasClasses,translations) => {

    const gl = iniciarGL(width,height)
    const programa = iniciarPrograma(gl,shadersClasses)
    const locations = iniciarLocations(gl,programa)
    const buffers = iniciarBuffers(gl,locations,formasClasses)
    const animate = animateBuilder(gl,locations,buffers)

    const tick = () => {
        requestAnimationFrame(tick)
        animate()
    }

    iniciarAmbiente(gl)
    tick()

}

export default { run }

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
        gl.vertexAttribPointer(locations.aVertexColor,formaObj.colorNumItems,gl.FLOAT,false,0,0)

        // muda para o buffer de posicao
        const positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(formaObj.vertices), gl.STATIC_DRAW);

        // aplica o buffer de posicao no estado
        gl.enableVertexAttribArray(locations.aVertexPosition);
        gl.vertexAttribPointer(locations.aVertexPosition,formaObj.itemSize,gl.FLOAT,false,0,0)

        if( formaObj.index ) {
            console.log(formaObj.index)
            // muda para o buffer de indices
            const indexBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer)
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(formaObj.index), gl.STATIC_DRAW);
        }


        return { state , ...formaObj }
    })
}

const iniciarAmbiente = (gl) => {
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
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

const translate = (model,trans) => {
    mat4.translate( model , model , trans )
}

const rotate = (model,degree,axis) => {
    mat4.rotate( model , model , degree * ( Math.PI / 180 ) , axis )
}

const setUnif = (gl,locations,p,m,v) => {
    gl.uniformMatrix4fv(locations.uProjectionMatrix,false,p)
    gl.uniformMatrix4fv(locations.uModelMatrix,false,m)
    gl.uniformMatrix4fv(locations.uViewMatrix,false,v)
}

const desenharCena = (gl,locations,buffers) => {

    gl.clearDepth(1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    let model = mat4.create()
    const view = mat4.create()
    const projection = mat4.create()

    const [ , ,vW,vH] = gl.getParameter(gl.VIEWPORT)
    mat4.perspective( projection , 45, vW/vH , 0.1, 100.0 ),
    mat4.identity(model)
    mat4.identity(view)

    const pilha = []

    buffers.forEach( (buf) => {
    
        gl.bindVertexArray(buf.state)

        translate(model,buf.translate)
        pilha.push( mat4.clone(model) )

        rotate(model,buf.rot,buf.rotAxis)
    
        setUnif(gl,locations,projection,model,view)

        if( buf.index ) { gl.drawElements( buf.tipo, buf.indexNumItems , gl.UNSIGNED_SHORT , 0 ) } 
        else { gl.drawArrays(buf.tipo,0,buf.numItems) }

        model = pilha.pop()

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

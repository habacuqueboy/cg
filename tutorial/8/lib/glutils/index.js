import { mat3 , mat4 , vec3 } from '../../ext/gl-matrix/index.js'

let xVel = 0
let yVel = 0
let z = -5.0
let filtro = 0

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

        const texture = Array.from( new Array(3) , () => gl.createTexture() )

        if( formaObj.texCord ) {
            // muda para o buffer de texturas
            const texCordBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER,texCordBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(formaObj.texCord) , gl.STATIC_DRAW )
            // aplica o buffer de texturas no estado
            gl.enableVertexAttribArray(locations.aTexCord);
            gl.vertexAttribPointer(locations.aTexCord,formaObj.texCordItemSize,gl.FLOAT,false,0,0)

            //cria textura
            const image = new Image()
            image.src = formaObj.texSrc

            image.onload = () => {

                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
                gl.bindTexture(gl.TEXTURE_2D, texture[0])
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)

                gl.bindTexture(gl.TEXTURE_2D, texture[1])
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,image)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

                gl.bindTexture(gl.TEXTURE_2D, texture[2])
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,image)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST)
                gl.generateMipmap(gl.TEXTURE_2D)

            }


        } else if( formaObj.color ) {

            // muda para o buffer de cor
            const colorBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(formaObj.color), gl.STATIC_DRAW);
            // aplica o buffer de cor no estado
            gl.enableVertexAttribArray(locations.aVertexColor);
            gl.vertexAttribPointer(locations.aVertexColor,formaObj.colorNumItems,gl.FLOAT,false,0,0)

    }

        // muda para o buffer de posicao
        const positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(formaObj.vertices), gl.STATIC_DRAW);

        // aplica o buffer de posicao no estado
        gl.enableVertexAttribArray(locations.aVertexPosition);
        gl.vertexAttribPointer(locations.aVertexPosition,formaObj.itemSize,gl.FLOAT,false,0,0)

        if( formaObj.index ) {
            // muda para o buffer de indices
            const indexBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer)
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(formaObj.index), gl.STATIC_DRAW)
        }



        return { state , texture , ...formaObj }
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

const translate = (model) => {
    mat4.translate( model , model , [0,0,z] )
}

const rotate = (model,rot,axis) => {
    mat4.rotate( model , model , rot[0] * ( Math.PI / 180 ) , [1,0,0] )
    mat4.rotate( model , model , rot[1] * ( Math.PI / 180 ) , [0,1,0] )
}

const setUnif = (gl,locations,p,m,v) => {
    if( document.getElementById("luz").checked ) {

        gl.uniform1i(locations.uUsarLuz,true)
        
        gl.uniform3f(
            locations.uCorAmbiente,
            parseFloat(document.getElementById("ar").value),
            parseFloat(document.getElementById("ag").value),
            parseFloat(document.getElementById("ab").value)
        )
        
        const direcaoLuz = [
             parseFloat(document.getElementById("dx").value),
             parseFloat(document.getElementById("dy").value),
             parseFloat(document.getElementById("dz").value)
        ]

        const direcaoNormalizada = vec3.create();
        vec3.normalize(direcaoLuz, direcaoNormalizada);
        vec3.scale(direcaoNormalizada, -1);
        gl.uniform3fv(locations.uDirecaoLuz, direcaoNormalizada);

        const matrizNormal = mat3.create();
        mat3.normalFromMat4(m, matrizNormal);
        mat3.transpose(matrizNormal, matrizNormal);
        gl.uniformMatrix3fv(locations.uNormalMatrix, false, matrizNormal);
    } else { gl.uniform1i(locations.uUsarLuz,false) }
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
        gl.bindTexture(gl.TEXTURE_2D, buf.texture[filtro])

        translate(model,buf.translate)
        pilha.push( mat4.clone(model) )

        rotate(model,buf.rot)
    
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
                buf.rot[0] +=  ( ( xVel * delta ) / 1000 ) % 360
                buf.rot[1] +=  ( ( yVel * delta ) / 1000 ) % 360
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

const teclasPressionadas = {}

const down = (e) => {
  teclasPressionadas[e.keyCode] = true;
  if (String.fromCharCode(e.keyCode) == "F") {
    filtro = (filtro+1) % 3;
  }
}
const up = (e) => teclasPressionadas[e.keyCode] = false

const tratarTeclado = () => {
  if (teclasPressionadas[33]) {
    // Page Up
    z -= 0.05;
  }
  if (teclasPressionadas[34]) {
    // Page Down
    z += 0.05;
  }
  if (teclasPressionadas[37]) {
    // Esquerda
    yVel -= 1;
  }
  if (teclasPressionadas[39]) {
    // Direita
    yVel += 1;
  }
  if (teclasPressionadas[38]) {
    // Cima
    xVel -= 1;
  }
  if (teclasPressionadas[40]) {
    // Baixo
    xVel += 1;
  }
}

const run = (width,height,shadersClasses,formasClasses,translations) => {

    const gl = iniciarGL(width,height)
    const programa = iniciarPrograma(gl,shadersClasses)
    const locations = iniciarLocations(gl,programa)
    const buffers = iniciarBuffers(gl,locations,formasClasses)
    const animate = animateBuilder(gl,locations,buffers)

    const tick = () => {
        requestAnimationFrame(tick)
        tratarTeclado()
        animate()
    }

    iniciarAmbiente(gl)
    document.onkeydown = down
    document.onkeyup = up

    tick()

}

export default { run }

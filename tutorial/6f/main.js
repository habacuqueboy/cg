import { VertexShader , FragmentShader } from './lib/shaders/index.js'
import { CuboTextura } from './lib/formas/index.js'
import glutils from './lib/glutils/index.js' 

const main = () => {
    const status = document.querySelector("#status")
    try {
        glutils.run( 500,500, [ VertexShader, FragmentShader ],
            [ 
              CuboTextura(
                  [3.0, 0.0, 0.0], // translacao
                  0, // initial rotation
                  [1,1,1], // rotation axis
                  75, // rotation step
                  './assets/crate.jpg', // texture src
              ),


            ],
        )
        status.remove()
    } catch(e) {
        status.innerHTML = 'Erro carregando aplicação'
        console.log(e)
    }
}




window.onload = main

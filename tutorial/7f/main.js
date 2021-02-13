import { VertexShader , FragmentShader } from './lib/shaders/index.js'
import { CuboTextura } from './lib/formas/index.js'
import glutils from './lib/glutils/index.js' 

const main = () => {
    const status = document.querySelector("#status")
    try {
        glutils.run( 500,500, [ VertexShader, FragmentShader ],
            [ 
              CuboTextura(
                  [0.0, 0.0, -5.0], // translacao
                  [0,0,0], // initial rotation x y z
                  [90,75,50], // rotation step
                  './assets/caixa.gif', // texture src
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

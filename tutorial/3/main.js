import { VertexShader , FragmentShader } from './lib/shaders/index.js'
import { Triangulo , Quadrado } from './lib/formas/index.js'
import glutils from './lib/glutils/index.js' 

const main = () => {
    const status = document.querySelector("#status")
    try {
        glutils.run( 500,500, [ VertexShader, FragmentShader ],
            [ 
              
              Triangulo(
                [
                   1.0, 0.0, 0.0, 1.0,
                   0.0, 1.0, 0.0, 1.0,
                   0.0, 0.0, 1.0, 1.0,
                ],
                [-1.5,1.0,-7.0]

              ), 

              Quadrado(
                  [0.5, 0.5, 1.0], // cor
                  [3.0, 0.0, 0.0], // translacao
              ) 

            ],
        )
        status.remove()
    } catch(e) {
        status.innerHTML = 'Erro carregando aplicação'
        console.log(e)
    }
}




window.onload = main

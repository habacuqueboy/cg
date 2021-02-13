import { VertexShader , FragmentShader } from './lib/shaders/index.js'
import { Piramide , Trapezio , Quadrado , Triangulo , CuboTextura } from './lib/formas/index.js'
import glutils from './lib/glutils/index.js' 

const main = () => {
    const status = document.querySelector("#status")
    try {
        glutils.run( 500,500, [ VertexShader, FragmentShader ],
            [ 
              Triangulo(
                  [1,1,0.0], //cor
                  [0.0, 2.5, -7.0], // translacao
              ),

              Trapezio(
                  [0.8,0.0,0.0], 
                  [0.0, -0.5, -7.0], 
              ),

              Trapezio(
                  [0.8,0.0,0.0], 
                  [0.0, -2.0, 0.0], 
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

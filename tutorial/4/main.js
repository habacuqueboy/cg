import { VertexShader , FragmentShader } from './lib/shaders/index.js'
import { Triangulo , Quadrado , Piramide , Cubo } from './lib/formas/index.js'
import glutils from './lib/glutils/index.js' 

const main = () => {
    const status = document.querySelector("#status")
    try {
        glutils.run( 500,500, [ VertexShader, FragmentShader ],
            [ 
              
              Piramide(
                [
                    // Frente
                    1.0, 0.0, 0.0, 1.0,
                    0.0, 1.0, 0.0, 1.0,
                    0.0, 0.0, 1.0, 1.0,
                    // Direita
                    1.0, 0.0, 0.0, 1.0,
                    0.0, 0.0, 1.0, 1.0,
                    0.0, 1.0, 0.0, 1.0,
                    // Trás
                    1.0, 0.0, 0.0, 1.0,
                    0.0, 1.0, 0.0, 1.0,
                    0.0, 0.0, 1.0, 1.0,
                    // Esquerda
                    1.0, 0.0, 0.0, 1.0,
                    0.0, 0.0, 1.0, 1.0,
                    0.0, 1.0, 0.0, 1.0
                ],
                [-1.5,1.0,-7.0],
                0, 
                [0,1,0],
                90,
              ), 

              Cubo(
                  [
                    [1.0, 0.0, 0.0, 1.0],     // Frente
                    [1.0, 1.0, 0.0, 1.0],     // Trás
                    [0.0, 1.0, 0.0, 1.0],     // Topo
                    [1.0, 0.5, 0.5, 1.0],     // Base
                    [1.0, 0.0, 1.0, 1.0],     // Direita
                    [0.0, 0.0, 1.0, 1.0],     // Esquerda
                  ],
                  [3.0, 0.0, 0.0], // translacao
                  0, // initial rotation
                  [1,1,1], // rotation axis
                  75, // rotation step
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

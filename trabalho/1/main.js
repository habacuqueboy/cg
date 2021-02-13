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
                  [0.0, 3.5, -9.0], // translacao
                  [0,0,1] 
              ),

              Trapezio(
                  [0.8,0.0,0.0], 
                  [0.0, -0.0, -8.0], 
                  [0,0,1] 
              ),

              Trapezio(
                  [0.8,0.0,0.0], 
                  [0.0, -2.1, 0.0], 
                  [0,0,1] 
              ),

              Trapezio(
                  [0.8,0.0,0.0], 
                  [0.0, -2.1, 0.0], 
                  [180,0,1] // rotacione 180 em x , 0 em y , e nao atualize y no teclado
              ),

              Triangulo(
                  [0,1,0.0], //cor
                  [-3.1, 0, 0.0], // translacao
              ),

              Triangulo(
                  [0,1,0.0], //cor
                  [6.2, 0, 0.0], // translacao
              ),

              Trapezio(
                  [0.8,0.0,0.0], 
                  [-3.0, -2.1, 0.0], 
                  [180,0,1],
              ),

              Triangulo(
                  [0,1,0.0], //cor
                  [-3.1, 0, 0.0], // translacao
              ),

              Triangulo(
                  [0,1,0.0], //cor
                  [6.2, 0, 0.0], // translacao
              ),

              Trapezio(
                  [0.8,0.0,0.0], 
                  [-3.1, -2.1, 0.0], 
                  [0,0,1] 
              ),

              Triangulo(
                  [0,1,0.0], //cor
                  [3.1, 0, 0.0], // translacao
                  [180,0,0],
              ),

              Triangulo(
                  [0,1,0.0], //cor
                  [1.1, 0, 0.0], // translacao
              ),

              Triangulo(
                  [0,1,0.0], //cor
                  [-7.3, 0, 0.0], // translacao
                  [180,0,0],
              ),

              Triangulo(
                  [0,1,0.0], //cor
                  [-1.1, 0, 0.0], // translacao
              ),

              CuboTextura(
                  [4.35, -2.0, 0.0], // translacao
                  [0,0,1], // atualize y no teclado
                  [0,0,0], // rotation step
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

import VertexShader from './lib/shaders/VertexShader.js'
import FragmentShader from './lib/shaders/FragmentShader.js'
import Triangulo from './lib/formas/Triangulo.js'
import Quadrado from './lib/formas/Quadrado.js'
import init from './lib/glutils/index.js' 

const main = () => {
    const status = document.querySelector("#status")
    try {
        init(
            500,500,
            [VertexShader,FragmentShader],
            [Triangulo,Quadrado],
            [ [-1.5, 1.0, -7.0] , [3.0, 0.0, 0.0] ]
        )
        status.remove()
    } catch(e) {
        status.innerHTML = 'Erro carregando aplicação'
        console.log(e)
    }
}




window.onload = main

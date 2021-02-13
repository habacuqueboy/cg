import { FormaBase } from './utils.js'

const Piramide = (cor,translate,rot,rotStep) => {

    const build = (gl) => FormaBase(
          [
            // Frente
              0.0,  1.0,  0.0,
             -1.0, -1.0,  1.0,
              1.0, -1.0,  1.0,
            // Direita
              0.0,  1.0,  0.0,
              1.0, -1.0,  1.0,
              1.0, -1.0, -1.0,
            // Trás
              0.0,  1.0,  0.0,
              1.0, -1.0, -1.0,
             -1.0, -1.0, -1.0,
            // Esquerda
              0.0,  1.0,  0.0,
             -1.0, -1.0, -1.0,
             -1.0, -1.0,  1.0
          ],
          cor,4,3,12,gl.TRIANGLES,translate,rot,rotStep
    )

    return build
}

export default Piramide

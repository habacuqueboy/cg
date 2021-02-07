import { FormaBase } from './utils.js'

const Cubo = (cor,translate,rot,rotAxis,rotStep) => {

    const build = (gl) => FormaBase(
          [
               // Frente
              -1.0, -1.0,  1.0,
               1.0, -1.0,  1.0,
               1.0,  1.0,  1.0,
              -1.0,  1.0,  1.0,

              // Trás
              -1.0, -1.0, -1.0,
              -1.0,  1.0, -1.0,
               1.0,  1.0, -1.0,
               1.0, -1.0, -1.0,

              // Topo
              -1.0,  1.0, -1.0,
              -1.0,  1.0,  1.0,
               1.0,  1.0,  1.0,
               1.0,  1.0, -1.0,

              // Base
              -1.0, -1.0, -1.0,
               1.0, -1.0, -1.0,
               1.0, -1.0,  1.0,
              -1.0, -1.0,  1.0,

              // Direita
               1.0, -1.0, -1.0,
               1.0,  1.0, -1.0,
               1.0,  1.0,  1.0,
               1.0, -1.0,  1.0,

              // Esquerda
              -1.0, -1.0, -1.0,
              -1.0, -1.0,  1.0,
              -1.0,  1.0,  1.0,
              -1.0,  1.0, -1.0,

          ],cor,4,3,24,gl.TRIANGLES,translate,rot,rotAxis,rotStep,
          [
            0, 1, 2,      0, 2, 3,    // Frente
            4, 5, 6,      4, 6, 7,    // Trás
            8, 9, 10,     8, 10, 11,  // Topo
            12, 13, 14,   12, 14, 15, // Base
            16, 17, 18,   16, 18, 19, // Direita
            20, 21, 22,   20, 22, 23  // Esquerda
          ],1,36
    )

    return build
}

export default Cubo

import { FormaBase } from './utils.js'

const Triangulo = (cor) => {

    const build = (gl) => FormaBase(
          [
            0.0, 1.0, 0.0,
            1.0,-1.0, 0.0,
           -1.0,-1.0, 0.0,
          ],
          cor,3,3,gl.TRIANGLES
    )

    return build
}

export default Triangulo

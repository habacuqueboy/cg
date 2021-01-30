import { FormaBase } from './utils.js'

const Quadrado = (cor) => {

    const build = (gl) => FormaBase(
          [
            1.0, 1.0, 0.0,
           -1.0, 1.0, 0.0,
            1.0,-1.0, 0.0,
           -1.0,-1.0, 0.0
          ],
          cor,3,4,gl.TRIANGLE_STRIP
    )

    return build
}

export default Quadrado

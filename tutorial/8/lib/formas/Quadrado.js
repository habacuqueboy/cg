import { FormaBase } from './utils.js'

const Quadrado = (cor,translate,rot,rotStep) => {

    const build = (gl) => FormaBase(
          [
            1.0, 1.0, 0.0,
           -1.0, 1.0, 0.0,
            1.0,-1.0, 0.0,
           -1.0,-1.0, 0.0
          ],
          cor,4,3,4,gl.TRIANGLE_STRIP,translate,rot,rotStep
    )

    return build
}

export default Quadrado

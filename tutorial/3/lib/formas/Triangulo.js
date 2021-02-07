import { FormaBase } from './utils.js'

const Triangulo = (cor,translate,rot,rotAxis) => {

    const build = (gl) => FormaBase(
          [
            0.0, 1.0, 0.0,
           -1.0,-1.0, 0.0,
            1.0,-1.0, 0.0,
          ],
          cor,3,3,gl.TRIANGLES,translate,rot,rotAxis
    )

    return build
}

export default Triangulo

const Quadrado = (gl) => ({
    vertices : [
        1.0, 1.0, 0.0,
        -1.0, 1.0, 0.0,
        1.0,-1.0, 0.0,
        -1.0,-1.0, 0.0
    ],
    itemSize: 3,
    numItems: 4,
    tipo: gl.TRIANGLE_STRIP,
})

export default Quadrado

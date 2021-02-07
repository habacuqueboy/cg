const repeatArray = (base,num) => Array.from( new Array(num) , () => base ).flat()

const genColor = (color,itemSize,numItems) => {
    if( color.length == (4*numItems) ) { return color }
    else if(  color.length == 3 ) { return repeatArray([...color,1],numItems) }
    else if(  color.length == 4 ) { return repeatArray(color,numItems) }
    else { throw new Error('invalid color \n' + color ) }
}

const FormaBase = (vertices,color,itemSize,numItems,tipo, translate = [0,0,0] , rot = 0 , rotAxis = [0,1,0] ) => ({
    vertices,
    color : genColor(color,itemSize,numItems),
    itemSize,
    numItems,
    tipo,
    translate,
    rot,
    rotAxis,
})

export { FormaBase }

const repeatArray = (base,num) => Array.from( new Array(num) , () => base ).flat()

const genColor = (color,itemSize,numItems) => {
    if( color.length == (4*numItems) ) { return color }
    else if(  color.length == 3 ) { return repeatArray([...color,1],numItems) }
    else if(  color.length == 4 ) { return repeatArray(color,numItems) }
    else { throw new Error('invalid color \n' + color ) }
}

const FormaBase = (vertices,color,itemSize,numItems,tipo) => ({
    vertices,
    color : genColor(color,itemSize,numItems),
    itemSize,
    numItems,
    tipo,
})

export { FormaBase }

function getCubeMap(gl){
    let cubemap = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemap);
    const faceInfos = [
        {
            target:gl.TEXTURE_CUBE_MAP_POSITIVE_X,
            url:"../tex/TEXTURE_CUBE_MAP_POSITIVE_X.png",
        },
        {
            target:gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            url:'../tex/TEXTURE_CUBE_MAP_POSITIVE_Y.png',
        },
        {
            target:gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            url:'../tex/TEXTURE_CUBE_MAP_POSITIVE_Z.png',
        },
        {
            target:gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            url:'../tex/TEXTURE_CUBE_MAP_NEGATIVE_X.png',
        },
        {
            target:gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            url:'../tex/TEXTURE_CUBE_MAP_NEGATIVE_Y.png',
        },
        {
            target:gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
            url:'../tex/TEXTURE_CUBE_MAP_NEGATIVE_Z.png',
        },
    ];

    faceInfos.forEach((faceInfo)=>{
        const {target,url} = faceInfo;
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 256;
        const height = 256;
        const format = gl.RGBA;
        const type = gl.UNSIGNED_BYTE;
        gl.texImage2D(target,level,internalFormat,width,height,0,format,type,null);
        const image = new Image();
        image.src = url;
        image.addEventListener('load',function (){
            gl.bindTexture(gl.TEXTURE_CUBE_MAP,cubemap);
            gl.texImage2D(target,level,internalFormat,format,type,image);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        });
    });
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    // gl.bindTexture(gl.TEXTURE_CUBE_MAP,null);

    return cubemap;
}
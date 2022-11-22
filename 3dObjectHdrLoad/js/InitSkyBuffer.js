function InitSkyBuffers(gl) {

    let skyPosition = new Float32Array([
        -10.0,  10.0, -10.0,
        -10.0, -10.0, -10.0,
        10.0, -10.0, -10.0,
        10.0, -10.0, -10.0,
        10.0,  10.0, -10.0,
        -10.0,  10.0, -10.0,

        -10.0, -10.0,  10.0,
        -10.0, -10.0, -10.0,
        -10.0,  10.0, -10.0,
        -10.0,  10.0, -10.0,
        -10.0,  10.0,  10.0,
        -10.0, -10.0,  10.0,

        10.0, -10.0, -10.0,
        10.0, -10.0,  10.0,
        10.0,  10.0,  10.0,
        10.0,  10.0,  10.0,
        10.0,  10.0, -10.0,
        10.0, -10.0, -10.0,

        -10.0, -10.0,  10.0,
        -10.0,  10.0,  10.0,
        10.0,  10.0,  10.0,
        10.0,  10.0,  10.0,
        10.0, -10.0,  10.0,
        -10.0, -10.0,  10.0,

        -10.0,  10.0, -10.0,
        10.0,  10.0, -10.0,
        10.0,  10.0,  10.0,
        10.0,  10.0,  10.0,
        -10.0,  10.0,  10.0,
        -10.0,  10.0, -10.0,

        -10.0, -10.0, -10.0,
        -10.0, -10.0,  10.0,
        10.0, -10.0, -10.0,
        10.0, -10.0, -10.0,
        -10.0, -10.0,  10.0,
        10.0, -10.0,  10.0,
    ]);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(skyPosition), gl.STATIC_DRAW);


    let vertexSkybox = new Float32Array([
        1.0,  1.0,  1.0,  // v0
        -1.0,  1.0,  1.0,  // v1
        -1.0, -1.0,  1.0,  // v2
        1.0, -1.0,  1.0,  // v3
        1.0, -1.0, -1.0,  // v4
        1.0,  1.0, -1.0,  // v5
        -1.0,  1.0, -1.0,  // v6
        -1.0, -1.0, -1.0,  // v7
    ]);
    const skyCoord = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, skyCoord);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexSkybox), gl.STATIC_DRAW);

    let skyboxIndex = new Uint16Array([
        0, 1, 2,   0, 2, 3,    // front
        0, 3, 4,   0, 4, 5,    // right
        0, 5, 6,   0, 6, 1,    // up
        1, 6, 7,   1, 7, 2,    // left
        7, 4, 3,   7, 3, 2,    // down
        4, 7, 6,   4, 6, 5     // back
    ]);
    const skyBoxIndex = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, skyBoxIndex);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(skyboxIndex), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        texCoord: skyCoord,
        indices: skyBoxIndex,
    };
}
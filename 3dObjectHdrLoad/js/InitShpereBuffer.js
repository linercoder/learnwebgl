function InitShpereBuffers(gl) {

    let latitudeBands = 50;
    let longitudeBands = 50;
    let radius = 1.5;
    let positionData = [];
    let normalData = [];
    let indexData = [];
    let textureCoordData = [];

    for(let latNumber = 0; latNumber<=latitudeBands;latNumber++){
        let theta = latNumber * Math.PI / latitudeBands;
        let sinTheta = Math.sin(theta);
        let cosTheta = Math.cos(theta);
        for(let longNumber = 0; longNumber<=longitudeBands;longNumber++){
            let phi = longNumber * 2 * Math.PI / longitudeBands;
            let sinPhi = Math.sin(phi);
            let cosPhi = Math.cos(phi);

            let x = radius * cosPhi * sinTheta;
            let y = radius * cosTheta;
            let z = radius * sinPhi * sinTheta;

            let u = 1 - (longNumber / longitudeBands);
            let v = 1 - (latNumber / latitudeBands);

            positionData.push(radius * x);
            positionData.push(radius * y);
            positionData.push(radius * z);

            textureCoordData.push(u);
            textureCoordData.push(v);

            normalData.push(x);
            normalData.push(y);
            normalData.push(z);
        }
    }

    for (let latNumber = 0; latNumber < latitudeBands; latNumber++){
        for(let  longNumber = 0; longNumber < longitudeBands; longNumber++){
            let A = (latNumber * (longitudeBands + 1)) + longNumber;
            let B = A + longitudeBands + 1;
            let C = A + 1;
            let D = B + 1;

            indexData.push(A);
            indexData.push(B);
            indexData.push(C);

            indexData.push(C);
            indexData.push(B);
            indexData.push(D);
        }
    }

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionData), gl.STATIC_DRAW);

    let normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData),gl.STATIC_DRAW);

    let textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordData),gl.STATIC_DRAW);

    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indexData), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        normal: normalBuffer,
        textureCoord: textureCoordBuffer,
        indices: indexData,
    };
}
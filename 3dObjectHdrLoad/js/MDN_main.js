import './InitShader.js';
import './CubeMap.js';
import './TextureLoader.js';
import './CameraView.js';
import './InitShpereBuffer.js';
import './InitSkyBuffer.js';

// let cubeRotation = 0.0;

main();

function main() {
    const canvas = document.querySelector('#glcanvas');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    const shpere_vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexNormal;
    attribute vec2 aTextureCoord;
    uniform mat4 uNormalMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uModelMatrix;
    uniform mat4 uMvpMatrix;
    uniform mat4 uProjectionMatrix;
    varying vec2 vTextureCoord;
    varying vec4 vNormal;
    varying vec3 vPosition;
    void main(void) {
        vTextureCoord = aTextureCoord;
        vNormal = normalize(aVertexNormal * uModelMatrix);
        vPosition = (uModelMatrix * aVertexPosition).xyz;
        gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;
    }
  `;
    const shpere_fsSource = `
    precision mediump float;
    varying vec2 vTextureCoord;
    varying vec4 vNormal;
    varying vec3 vPosition;
    uniform vec3 uLight;
    uniform mat4 uViewMatrix;
    uniform sampler2D uSampler;
    void main(void) {
        vec3 ambientColor = vec3(0,0,0.1);
        vec3 lightColor = vec3(1,1,1);
        vec3 specularColor = vec3(1,1,1);
        vec3 cameraPosition = vec3(0.0,0.0,-10.0); 
        // vec4 texelColor = texture2D(uSampler, vTextureCoord);
        vec4 texelColor = vec4(1,0,0,0);
        vec3 diffuse = texelColor.xyz * lightColor * max(0.0,dot(vNormal.xyz,normalize(uLight)));
        vec3 viewDir = normalize(cameraPosition - vPosition);
        vec3 halfDir = normalize(uLight + viewDir);
        vec3 specular = lightColor * specularColor * pow(max(0.0,dot(vNormal.xyz,halfDir)),4.0);
        gl_FragColor = vec4(ambientColor + diffuse + specular, 1.0);
    }
  `;

    const env_vsSource = `
    attribute vec4 aVertexPosition;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uModelMatrix;
    varying vec3 vSkyCoord;
    void main(void) {
        vec4 p = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;
        gl_Position = p.xyww;
        vSkyCoord = aVertexPosition.xyz;
    }
    `;
    const env_fsSource = `
    precision mediump float;
    uniform samplerCube uSkybox;
    varying vec3 vSkyCoord;
    void main(void) {
        gl_FragColor = textureCube(uSkybox, vSkyCoord);
    }
    `;


    const shpere_shaderProgram = initShaderProgram(gl, shpere_vsSource, shpere_fsSource);
    const env_shaderProgram = initShaderProgram(gl, env_vsSource, env_fsSource);

    const shpere_programInfo = {
        program: shpere_shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shpere_shaderProgram, 'aVertexPosition'),
            vertexNormal: gl.getAttribLocation(shpere_shaderProgram, 'aVertexNormal'),
            textureCoord: gl.getAttribLocation(shpere_shaderProgram, 'aTextureCoord'),
        },
        uniformLocations: {
            ProjectionMatrix: gl.getUniformLocation(shpere_shaderProgram, 'uProjectionMatrix'),
            ViewMatrix: gl.getUniformLocation(shpere_shaderProgram, 'uViewMatrix'),
            ModelMatrix: gl.getUniformLocation(shpere_shaderProgram, 'uModelMatrix'),
            NormalMatrix: gl.getUniformLocation(shpere_shaderProgram, 'uNormalMatrix'),
            light: gl.getUniformLocation(shpere_shaderProgram, 'uLight'),
        }
    };
    const env_programInfo = {
        program: env_shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(env_shaderProgram, 'aVertexPosition'),
            vertexNormal: gl.getAttribLocation(env_shaderProgram, 'aVertexNormal'),
            skyCoord: gl.getAttribLocation(env_shaderProgram, 'aSkyCoord'),
        },
        uniformLocations: {
            ProjectionMatrix: gl.getUniformLocation(env_shaderProgram, 'uProjectionMatrix'),
            ModelMatrix: gl.getUniformLocation(env_shaderProgram, 'uModelMatrix'),
            ViewMatrix: gl.getUniformLocation(env_shaderProgram, 'uViewMatrix'),
            SkyboxLocation:gl.getUniformLocation(env_shaderProgram, "uSkybox"),
        }
    };

    drawScene(gl, shpere_programInfo, env_programInfo);

    // function render() {
    //     drawScene(gl, shpere_programInfo, env_programInfo);
    //     requestAnimationFrame(render);
    // }
    // requestAnimationFrame(render);
}

function drawScene(gl, shpere_programInfo, env_programInfo) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    drawShpere(gl,shpere_programInfo);
    drawSky(gl,env_programInfo);

}

function drawSky(gl,env_programInfo){
    gl.depthFunc(gl.LEQUAL);

    const skyTexture = getCubeMap(gl);
    const skyBuffer = InitSkyBuffers(gl);

    const viewMatrix = mat4.create();
    const modelMatrix = mat4.create();
    const porjectionMatrix = CameraView(gl);

    mat4.lookAt(viewMatrix,[0,0,10],[0,0,0],[0,1,0]);

    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, skyBuffer.position);
        gl.vertexAttribPointer(
            env_programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            env_programInfo.attribLocations.vertexPosition);
    }

    gl.useProgram(env_programInfo.program);

    gl.uniformMatrix4fv(
        env_programInfo.uniformLocations.ProjectionMatrix,
        false,
        porjectionMatrix);
    gl.uniformMatrix4fv(
        env_programInfo.uniformLocations.ViewMatrix,
        false,
        viewMatrix);
    gl.uniformMatrix4fv(
        env_programInfo.uniformLocations.ModelMatrix,
        false,
        modelMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP,skyTexture);
    gl.uniform1i(env_programInfo.uniformLocations.SkyboxLocation,0);

    gl.drawElements(gl.TRIANGLES, skyBuffer.indices.length, gl.UNSIGNED_SHORT, 0);
}

function drawShpere(gl,shpere_programInfo){
    gl.depthFunc(gl.LESS);

    const shpereBuffers = InitShpereBuffers(gl);

    const viewMatrix = mat4.create();
    const modelMatrix = mat4.create();
    const porjectionMatrix = CameraView(gl);
    const normalMatrix = mat4.create();

    mat4.lookAt(viewMatrix,[0,0,10],[0,0,0],[0,1,0]);

    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.enableVertexAttribArray(
            shpere_programInfo.attribLocations.vertexPosition);
        gl.bindBuffer(gl.ARRAY_BUFFER, shpereBuffers.position);
        gl.vertexAttribPointer(
            shpere_programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
    }

    {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.enableVertexAttribArray(
            shpere_programInfo.attribLocations.textureCoord);
        gl.bindBuffer(gl.ARRAY_BUFFER, shpereBuffers.textureCoord);
        gl.vertexAttribPointer(
            shpere_programInfo.attribLocations.textureCoord,
            numComponents,
            type,
            normalize,
            stride,
            offset);
    }

    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.enableVertexAttribArray(
            shpere_programInfo.attribLocations.vertexNormal);
        gl.bindBuffer(gl.ARRAY_BUFFER, shpereBuffers.normal);
        gl.vertexAttribPointer(
            shpere_programInfo.attribLocations.vertexNormal,
            numComponents,
            type,
            normalize,
            stride,
            offset);
    }

    gl.useProgram(shpere_programInfo.program);

    gl.uniformMatrix4fv(
        shpere_programInfo.uniformLocations.ProjectionMatrix,
        false,
        porjectionMatrix);
    gl.uniformMatrix4fv(
        shpere_programInfo.uniformLocations.ViewMatrix,
        false,
        viewMatrix);
    gl.uniformMatrix4fv(
        shpere_programInfo.uniformLocations.ModelMatrix,
        false,
        modelMatrix);
    gl.uniformMatrix4fv(
        shpere_programInfo.uniformLocations.NormalMatrix,
        false,
        normalMatrix);
    gl.uniform3f(
        shpere_programInfo.uniformLocations.light,
        0.85,0.8,3);


    gl.drawElements(gl.TRIANGLE_STRIP, shpereBuffers.indices.length, gl.UNSIGNED_SHORT, 0);
}
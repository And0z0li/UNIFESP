const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 não é suportado.");
}

// --------------------------------------------------
// 1. VÉRTICES (CRIANDO O CILINDRO/LATA)
// --------------------------------------------------
function criarLata(raio, altura, segmentos) {
    const vertices = [];
    const indices = [];
    const h = altura / 2.0;

    // Vértice central do topo (índice 0) e da base (índice 1)
    vertices.push(0, h, 0); 
    vertices.push(0, -h, 0);

    const topoCentro = 0;
    const baseCentro = 1;
    let offset = 2; // As bordas começam a partir do índice 2

    // Gerar os vértices das bordas
    for (let i = 0; i <= segmentos; i++) {
        let theta = (i * 2 * Math.PI) / segmentos;
        let x = raio * Math.cos(theta);
        let z = raio * Math.sin(theta);
        
        vertices.push(x, h, z);  // Borda do topo
        vertices.push(x, -h, z); // Borda da base
    }

    // Gerar os triângulos
    for (let i = 0; i < segmentos; i++) {
        let topoAtual = offset + (i * 2);
        let baseAtual = topoAtual + 1;
        let topoProx = topoAtual + 2;
        let baseProx = baseAtual + 2;

        // Triângulos da lateral (corpo da lata)
        indices.push(topoAtual, baseAtual, topoProx);
        indices.push(topoProx, baseAtual, baseProx);

        // Triângulo da tampa superior
        indices.push(topoCentro, topoAtual, topoProx);
        
        // Triângulo da tampa inferior (ordem invertida para não ficar do avesso)
        indices.push(baseCentro, baseProx, baseAtual);
    }

    return {
        vertices: new Float32Array(vertices),
        indices: new Uint16Array(indices)
    };
}

// Gerando uma lata com raio 0.4 e altura 1.0
const lata = criarLata(0.4, 1.0, 32);


// --------------------------------------------------
// 2. BUFFERS (VÉRTICES E ÍNDICES)
// --------------------------------------------------

// Buffer de posições
const bufferVertices = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, bufferVertices);
gl.bufferData(gl.ARRAY_BUFFER, lata.vertices, gl.STATIC_DRAW);

// Buffer de índices (para saber como montar os triângulos)
const bufferIndices = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferIndices);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, lata.indices, gl.STATIC_DRAW);


// --------------------------------------------------
// 3. VERTEX SHADER
// --------------------------------------------------
// aplicação da rotação para ver a lata em 3D
const vertexShaderSource = `#version 300 es

in vec3 aPosition;
out vec3 vPosRotacionada;

void main() {
    // Inclinação fixa (para ver o topo e a lateral ao mesmo tempo)
    float anguloX = 0.5; // inclina pra frente
    float anguloY = 0.5; // gira pro lado

    // Rotação Y
    float x1 = aPosition.x * cos(anguloY) - aPosition.z * sin(anguloY);
    float z1 = aPosition.x * sin(anguloY) + aPosition.z * cos(anguloY);

    // Rotação X
    float y1 = aPosition.y * cos(anguloX) - z1 * sin(anguloX);
    float z2 = aPosition.y * sin(anguloX) + z1 * cos(anguloX);

    vPosRotacionada = vec3(x1, y1, z2);
    gl_Position = vec4(x1, y1, z2, 1.0);
}
`;


// --------------------------------------------------
// 4. FRAGMENT SHADER
// --------------------------------------------------
const fragmentShaderSource = `#version 300 es

precision mediump float;

in vec3 vPosRotacionada;
out vec4 outColor;

void main() {
    // Falso brilho baseado na profundidade (Z) da lata rotacionada
    // Ajuda a dar aspecto cilíndrico, deixando o centro mais claro e as bordas escuras
    float luz = (vPosRotacionada.z + 0.6) * 1.2;
    
    // Cor Azul (R=0, G=0.3, B=1) multiplicada pela luz
    outColor = vec4(0.0, 0.3 * luz, 1.0 * luz, 1.0);
}
`;


// --------------------------------------------------
// 5. COMPILAR SHADERS
// --------------------------------------------------
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(error);
    }
    return shader;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);


// --------------------------------------------------
// 6. CRIAR PROGRAMA
// --------------------------------------------------
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program));
}


// --------------------------------------------------
// 7. LOCAL DO ATRIBUTO
// --------------------------------------------------
const positionLocation = gl.getAttribLocation(program, "aPosition");


// --------------------------------------------------
// 8. CONFIGURAR ATRIBUTO
// --------------------------------------------------
gl.bindBuffer(gl.ARRAY_BUFFER, bufferVertices);
gl.enableVertexAttribArray(positionLocation);

// O tamanho agora é 3 (X, Y, Z) pois é um objeto 3D
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);


// --------------------------------------------------
// 9. LIMPAR TELA E HABILITAR PROFUNDIDADE
// --------------------------------------------------
gl.clearColor(0.1, 0.1, 0.1, 1.0);

// Habilita o teste de profundidade (esconde o que está atrás)
gl.enable(gl.DEPTH_TEST); 

// Agora limpamos a cor E o buffer de profundidade
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


// --------------------------------------------------
// 10. DESENHAR
// --------------------------------------------------
gl.useProgram(program);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferIndices);

// Substituímos drawArrays por drawElements, pois estamos usando índices
gl.drawElements(
    gl.TRIANGLES,
    lata.indices.length,
    gl.UNSIGNED_SHORT, // Tipo de dado do Uint16Array
    0
);
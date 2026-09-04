const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 não é suportado.");
}

// --------------------------------------------------
// 1. SHADERS 
// --------------------------------------------------
const vertexShaderSource = `#version 300 es
in vec2 aPosition;
uniform vec2 uResolution;

void main() {
    vec2 zeroToOne = aPosition / uResolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    
    gl_Position = vec4(clipSpace * vec2(1, -1), 0.0, 1.0);
    gl_PointSize = 2.0; 
}
`;

const fragmentShaderSource = `#version 300 es
precision mediump float;
uniform vec4 uColor;
out vec4 outColor;

void main() {
    outColor = uColor;
}
`;

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader));
    }
    return shader;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

// --------------------------------------------------
// 2. VARIÁVEIS DE ESTADO
// --------------------------------------------------
const positionLocation = gl.getAttribLocation(program, "aPosition");
const resolutionUniformLocation = gl.getUniformLocation(program, "uResolution");
const colorUniformLocation = gl.getUniformLocation(program, "uColor");

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// Centro do Canvas (representando o ponto lógico 0,0 inicial)
const centroCanvas = { x: Math.floor(canvas.width / 2), y: Math.floor(canvas.height / 2) };

// Estados Iniciais Conforme o Enunciado
let modoAtual = 'R'; // 'R' = Reta, 'T' = Triângulo
let currentColor = [0.0, 0.0, 1.0, 1.0]; // Inicialmente Azul
let primeiraRetaAtiva = true; 
let pontosClicados = []; // Guarda os cliques em andamento

// Inicia com uma linha (0,0) - (0,0), ou seja, apenas um ponto no centro
let pontosDaFigura = [centroCanvas.x, centroCanvas.y];

// --------------------------------------------------
// 3. MATEMÁTICA (BRESENHAM)
// --------------------------------------------------
function calcularBresenham(x0, y0, x1, y1) {
    const pixels = [];
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while (true) {
        pixels.push(x0, y0); 
        if (x0 === x1 && y0 === y1) break; 
        
        let e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x0 += sx; }
        if (e2 < dx) { err += dx; y0 += sy; }
    }
    return pixels;
}

// Retorna os pontos resultantes da união de 3 retas (Bresenham)
function tracarTriangulo(p1, p2, p3) {
    let figura = [];
    figura = figura.concat(calcularBresenham(p1.x, p1.y, p2.x, p2.y));
    figura = figura.concat(calcularBresenham(p2.x, p2.y, p3.x, p3.y));
    figura = figura.concat(calcularBresenham(p3.x, p3.y, p1.x, p1.y));
    return figura;
}

// --------------------------------------------------
// 4. INTERAÇÃO (TECLADO E MOUSE)
// --------------------------------------------------
window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    
    // Controles de Cores (Ajustado 'r' -> 'v' para liberar a Reta)
    if (key === 'v') currentColor = [1.0, 0.0, 0.0, 1.0]; // Vermelho
    if (key === 'g') currentColor = [0.0, 1.0, 0.0, 1.0]; // Verde
    if (key === 'b') currentColor = [0.0, 0.0, 1.0, 1.0]; // Azul

    // Controles de Forma
    if (key === 'r') {
        modoAtual = 'R';
        pontosClicados = []; // Reseta cliques em andamento
    }
    if (key === 't') {
        modoAtual = 'T';
        pontosClicados = []; 
        primeiraRetaAtiva = false; // Se mudou pra triângulo, aborta a regra especial inicial
    }
    
    desenhar(); 
});

canvas.addEventListener('mousedown', (event) => {
    // Capturar o clique apenas se for o botão esquerdo (0)
    if (event.button !== 0) return;

    const rect = canvas.getBoundingClientRect();
    const pt = { 
        x: Math.round(event.clientX - rect.left), 
        y: Math.round(event.clientY - rect.top) 
    };

    if (modoAtual === 'R') {
        if (primeiraRetaAtiva) {
            // A regra do Ex. 1 exige que o primeiro clique ligue com (0,0)
            pontosDaFigura = calcularBresenham(centroCanvas.x, centroCanvas.y, pt.x, pt.y);
            primeiraRetaAtiva = false;
        } else {
            pontosClicados.push(pt);
            
            if (pontosClicados.length === 1) {
                // Primeiro clique da nova reta: apaga figura anterior e mostra um ponto
                pontosDaFigura = [pt.x, pt.y];
            } else if (pontosClicados.length === 2) {
                // Segundo clique: traça a reta e esvazia a memória de cliques
                pontosDaFigura = calcularBresenham(pontosClicados[0].x, pontosClicados[0].y, pontosClicados[1].x, pontosClicados[1].y);
                pontosClicados = []; 
            }
        }
    } 
    else if (modoAtual === 'T') {
        pontosClicados.push(pt);

        if (pontosClicados.length === 1) {
            // Primeiro clique: ponto solto
            pontosDaFigura = [pt.x, pt.y];
        } else if (pontosClicados.length === 2) {
            // Segundo clique: mostra temporariamente uma reta (preview de uma aresta)
            pontosDaFigura = calcularBresenham(pontosClicados[0].x, pontosClicados[0].y, pontosClicados[1].x, pontosClicados[1].y);
        } else if (pontosClicados.length === 3) {
            // Terceiro clique: traça o triângulo inteiro e reseta
            pontosDaFigura = tracarTriangulo(pontosClicados[0], pontosClicados[1], pontosClicados[2]);
            pontosClicados = [];
        }
    }
    
    desenhar();
});

// --------------------------------------------------
// 5. FUNÇÃO DE RENDERIZAÇÃO
// --------------------------------------------------
function desenhar() {
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (pontosDaFigura.length > 0) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pontosDaFigura), gl.STATIC_DRAW);

        gl.useProgram(program);
        gl.bindVertexArray(vao);
        
        gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
        gl.uniform4fv(colorUniformLocation, currentColor);

        gl.drawArrays(gl.POINTS, 0, pontosDaFigura.length / 2);
    }
}

// Renderiza o ponto central inicial
desenhar();
const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 não é suportado.");
}

// --------------------------------------------------
// 1. SHADERS (Adaptados para coordenadas de Pixel)
// --------------------------------------------------
// O Vertex Shader agora recebe coordenadas em "pixels" e converte 
// para o formato Clip Space do WebGL (-1.0 até 1.0).
const vertexShaderSource = `#version 300 es
in vec2 aPosition;
uniform vec2 uResolution;

void main() {
    // Converte de pixels (0 a resolution) para 0.0 a 1.0
    vec2 zeroToOne = aPosition / uResolution;
    // Converte de 0.0 a 1.0 para 0.0 a 2.0
    vec2 zeroToTwo = zeroToOne * 2.0;
    // Converte de 0.0 a 2.0 para -1.0 a 1.0 (clip space)
    vec2 clipSpace = zeroToTwo - 1.0;
    
    // Inverte o Y porque no monitor/canvas o (0,0) é no topo esquerdo, 
    // mas na matemática cartesiana do WebGL é embaixo.
    gl_Position = vec4(clipSpace * vec2(1, -1), 0.0, 1.0);
    
    // Tamanho do pixel renderizado
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

// Função auxiliar de compilação
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
// 2. VARIÁVEIS DE ESTADO E REFERÊNCIAS
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

// Cor atual (Padrão: Azul)
let currentColor = [0.0, 0.0, 1.0, 1.0];

// Pontos lógicos e estado
const centroCanvas = { x: Math.floor(canvas.width / 2), y: Math.floor(canvas.height / 2) };
let p0 = centroCanvas; // O ponto inicial pedido é o (0,0), que é o centro da tela
let p1 = null;

let isPrimeiraReta = true; 
let estadoClique = 1; // 1 = esperando destino (P1), 0 = esperando início (P0)
let pontosDaReta = []; // Array que armazenará os pixels calculados por Bresenham

// --------------------------------------------------
// 3. ALGORITMO DE BRESENHAM
// --------------------------------------------------
// Calcula todos os pixels que formam a reta entre (x0,y0) e (x1,y1)
function calcularBresenham(x0, y0, x1, y1) {
    const pixels = [];
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while (true) {
        // Guarda as coordenadas X e Y na lista linear (Float32Array requer lista plana)
        pixels.push(x0, y0); 

        // Se chegou no destino, para o loop
        if (x0 === x1 && y0 === y1) break; 
        
        let e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x0 += sx; }
        if (e2 < dx) { err += dx; y0 += sy; }
    }
    return pixels;
}

// --------------------------------------------------
// 4. INTERAÇÃO (MOUSE E TECLADO)
// --------------------------------------------------

// Teclado altera as cores
window.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'r') currentColor = [1.0, 0.0, 0.0, 1.0]; // Vermelho
    if (event.key.toLowerCase() === 'g') currentColor = [0.0, 1.0, 0.0, 1.0]; // Verde
    if (event.key.toLowerCase() === 'b') currentColor = [0.0, 0.0, 1.0, 1.0]; // Azul
    desenhar(); // Atualiza a tela com a nova cor
});

// Mouse define os pontos
canvas.addEventListener('mousedown', (event) => {
    const rect = canvas.getBoundingClientRect();
    // Pegando as posições exatas do clique convertidas para a escala do canvas em Pixel
    const mouseX = Math.round(event.clientX - rect.left);
    const mouseY = Math.round(event.clientY - rect.top);

    if (isPrimeiraReta) {
        // Já temos o p0 no centro da tela. Este clique é o destino (P1)
        p1 = { x: mouseX, y: mouseY };
        pontosDaReta = calcularBresenham(p0.x, p0.y, p1.x, p1.y);
        
        isPrimeiraReta = false;
        estadoClique = 0; // O próximo clique começará uma RETA NOVA
    } else {
        if (estadoClique === 0) {
            // Primeiro clique de uma NOVA reta (P0)
            p0 = { x: mouseX, y: mouseY };
            
            // Limpa a reta anterior e exibe temporariamente só o ponto clicado
            pontosDaReta = [p0.x, p0.y]; 
            estadoClique = 1; // Próximo clique vai ser o destino
        } else {
            // Segundo clique da reta (P1)
            p1 = { x: mouseX, y: mouseY };
            
            // Calcula a nova reta
            pontosDaReta = calcularBresenham(p0.x, p0.y, p1.x, p1.y);
            estadoClique = 0; // Volta a aguardar uma reta inteiramente nova
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

    if (pontosDaReta.length > 0) {
        // Envia os pixels calculados para o buffer da GPU
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pontosDaReta), gl.STATIC_DRAW);

        gl.useProgram(program);
        gl.bindVertexArray(vao);
        
        // Passa o tamanho da tela e a cor atual via Uniforms
        gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
        gl.uniform4fv(colorUniformLocation, currentColor);

        // ATENÇÃO AQUI: Em vez de desenhar linhas (gl.LINES), desenhamos PONTOS soltos
        // A matemática que fizemos na função bresenham é o que constrói a ilusão da reta.
        // O número de vértices é o tamanho do array dividido por 2 (pois cada ponto tem x e y).
        gl.drawArrays(gl.POINTS, 0, pontosDaReta.length / 2);
    }
}

// Inicializa a tela preta vazia
desenhar();
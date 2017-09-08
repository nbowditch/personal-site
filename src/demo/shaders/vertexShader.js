const VERTEX_SHADER_TEXT =
`
precision mediump float;

attribute vec2 vertPosition;

varying vec2 fractalPos;

void main() {
    fractalPos = vec2(2.0 * vertPosition.x, 2.0 * vertPosition.y);
    gl_Position = vec4(vertPosition, 0.0, 1.0);
}

`;

const VertexShader = {
	text: VERTEX_SHADER_TEXT
}

export default VertexShader;
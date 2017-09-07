const FRAGMENT_SHADER_TEXT =
`
precision mediump float;

varying vec3 fragColor;

void main() {
    gl_FragColor = vec4(fragColor, 1.0);
}

`;

const FragmentShader = {
	text: FRAGMENT_SHADER_TEXT
}

export default FragmentShader;
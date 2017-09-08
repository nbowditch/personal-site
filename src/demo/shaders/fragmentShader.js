const FRAGMENT_SHADER_TEXT =
`
precision mediump float;

uniform vec2 mousePosition;

varying vec2 fractalPos;

float hue2rgb(float t) {
	if (t < 0.0) {
		t += 1.0;
	}
    if (t > 1.0) {
    	t -= 1.0;
    }
    if (t < 0.16666666) {
    	return 6.0 * t;
    }
    if (t < 0.5) {
    	return 1.0;
    }
    if (t < 0.66666666) {
    	return (0.6666666 - t) * 6.0;
    }
    return 0.0;
}

void main() {
	vec2 z = vec2(fractalPos);
	vec2 c = vec2(mousePosition);

	float escape = 0.0;

	float real, imaginary;

	for (int i = 0; i < 255; i++) {
		real = (z.x * z.x) - (z.y * z.y) + c.x;
		imaginary = 2.0 * (z.x * z.y) + c.y;

		z.x = real;
		z.y = imaginary;

		if (length(z) > 2.0) {
			break;
		}

		escape = escape + 1.0;
	}

	if (escape <= 1.0) {
		gl_FragColor = vec4(0.54509803921, 0.0, 1.0, 1.0);
	} else {
		escape = (escape - log2(log2(escape))) / 255.0;

		escape = escape + 0.75;
		if (escape > 1.0) {
			escape -= 1.0;
		}

	    gl_FragColor = vec4(
	    	hue2rgb(escape + 0.333333),
	    	hue2rgb(escape),
	    	hue2rgb(escape - 0.333333),
	    	1.0
	    );
	}
}

`;

const FragmentShader = {
	text: FRAGMENT_SHADER_TEXT
}

export default FragmentShader;
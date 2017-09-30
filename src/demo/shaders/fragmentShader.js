const FRAGMENT_SHADER_TEXT =
`
precision mediump float;

uniform vec2 mousePos;
uniform vec2 canvasSize;

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

vec4 sampleColor(vec2 z, vec2 c) {
	float escape = 0.0;

	float real, imaginary;

	vec4 color;

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
		color = vec4(0.54509803921, 0.0, 1.0, 1.0);
	} else {
		escape = (escape - log2(log2(escape))) / 255.0;

		escape = escape + 0.75;
		if (escape > 1.0) {
			escape -= 1.0;
		}

		color = vec4(
	    	hue2rgb(escape + 0.333333),
	    	hue2rgb(escape),
	    	hue2rgb(escape - 0.333333),
	    	1.0
	    );
	}

	return color; 
}


void main() {
	vec2 z = vec2(fractalPos); 		// z is position on fractal that we are rendering, (-2, -2) to (2, 2)
	vec2 c = vec2(mousePos);		// c is position of mouse, defines fractal shape

	vec2 pixSize = vec2(4.0 / canvasSize.x, 4.0 / canvasSize.y);

	vec2 topLeft = vec2(z.x + (0.25 * pixSize.x), z.y + (0.25 * pixSize.y));
	vec2 topRight = vec2(z.x + (0.75 * pixSize.x), z.y + (0.25 * pixSize.y));
	vec2 botLeft = vec2(z.x + (0.25 * pixSize.x), z.y + (0.75 * pixSize.y));
	vec2 botRight = vec2(z.x + (0.75 * pixSize.x), z.y + (0.75 * pixSize.y));

	vec4 tlc = sampleColor(topLeft, c);
	vec4 trc = sampleColor(topRight, c);
	vec4 blc = sampleColor(botLeft, c);
	vec4 brc = sampleColor(botRight, c);

	gl_FragColor = vec4(
		(tlc.x + trc.x + blc.x + brc.x) / 4.0,
		(tlc.y + trc.y + blc.y + brc.y) / 4.0,
		(tlc.z + trc.z + blc.z + brc.z) / 4.0,
		1.0
	);
}

`;

const FragmentShader = {
	text: FRAGMENT_SHADER_TEXT
}

export default FragmentShader;
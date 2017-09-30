import VertexShader from './shaders/vertexShader';
import FragmentShader from './shaders/fragmentShader';

const Demo = {
	init: (canvas) => {
        this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        if (!this.gl) {
            console.log('WebGL not supported!');
            return;
        }

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        var vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        var fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

        this.gl.shaderSource(vertexShader, VertexShader.text);
        this.gl.shaderSource(fragmentShader, FragmentShader.text);

        this.gl.compileShader(vertexShader);
        if (!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)) {
            console.error('Error compiling vertex shader!', this.gl.getShaderInfoLog(vertexShader));
            return;
        }
        this.gl.compileShader(fragmentShader);
        if (!this.gl.getShaderParameter(fragmentShader, this.gl.COMPILE_STATUS)) {
            console.error('Error compiling fragment shader!', this.gl.getShaderInfoLog(fragmentShader));
            return;
        }

        var program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error('Error linking program!', this.gl.getProgramInfoLog(program));
            return;
        }

        this.gl.validateProgram(program);
        if (!this.gl.getProgramParameter(program, this.gl.VALIDATE_STATUS)) {
            console.error('Error validating program!', this.gl.getProgramInfoLog(program));
        }

        //
        // Create buffer
        //

        var triangleVertices =
        [  // X, Y
            -1.0, -1.0,
            -1.0, 1.0,
            1.0, -1.0,
            1.0, 1.0
        ];

        var triangleVertexBufferObject = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, triangleVertexBufferObject);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(triangleVertices), this.gl.STATIC_DRAW);

        var positionAttribLocation = this.gl.getAttribLocation(program, 'vertPosition');
        var colorAttribLocation = this.gl.getAttribLocation(program, 'vertColor');

        this.gl.vertexAttribPointer(
            positionAttribLocation,                 // attribute location
            2,                                      // number of elements per attribute
            this.gl.FLOAT,                          // type of elements
            this.gl.FALSE,                          // are attributes normalized
            2 * Float32Array.BYTES_PER_ELEMENT,     // size of individual vertex
            0                                       // offset from the beginning of a single vertex to this attribute
        );

        this.gl.enableVertexAttribArray(positionAttribLocation);

        this.mousePosUniform = this.gl.getUniformLocation(program, 'mousePos');
        this.mousePos = new Float32Array(2);

        this.canvasSizeUniform = this.gl.getUniformLocation(program, 'canvasSize');
        this.canvasSize = new Float32Array(2);

        this.program = program;  
    },
    draw: (mousePos, canvas) => {
        // First transform mouse position into weird space of "good" fractals
        var x = 6.283185307 * (mousePos.x / canvas.width);
        var y = mousePos.y / canvas.height - 0.7;

        var th = x;
        var r = y + 0.833333333333333 - 0.5 * Math.cos(th);

        x = r * Math.cos(th);
        y = r * Math.sin(th);

        var transformedMousePos = {x, y};

        this.mousePos[0] = transformedMousePos.x;
        this.mousePos[1] = transformedMousePos.y;
        this.canvasSize[0] = canvas.width;
        this.canvasSize[1] = canvas.height;

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.useProgram(this.program);
        this.gl.uniform2fv(this.mousePosUniform, this.mousePos);
        this.gl.uniform2fv(this.canvasSizeUniform, this.canvasSize);
        this.gl.drawArrays(
            this.gl.TRIANGLE_STRIP,
            0,  // vertices to skip
            4   // vertices to draw
        );
    },
    resizeCanvas: (w, h) => {
        this.gl && this.gl.viewport(0, 0, w, h);
    }
}

export default Demo;

(function() {
    

})();
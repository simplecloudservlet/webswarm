import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { interval } from 'rxjs';
import { WebGLService } from './scene/services/web-gl.service';
import { mat4 } from 'gl-matrix'; //Para o mat4 tambem

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {

  private squareRotation = 0.0;
  private deltaTime = 0;

  
  title = "webswarm";
  @ViewChild('sceneCanvas') private canvas!: ElementRef<HTMLCanvasElement>;

  /**
   * The interval of refresh rate for drawing our scene during one second of elapsed time (1000ms).
   */
  private _60fpsInterval = 16.666666666666666667;
  private gl: WebGLRenderingContext | null | undefined;

  constructor(private webglService: WebGLService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (!this.canvas) {
      alert('canvas not supplied! cannot bind WebGL context!');
      return;
    }
    this.gl = this.webglService.initialiseWebGLContext(
      this.canvas.nativeElement
    );



     // Set up to draw the scene periodically via deltaTime.
     const milliseconds = 0.001;
     this.deltaTime = this._60fpsInterval * milliseconds;
     //const drawSceneInterval = interval(this._60fpsInterval);
     const drawSceneInterval = interval(100);
 
    drawSceneInterval.subscribe(() => {
      this.drawScene();
      
      this.squareRotation += this.deltaTime; 
      //console.log('squareRotation: ' + this.squareRotation);
      if(this.deltaTime < 0.800) 
        //Deslocamento pequeno dah a sensacao de movimento
        this.deltaTime = this.deltaTime + (this._60fpsInterval * milliseconds);
      //else //Mantem o movimento
      //  this.deltaTime = 0;
        
    });
  }

  /**
   * Draws the scene
   */
  private drawScene() {
    
// prepare the scene and update the viewport
this.webglService.updateViewport();
this.webglService.prepareScene(this.squareRotation);

/*///
  this.gl!.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
  this.gl!.clearDepth(1.0); // Clear everything
  this.gl!.enable(this.gl!.DEPTH_TEST); // Enable depth testing
  this.gl!.depthFunc(this.gl!.LEQUAL); // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  this.gl!.clear(this.gl!.COLOR_BUFFER_BIT | this.gl!.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = (45 * Math.PI) / 180; // in radians
  const aspect = this.gl!.canvas.width / this.gl!.canvas.height;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.
  mat4.translate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to translate
    [-0.0, 0.0, -6.0]
  ); // amount to translate

  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    this.squareRotation, // amount to rotate in radians
    [0, 0, 1]
  ); // axis to rotate around

// Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVertexColor and also
  // look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        "uProjectionMatrix"
      ),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const buffers = this.initBuffers(this.gl);

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  this.setPositionAttribute(this.gl, buffers, programInfo);

  this.setColorAttribute(this.gl, buffers, programInfo);

  // Tell WebGL to use our program when drawing
  this.gl!.useProgram(programInfo.program);

  // Set the shader uniforms
  this.gl!.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );
  this.gl!.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  );
///*/
    // draw the scene
    const offset = 0;
    const vertexCount = 4;

    this.gl!.drawArrays(
      //this.gl!.POINTS,
      this.gl!.TRIANGLE_STRIP,
      offset,
      vertexCount
    );

    
  }

// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
setPositionAttribute(gl:any, buffers:any, programInfo:any): void {
  const numComponents = 2; // pull out 2 values per iteration
  const type = gl.FLOAT; // the data in the buffer is 32bit floats
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set of values to the next
  // 0 = use type and numComponents above
  const offset = 0; // how many bytes inside the buffer to start from
  this.gl!.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  this.gl!.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  this.gl!.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

// Tell WebGL how to pull out the colors from the color buffer
// into the vertexColor attribute.
setColorAttribute(gl:any, buffers:any, programInfo:any): void {
  const numComponents = 4;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  this.gl!.bindBuffer(this.gl!.ARRAY_BUFFER, buffers.color);
  this.gl!.vertexAttribPointer(
    programInfo.attribLocations.vertexColor,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  this.gl!.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}

///////
initBuffers(gl: any) {
  const positionBuffer = this.initPositionBuffer(gl);

  const colorBuffer = this.initColorBuffer(gl);

  return {
    position: positionBuffer,
    color: colorBuffer,
  };
}

 initPositionBuffer(gl: any) {
  // Create a buffer for the square's positions.
  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the square.
  const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return positionBuffer;
}

 initColorBuffer(gl: any) {
  const colors = [
    1.0,
    1.0,
    1.0,
    1.0, // white
    1.0,
    0.0,
    0.0,
    1.0, // red
    0.0,
    1.0,
    0.0,
    1.0, // green
    0.0,
    0.0,
    1.0,
    1.0, // blue
  ];

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  return colorBuffer;
}

///////
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebGLService {

  private _renderingContext: RenderingContext | undefined;
  private get gl(): WebGLRenderingContext {
    return this._renderingContext as WebGLRenderingContext;
  }

  constructor() { }

  initialiseWebGLContext(canvas: HTMLCanvasElement) {
    // Try to grab the standard context. If it fails, fallback to experimental.
    //this._renderingContext = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    // If we don't have a GL context, give up now... only continue if WebGL is available and working...
    /*if (!this.gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }*/
    //canvas.getContext('webgl');
    // *** set width, height and initialise the webgl canvas ***
    this.setWebGLCanvasDimensions(canvas);
    this.initialiseWebGLCanvas();
  }
  setWebGLCanvasDimensions(canvas: HTMLCanvasElement) {
    // set width and height based on canvas width and height - good practice to use clientWidth and clientHeight
    this.gl.canvas.width = canvas.clientWidth;
    this.gl.canvas.height = canvas.clientHeight;
  }
  initialiseWebGLCanvas() {
    // Set clear colour to black, fully opaque
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Enable depth testing
    this.gl.enable(this.gl.DEPTH_TEST);
    // Near things obscure far things
    this.gl.depthFunc(this.gl.LEQUAL);
    // Clear the colour as well as the depth buffer.
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
}

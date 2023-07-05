import {  AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WebGLService } from './scene/services/web-gl.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'webswarm-app';


  @ViewChild('sceneCanvas') private canvas!: ElementRef<HTMLCanvasElement>;


  constructor(private webglService: WebGLService){

  }
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    if (!this.canvas) {
      alert("canvas not supplied! cannot bind WebGL context!");
      return;
    }
    this.webglService.initialiseWebGLContext(this.canvas.nativeElement);
}

}

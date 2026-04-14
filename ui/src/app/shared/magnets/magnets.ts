import {Component} from '@angular/core';

@Component({
  selector: 'app-magnets',
  imports: [],
  templateUrl: './magnets.html',
  styleUrl: './magnets.scss'
})
export class Magnets {

  imageStates: { [key: number]: boolean } = {};

  isImageZoomed(imgNo: number) {
    return this.imageStates[imgNo] || false;
  }

  onImageHover(isHovering: boolean, imgNo: number) {
    this.imageStates[imgNo] = isHovering;
  }

}

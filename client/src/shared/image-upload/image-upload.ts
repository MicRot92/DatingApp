import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  imports: [],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css',
})
export class ImageUpload {
  protected imageSrc = signal<string | ArrayBuffer | null>(null);
  protected isDragingOver = false;
  private fileToUpload: File | null = null;
  uploadFile = output<File>();
  loading = input<boolean>(false);

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragingOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragingOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragingOver = false;

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.previewImage(file);
      this.fileToUpload = file;
      event.dataTransfer.clearData();
    }
  }

  onCancel() {
    this.imageSrc.set(null);
    this.fileToUpload = null;
  }

  onUpload() {
    if (this.fileToUpload) {
      this.uploadFile.emit(this.fileToUpload);
    }
  } 

  private previewImage(file: File) {
    console.log('Previewing file:', file);
    const reader = new FileReader();
    reader.onload = e => {
      this.imageSrc.set(reader.result);
    };
    reader.readAsDataURL(file);
  }
}

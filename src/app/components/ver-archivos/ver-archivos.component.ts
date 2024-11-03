import { Component } from '@angular/core';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-ver-archivos',
  templateUrl: './ver-archivos.component.html',
  styleUrl: './ver-archivos.component.css'
})
export class VerArchivosComponent {
  url: string = ''
  constructor(private fileService: FileService){
  }


  loadFile() {
    const w = true
    if (w) { // Verificar que la conversión fue exitosa
      this.fileService.downloadFile().subscribe({
        next: (imageBlob) => {
          // Crear una URL para el Blob
          const url = window.URL.createObjectURL(imageBlob);
          this.url = window.URL.createObjectURL(imageBlob);


          // Liberar la URL del Blob
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Error al cargar el archivo:', error);
        }
      });
    } else {
      console.error('ID inválido proporcionado:', );
    }
    console.log(this.url)
  }
}

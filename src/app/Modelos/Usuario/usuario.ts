export class UsuarioModel {
  _id: string = '';
  nombre: string = '';
  edad: string = '';
  usuario: string = '';
  genero: string = '';
  deporte: string = '';
  profesion: string = '';
  password: string = '';
  descripcion: string = '';
  correo: string = '';
  estadoCivil: any;
  image: Imagen = new Imagen();
  conectado: string = '';
  cantidadMensajes: number = 0;
}

export class Imagen {
  type: number = 0;
  data: string = '';
}

export class MessageBunny {
  public message: string;
  public de: string;
  public para: string;
  public fecha: string;

  constructor(message: string, de: string, para: string, fecha: string) {
    this.message = message;
    this.de = de;
    this.para = para;
    this.fecha = fecha;
  }
}
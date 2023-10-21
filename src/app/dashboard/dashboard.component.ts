import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { and } from 'ajv/dist/compile/codegen';
import { Message } from 'app/Modelos/Message/Message';
import { UsuarioModel } from 'app/Modelos/Usuario/usuario';
import { UsuarioService } from 'app/Servicios/Usuario/usuario.service';
import { WebsocketService } from 'app/Servicios/Websocket/websocket.service';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  personas: UsuarioModel[] = [];
  idPerson: String = '';
  UsuarioSeleccionado: UsuarioModel = new UsuarioModel();
  verFerfil: boolean = false;
  mensaje: string = '';
  input: string = "";
  messageList: Message[] = [];
  message = new Message("", "", "", "");
  topic: string = "/topic/chatAbierto";
  responseSubject = new Subject<Message>;
  fechaActual: Date = new Date();
  genero: string = '';
  imagen: string = '';
  infoPerfilSesion: UsuarioModel = new UsuarioModel();
  fechaActualM: string = '';


  @ViewChild('miDiv') miDiv: ElementRef;
  constructor(
    private servicioPerfiles: UsuarioService,
    public ws: WebsocketService,
    private renderer: Renderer2
  ) {

    this.conectar();
    this.infoPerfilSesion = JSON.parse(sessionStorage.getItem('datosPerfil'));

  }


  ngOnInit() {

    this.servicioPerfiles.obtener().subscribe(
      (responseObtener) => {
        // debugger;

        if (responseObtener != null && responseObtener.length > 0) {
          const filteredJson = responseObtener.filter((element) => element._id !== this.infoPerfilSesion._id);

          


          this.personas = filteredJson;
          
        } 
      }, error => {
        
      }
    );
  }

  handleClick(event: { target: any; }) {

    this.messageList = [];
    const id = event.target.querySelector('#id').value;
    // Perform actions based on the captured ID
    this.verFerfil = false;

    this.servicioPerfiles.obtenerPorPerfil(id).subscribe(
      (responseObtener) => {
        this.UsuarioSeleccionado = responseObtener;

        this.servicioPerfiles.obtenerMensajes(this.UsuarioSeleccionado._id, this.infoPerfilSesion._id).subscribe(
          (responseObtener) => {
            // debugger;
            for (const key in responseObtener) {


              this.messageList.push(responseObtener[key])

            }

            this.messageList.sort((a, b) => {
              const dateA = this.parseFecha(a.fecha);
              const dateB = this.parseFecha(b.fecha);

              // Compara las fechas en orden ascendente (de menor a mayor)
              return dateA.getTime() - dateB.getTime();
            });

            setTimeout(() => {
              this.miDiv.nativeElement.scrollTop = this.miDiv.nativeElement.scrollHeight + 120;
            }, 100);

            console.log(this.messageList);

            // console.log(responseObtener);
          }, error => {
            // this.funcionesGenerales.userExcepcion('Error al obtener las personas', error, `${this.handleClick.name}`);
          }
        );
      }, error => {
        // this.funcionesGenerales.userExcepcion('Error al obtener el elemento', error, `${this.handleClick.name}`);
      }
    );
  }

  parseFecha(fecha: string): Date {
    const partes = fecha.split(' ');
    const [fechaParte, horaParte] = partes;

    const [anio, mes, dia] = fechaParte.split('-').map(Number);
    const [hora, minutos, segundos] = horaParte.split(':').map(Number);

    return new Date(anio, mes - 1, dia, hora, minutos, segundos);
  }

  verPerfil() {
    this.verFerfil = true;
    // console.log(this.verFerfil);
  }

  noVerPerfil() {
    this.verFerfil = false;
    // console.log(this.verFerfil);
  }

  cerrarChat() {
    this.UsuarioSeleccionado = new UsuarioModel();
    this.verFerfil = false;

  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.keyCode === 27) { // Código ASCII de la tecla ESC
      this.verFerfil = false;
      this.cerrarChat()

    }
    if (event.keyCode === 13) { // Código ASCII de la tecla ESC
      this.enviarMensaje()
    }

  }


  conectar(): void {
    debugger;
    console.log("Initialize");
    const _this = this;
    _this.ws.stompClient.connect({}, function (frame: any) {
      _this.ws.stompClient.subscribe(_this.topic, function (messageResponse: any) {
        debugger;
        let datos = messageResponse.body;
        _this.recibirMensaje(datos);
      });
    }, this.errorCallBack);
  }

  errorCallBack(error: any): void {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
      this.conectar();
    }, 5000);
  }


  recibirMensaje(texto: any): void {
    debugger;
    this.fechaActual = new Date();
    var datos = JSON.parse(texto) as any;

    datos.message = datos.message.replace(/(?:\r\n|\r|\n)/g, '<br>');

    const mensajeRecibido = new Message(datos.message, datos.de, datos.para, datos.fecha);

    console.log("de " + mensajeRecibido.de)
    console.log("para " + mensajeRecibido.para)

    console.log("infoPerfilSesion._id " + this.infoPerfilSesion._id)
    console.log("UsuarioSeleccionado._id " + this.UsuarioSeleccionado._id)
    if (this.UsuarioSeleccionado._id == mensajeRecibido.de && this.infoPerfilSesion._id == mensajeRecibido.para || this.UsuarioSeleccionado._id == mensajeRecibido.para && this.infoPerfilSesion._id == mensajeRecibido.de) {
      this.messageList.push(mensajeRecibido)
      console.log(this.messageList);
      this.miDiv.nativeElement.scrollTop = this.miDiv.nativeElement.scrollHeight;
    }else{
      console.log(this.messageList)
    }


  }

  enviarMensaje(): void {

    console.log(this.infoPerfilSesion._id)
    console.log(this.UsuarioSeleccionado._id)

    this.fechaActualM = new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'medium'
    });

    console.log(this.fechaActualM);
    if (this.mensaje) {
      this.message.message = this.mensaje;
      this.message.de = this.infoPerfilSesion._id;
      this.message.para = this.UsuarioSeleccionado._id;
      this.message.fecha = this.getFormattedDate();
      console.log(this.message);
      this.servicioPerfiles.guardarMensaje(this.message).subscribe(
        (responseObtener) => {
          // debugger;
          console.log(responseObtener);


        }, error => {
          // this.funcionesGenerales.userExcepcion('Error al obtener las personas', error, `${this.handleClick.name}`);
        }
      );



      $("#MensajeInput").val("");
      console.log(this.message);
      this.ws.enviar(this.message);
      this.mensaje == "";

      setTimeout(() => {
        this.miDiv.nativeElement.scrollTop = this.miDiv.nativeElement.scrollHeight + 120;
      }, 100);

    }
  }

  getDateInAMPM(dateString) {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Convertir la hora a formato de 12 horas
    const hour = hours > 12 ? hours - 12 : hours;

    // Agregar AM o PM
    const ampm = hours > 12 ? "PM" : "AM";

    return `${hour}:${minutes}:${seconds} ${ampm}`;
  }

  getFormattedDate() {
    const now = new Date();

    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  }

}

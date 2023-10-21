import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageBunny, UsuarioModel } from '../../Modelos/Usuario/usuario';
import { Observable } from 'rxjs';
import { Message } from 'app/Modelos/Message/Message';
@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    baseUrl = "http://localhost:8080";

    constructor(public httpClient: HttpClient) { }

    obtener() {
        return this.httpClient.get<UsuarioModel[]>(this.baseUrl + "/api/obtener");
    }

    crear(perfil: UsuarioModel): Observable<Object> {
        console.log(perfil);
        return this.httpClient.post(this.baseUrl + "/api/crear", perfil);
    }

    obtenerMensajes(Usuario: String, Amigo: String) {

        return this.httpClient.post<UsuarioModel>(this.baseUrl + "/api/obtenerMensajes", { Usuario1: Usuario, Usuario2: Amigo });
    }

    guardarMensaje(Mensaje: Message) {
        console.log("Guardar Mensaje");
        console.log(this.baseUrl + "/api/guardarMensaje");

        return this.httpClient.post(this.baseUrl + "/api/guardarMensaje", Mensaje);
    }

    obtenerPorPerfil(perfil: string) {
        return this.httpClient.get<UsuarioModel>(this.baseUrl + "/api/obtenerporid/" + perfil);
    }

    iniciarSesion(usuario: string, contrasena: string) {
        return this.httpClient.post<UsuarioModel>(this.baseUrl + "/api/LoginConejos", { perfil: usuario, contrasena: contrasena });
    }


    cerrarSesion(idP: String) {
        return this.httpClient.post(this.baseUrl + "/api/CerrarSesion/"+idP, {});
    }
    modificar(datosEnviar: Object): Observable<Object> {

        // delete datosEnviar['image']['type'];

        // datosEnviar['image']['data'] = "data:image/jpeg;base64,"+datosEnviar['image']['data'];
        
        console.log(datosEnviar)
        return this.httpClient.post(this.baseUrl + "/api/modificarPerfil", datosEnviar);
    }

    agregarImagen(formData: FormData) {
        return this.httpClient.post(this.baseUrl + "/api/agregarImagen", formData);
    }

    obtenerImagen() {
        return this.httpClient.get(this.baseUrl + "/api/obtenerImagen");
    }

    actualizarImg(formData: FormData){
        console.log("Actualizar Imagen");
        return this.httpClient.post(this.baseUrl + "/api/insertFile", formData);
        
    }
}

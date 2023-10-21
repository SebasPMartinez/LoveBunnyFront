import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';

import { Stomp } from '@stomp/stompjs';

import { environment } from 'environments/environment';
import { Message } from 'app/Modelos/Message/Message';
import { MessageBunny } from 'app/Modelos/Usuario/usuario';
import { UsuarioService } from '../Usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
	stompClient: any;
	webSocketEndPoint: string = environment.app_url;
	input: string = "";
	mensaje: Message = new Message("", "", "","");

	constructor() {
		let ws = SockJS(this.webSocketEndPoint);
		this.stompClient = Stomp.over(ws);
	}

	/**
	 * Se conecta al back
	 * @param message
	 */
	enviar(message: Message) {
		console.log("calling logout api via web socket");
		console.log(JSON.stringify(message));


		// Enviamos el objeto de la clase MessageBunny
		this.stompClient.send("/app/chat", {}, JSON.stringify(message));
	}

	/**
	 * Se desconecta del stomp
	 * @param message
	 */
	desconectar() {
		if (this.stompClient !== null) {
			this.stompClient.disconnect();
		}
		console.log("Disconnected");
	}
}

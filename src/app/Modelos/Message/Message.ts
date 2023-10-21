export class Message {
    message: string;
    de: string;
    para: string;
    fecha: string = "";

    constructor(message:string, de:string, para:string,fecha:string){
        this.message = message;
        this.de=de;
        this.para=para;
        this.fecha=fecha;
    }
}

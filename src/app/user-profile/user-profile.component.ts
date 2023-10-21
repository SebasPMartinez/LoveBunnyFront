import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsuarioModel } from 'app/Modelos/Usuario/usuario';
import { UsuarioService } from 'app/Servicios/Usuario/usuario.service';
import { funciones } from 'app/funciones';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  infoPerfilSesion: UsuarioModel = new UsuarioModel();
  funcionesGenerales = new funciones();
  form: FormGroup;
  imagenSeleccionada: File;
  id: string;
  imagenBase64: string;
  dataUrl: any;

  constructor(
    private http: HttpClient,
    private servicioPerfiles: UsuarioService,
    private formBuilder: FormBuilder
  ) {
    this.infoPerfilSesion = JSON.parse(sessionStorage.getItem('datosPerfil'));

 
    // this.imagenBase64 = this.infoPerfilSesion.image.data;

    if (this.infoPerfilSesion.image != null) {
      this.imagenBase64 = this.infoPerfilSesion.image.data;
      this.dataUrl = `data:image/png;base64,${this.imagenBase64}`;
    }





  }

  ngOnInit() {

    this.form = this.formBuilder.group({
      id: [''],
      image: [''],
    });
  }

  editarPerfil() {
    var Edad_form = $("#Edad_form").val()
    var Profesion_form = $("#Profesion_form").val()
    var Deporte_form = $("#Deporte_form").val()
    var Estado_form = $("#Estado_form").val()
    var Correo_form = $("#Correo_form").val()
    var Nombre_form = $("#Nombre_form").val()
    var Descripcion_form = $("#Descripcion_form").val()

    // alert(Descripcion_form)
    var id_Persona = this.infoPerfilSesion._id;

    
    
    var datosEnvair = {
      'id': this.infoPerfilSesion._id,
      'nombre': Nombre_form,
      'usuario': this.infoPerfilSesion.usuario,
      'genero': this.infoPerfilSesion.genero,
      'edad': Edad_form,
      'deporte': Deporte_form,
      'profesion': Profesion_form,
      'password': this.infoPerfilSesion.password,
      'descripcion': Descripcion_form,
      'estadoCivil': Estado_form,
      'correo': Correo_form,
      "conectado": this.infoPerfilSesion.conectado,
    }


    this.servicioPerfiles.modificar(datosEnvair).subscribe(
      (responseObtener) => {
        // debugger;
        console.log(responseObtener);

        if (responseObtener['_id']) {
          var datos_sesion = {
            '_id': datosEnvair.id,
            'nombre': datosEnvair.nombre,
            'usuario': datosEnvair.usuario,
            'genero': datosEnvair.genero,
            'edad': datosEnvair.edad,
            'deporte': datosEnvair.deporte,
            'profesion': datosEnvair.profesion,
            'password': datosEnvair.password,
            'descripcion': datosEnvair.descripcion,
            'estadoCivil': datosEnvair.estadoCivil,
            'correo': datosEnvair.correo,
            'image': this.infoPerfilSesion.image,
            "conectado": datosEnvair.conectado,
          }
          sessionStorage.setItem('datosPerfil', JSON.stringify(datos_sesion));
          this.funcionesGenerales.mensajeExito("Se ha modificado el perfil con exito");  
        }else{
          this.funcionesGenerales.mensajeError("Error al modificar el perfil");
        }

        

        // sessionStorage.setItem('datosPerfil', JSON.stringify(datosEnvair));

      }, error => {
        // this.funcionesGenerales.userExcepcion('Error al obtener las personas', error, `${this.handleClick.name}`);
      }
    );


  }


  seleccionarImagen(event: any) {
    this.imagenSeleccionada = event.target.files[0];
  }

  enviarFormulario() {
    const formData = new FormData();
    this.id = this.infoPerfilSesion._id;
    formData.append('id', this.id);
    formData.append('imagen', this.imagenSeleccionada);

    // console.log(formData.getAll('id'));
    this.http.post('http://localhost:8080/api/insertFile', formData).subscribe(
      (response) => {
        // Manejar la respuesta de la API
        console.log(response);
        console.log("Se ha modificado la imagen con exito");
        this.funcionesGenerales.mensajeExito("Imagen actualizada con exito!!!");
      },
      (error) => {
        // Manejar errores

        if (error.statusText == "OK") {

          this.funcionesGenerales.mensajeExito("Imagen actualizada con exito!!!");

          const reader = new FileReader();

          reader.readAsDataURL(this.imagenSeleccionada);
          reader.onload = () => {
            this.dataUrl = reader.result;
            const nuevoString = this.dataUrl.split("data:image/png;base64,").join("");
            console.log(nuevoString)

            const imagenSesion = {
              "data": nuevoString,
              "type": 0
            }
            this.infoPerfilSesion.image = imagenSesion;

            console.log(this.infoPerfilSesion.image)
            sessionStorage.setItem('datosPerfil', JSON.stringify(this.infoPerfilSesion));
          };

        } else {

          this.funcionesGenerales.mensajeError("error actualizando imagen!!!");
          console.log(error);
        }

      }
    );
  }




}

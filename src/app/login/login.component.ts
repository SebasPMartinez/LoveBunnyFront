import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioModel } from '../Modelos/Usuario/usuario';
import { UsuarioService } from 'app/Servicios/Usuario/usuario.service';
import { funciones } from 'app/funciones';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  abrirModal: boolean = false;
  formularioLogin!: FormGroup;
  formularioInicio!: FormGroup;
  funcionesGenerales = new funciones();

  formData = new FormData();
  imagen: any;

  registrar: boolean = false;


  constructor(
    private creadorFormulario: FormBuilder,
    private servicioPerfiles: UsuarioService,
    private router: Router
  ) {
    this.inicializarLogin()

  }

  crearCuenta(){
    this.registrar = true;
  }

  inicializarLogin(): void {
    try {
      this.formularioLogin = this.creadorFormulario.group({
        nombre: [null, [Validators.required]],
        password: [null, [Validators.required]],
        deporte: [null, [Validators.required]],
        profesion: [null, [Validators.required]],
        estadoCivil: [null, [Validators.required]],
        genero: [null, [Validators.required]]
      })
      this.formularioInicio = this.creadorFormulario.group({
        usuario: [null, [Validators.required]],
        password: [null, [Validators.required]]
      })
    } catch (error) {
      this.funcionesGenerales.userExcepcion('Error al inicializar el formulario del login!', error, `${this.inicializarLogin.name}`);
    }
  }

  ingresar(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        if (this.formularioInicio.valid) {
          const servicioObtener = this.servicioPerfiles.iniciarSesion(this.formularioInicio.controls['usuario'].value, this.formularioInicio.controls['password'].value).subscribe(
            // const servicioObtener = this.servicioPerfiles.obtenerPorPerfil(this.formularioLogin.controls['usuario'].value).subscribe(
            async (responseObtener) => {


              if (responseObtener != null ) {
                // Se ingresa a la app
                console.log(responseObtener)
                sessionStorage.setItem('datosPerfil', JSON.stringify(responseObtener));
                this.router.navigateByUrl('/');
              } else {
                servicioObtener.unsubscribe();
                this.funcionesGenerales.mensajeAdvertencia('Credenciales incorrectas');
              }
              
            }
          );
        }
      } catch (error) {
        this.funcionesGenerales.userExcepcion('Error al iniciar sesión!', error, `${this.ingresar.name}`);
      }
    });
  }



  imagenSeleccionada(event: any) {
    const file = event.target.files[0];
    // Se guarda en la info a enviar a la base de datos
    this.formData.append("imagen", file);
    // Se convierte la imagen para dar una vista previa
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imagen = reader.result;
    };
  }





  selected: string = '';

  searchQuery: string = '';


  ngOnInit() {
  }

  onSelectChange(value: string) {
    this.selected = value;
  }
  
  

  CrearPerfil() {
    return new Promise(async (resolve, reject) => {
      try {
        let modelo = new UsuarioModel();
        console.log(this.formularioLogin.value);
        modelo = this.formularioLogin.value;
        // modelo.genero = parseInt(modelo.genero) == 0 ? 'F' : 'M';

        if (modelo.genero == "1") {
          modelo.genero = 'F';
        } else if (modelo.genero == "2") {
          modelo.genero = 'M';
        } else {
          modelo.genero = 'O';
        }

        if (modelo.estadoCivil == "1") {
          modelo.estadoCivil = 'Soltero';
        } else if (modelo.estadoCivil == "2") {
          modelo.estadoCivil = 'Casado';
        } else if (modelo.estadoCivil == "3") {
          modelo.estadoCivil = 'Separado';
        } else if (modelo.estadoCivil == "4") {
          modelo.estadoCivil = 'Divorsiado';
        } else if (modelo.estadoCivil == "5") {
          modelo.estadoCivil = 'Viudo';
        } 



        const servicioObtener = await this.servicioPerfiles.obtenerPorPerfil(modelo._id).subscribe(
          async (responseObtener) => {
            if (!this.funcionesGenerales.isDefinedAndNotEmpty(responseObtener._id)) {
              // Se realiza la petición al servicio de crear y se envia la info necesaria.
              // console.log("modelo");

              // console.log(modelo);
              await this.crear(modelo);
            } else {
              servicioObtener.unsubscribe();
              this.funcionesGenerales.mensajeAdvertencia('El perfil a registrar ya existe');
            }

          }, error => {
            this.funcionesGenerales.userExcepcion('Error al obtener el perfil', error, `${this.crear.name}`);
            servicioObtener.unsubscribe();
            reject();
          }
        );


      } catch (error) {
        this.funcionesGenerales.userExcepcion('Error al guardar los datos del perfil a registrar!', error, `${this.crear.name}`);
      }
    });
  }



  crear(datosPerfil: UsuarioModel): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Se realiza la petición al servicio de crear y se envia la info necesaria.
        const servicioAgregar = this.servicioPerfiles.crear(datosPerfil).subscribe(
          (response: any) => {
            // Se recibe la respuesta de la petición
            this.funcionesGenerales.mensajeExito('Perfil registrado con exito!');
            this.registrar = false;

            servicioAgregar.unsubscribe();
            resolve();

          }, error => {
            this.funcionesGenerales.userExcepcion('Error al crear el perfil', error, `${this.crear.name}`);
            servicioAgregar.unsubscribe();
            reject();
          }
        );
      } catch (error) {
        this.funcionesGenerales.userExcepcion('Error al crear el perfil', error, `${this.crear.name}`);
        reject();
      }
    });
  }
  onChange(event: Event) {
    // Obtener el valor seleccionado del select
    const valorSeleccionado = (event.target as HTMLSelectElement).value;

    // Hacer algo con el valor seleccionado
    // console.log(valorSeleccionado);

    if (valorSeleccionado == "1") {
      
      this.imagen = '../assets/img/avatars/3.png';

    } else if (valorSeleccionado == "2") {

      this.imagen = '../assets/img/avatars/8.png';
    } else {

      this.imagen = '../assets/img/avatars/6.png';
    }
  }

}

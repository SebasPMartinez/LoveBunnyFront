import Swal from "sweetalert2";


export class funciones {

    /*** 
     * Convierte una enumeración en una arreglo
     */
    enumToArray(enumeracion: any): Array<any> {
        const lista = [];

        for (const [propertyKey, propertyValue] of Object.entries(enumeracion)) {
            if (!Number.isNaN(Number(propertyKey))) {
                continue;
            }
            lista.push({ id: propertyValue, descripcion: propertyKey });
        }
        console.log(lista);

        return lista;
    }

    /**
     * Define si una información es undefined, nula, o está vacia
     * @param info
     * @returns 
     */
    isDefinedAndNotEmpty(info: any): boolean {
        let valido = false;
        if (info != null && info != undefined && info != "" && info.length > 0) {
            valido = true;
        }
        return valido
    }

    /**
     * Muestra mensaje de confirmación
     * @param mensaje
     * @returns 
     */
    confirmarMensaje(mensaje: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let confirmacion = false;
            Swal.fire({
                title: mensaje,
                showDenyButton: true,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
                customClass: {
                    actions: 'my-actions',
                    confirmButton: 'order-2',
                    denyButton: 'order-3',
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    confirmacion = true;
                } else if (result.isDenied) {
                    confirmacion = false;
                }
                resolve(confirmacion);
            });
            return confirmacion;
        });
    }

    /**
     * Muestra mensaje de exito
     * @param mensaje
     * @returns 
     */
    mensajeExito(mensaje: string): void {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: mensaje,
            showConfirmButton: false,
            timer: 3000
        })
    }

    /**
     * Muestra mensaje de error
     * @param mensaje
     * @returns 
     */
    mensajeError(mensaje: string): void {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: mensaje,
            showConfirmButton: false,
            timer: 3000
        })
    }

    /**
     * Muestra mensaje de advertencia
     * @param mensaje
     * @returns 
     */
    mensajeAdvertencia(mensaje: string): void {
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: mensaje,
            showConfirmButton: false,
            timer: 3000
        })
    }

    /**
     * Muestra mensaje de excepción
     * @param mensaje
     * @returns 
     */
    userExcepcion(mensaje: string, error: any, nombreComponente: string): void {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: mensaje,
            showConfirmButton: false,
            timer: 3000
        })
        console.log(error.message + ' - ' + nombreComponente);
    }

    /**
     * Valida response validator
     * @param mensaje
     * @returns 
     */

}
export interface Cliente {
    id?: number;
    cedula: string;
    nombre: string;
    apellido: string;
    f_nacimiento: string;
    genero: string;
    email: string;
    telefono: string;
    direccion: string;
    curso?: string;
}

// export interface Curso {
//     id: number;
//     nombre: string;
//     descripcion: string;
//     precio: number;
//     duracion: number;
// }

export interface Curso {
    id?: string;
    nombre: string;
    precio: number;
    modalidad: string;
    duracion: number;
    horario: string;
}


export interface Ciudad {
    id: number;
    nombre: string;
    provincia: string;
}   

export interface Info {
    tipo: string;
    icono: string;
    titulo: string;
    mensaje: string;
    id?: string;
    col?: string;
}
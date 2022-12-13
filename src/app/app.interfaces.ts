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

export interface Curso {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    duracion: number;
}

export interface Ciudad {
    id: number;
    nombre: string;
    provincia: string;
}   
export interface Cliente {
    id?: number;
    nombre: string;
    apellido: string;
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
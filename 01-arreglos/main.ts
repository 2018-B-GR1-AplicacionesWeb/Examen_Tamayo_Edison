declare var require: any;

const inquirer = require('inquirer');
const fs = require('fs');
const rxjs = require('rxjs');
const mergeMap = require('rxjs/operators').mergeMap;
const map = require('rxjs/operators').map;

const preguntaMenu = {
    type: 'list',
    name: 'opcionMenu',
    message: 'Que quieres hacer',
    choices: [
        'Crear',
        'Borrar',
        'Buscar',
        'Actualizar',
    ]
};

const preguntaUsuario = [
    {
        type: 'input',
        name: 'id',
        message: 'Cual es tu id'
    },
    {
        type: 'input',
        name: 'nombre',
        message: 'Cual es tu nombre'
    },
];

const preguntaUsuarioBusquedaPorNombre = [
    {
        type: 'input',
        name: 'nombre',
        message: 'Escribe el nombre del usuario a buscar'
    }
];


const preguntaUsuarioNuevoNombre = [
    {
        type: 'input',
        name: 'nombre',
        message: 'Escribe tu nuevo nombre'
    }
];

function main() {
    console.log('Empezo');

    inicializarBase()
        .pipe(
            mergeMap( // preguntar opcion
                (respuestaBDD: RespuestaBDD) => {
                    return preguntarMenu()
                        .pipe(
                            map(
                                (respuesta: OpcionesPregunta) => {
                                    return {
                                        respuestaUsuario: respuesta,
                                        respuestaBDD
                                    }

                                }
                            )
                        )
                }
            ), // dependiendo de la opcion PREGUNTAMOS DEPENDIENDO LAS OPCIONES
            mergeMap(
                (respuesta: RespuestaUsuario) => {
                    console.log(respuesta);
                    switch (respuesta.respuestaUsuario.opcionMenu) {
                        case 'Crear':
                            return rxjs
                                .from(inquirer.prompt(preguntaUsuario))
                                .pipe(
                                    map(
                                        (usuario) => {
                                            respuesta.usuario = usuario;
                                            return respuesta
                                        }
                                    )
                                );

                        default:
                            respuesta.usuario = {
                                id: null,
                                nombre: null
                            };
                            rxjs.of(respuesta)

                    }
                }
            ), // Ejecutar Accion
            map(
                (respuesta: RespuestaUsuario) => {
                    console.log('respuesta en accion', respuesta);
                    switch (respuesta.respuestaUsuario.opcionMenu) {
                        case 'Crear':
                            const people = respuesta.usuario;
                            respuesta.respuestaBDD.bdd.people.push(people)
                            return respuesta;

                    }
                }
            ), // Guardar Base de Datos
            mergeMap(
                (respuesta: RespuestaUsuario) => {
                    return guardarBase(respuesta.respuestaBDD.bdd);
                }
            )
        )
        .subscribe(
            (mensaje) => {
                console.log(mensaje);
            },
            (error) => {
                console.log(error);
            }, () => {
                console.log('Completado');
                main();
            }
        )

}

function inicializarBase() {

    const leerBDD$ = rxjs.from(leerBDD());

    return leerBDD$

}


function preguntarMenu() {
    return rxjs.from(inquirer.prompt(preguntaMenu))
}


function leerBDD(){
    // @ts-ignore
    return new Promise(
        (resolve) => {
            fs.readFile(
                'people.json',
                'utf-8',
                (error, contenidoLeido) => {
                    if (error) {
                        resolve({
                            mensaje: 'Base de datos vacia',
                            bdd: null
                        });
                    } else {
                        resolve({
                            mensaje: 'Si existe la Base',
                            bdd: JSON.parse(contenidoLeido)
                        });
                    }

                }
            );
        }
    );
}

function guardarBase(bdd: BaseDeDatos) {
    // @ts-ignore
    return new Promise(
        (resolve, reject) => {
            fs.writeFile(
                'people.json',
                JSON.stringify(bdd),
                (err) => {
                    if (err) {
                        reject({
                            mensaje: 'Error guardando BDD',
                            error: 500
                        })
                    } else {
                        resolve({
                            mensaje: 'BDD guardada'
                        })
                    }
                }
            )
        }
    );
}


function anadirPeople(people) {
    // @ts-ignore
    return new Promise(
        (resolve, reject) => {
            fs.readFile('people.json', 'utf-8',
                (err, contenido) => {
                    if (err) {
                        reject({mensaje: 'Error leyendo'});
                    } else {
                        const bdd = JSON.parse(contenido);


                        bdd.people.push(people);


                        fs.writeFile(
                            'people.json',
                            JSON.stringify(bdd),
                            (err) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve({mensaje: 'Usuario Creado'});
                                }
                            }
                        );
                    }
                });
        }
    );
}



function AgruparGenero(gender) {
    // @ts-ignore
    return new Promise(
        (resolve, reject) => {
            fs.readFile('people.json', 'utf-8',
                (err, contenido) => {
                    if (err) {
                        reject({mensaje: 'Error leyendo'});
                    } else {
                        const bdd = JSON.parse(contenido);

                        const respuestaFind = bdd.map('gender')
                        resolve(respuestaFind);
                    }
                });
        }
    );
}

function AgruparOjos(eye_color) {
    // @ts-ignore
    return new Promise(
        (resolve, reject) => {
            fs.readFile('people.json', 'utf-8',
                (err, contenido) => {
                    if (err) {
                        reject({mensaje: 'Error leyendo'});
                    } else {
                        const bdd = JSON.parse(contenido);

                        const respuestaFind = bdd.map('eye_color')
                        resolve(respuestaFind);
                    }
                });
        }
    );
}

function AgruparPiel(skin_color) {
    // @ts-ignore
    return new Promise(
        (resolve, reject) => {
            fs.readFile('people.json', 'utf-8',
                (err, contenido) => {
                    if (err) {
                        reject({mensaje: 'Error leyendo'});
                    } else {
                        const bdd = JSON.parse(contenido);

                        const respuestaFind = bdd.map('skin_color')
                        resolve(respuestaFind);
                    }
                });
        }
    );
}

function AgruparCabello(hair_color) {
    // @ts-ignore
    return new Promise(
        (resolve, reject) => {
            fs.readFile('people.json', 'utf-8',
                (err, contenido) => {
                    if (err) {
                        reject({mensaje: 'Error leyendo'});
                    } else {
                        const bdd = JSON.parse(contenido);

                        const respuestaFind = bdd.map('hair_color')
                        resolve(respuestaFind);
                    }
                });
        }
    );
}

main();


interface RespuestaBDD {
    mensaje: string,
    bdd: BaseDeDatos
}

interface BaseDeDatos {
    people: people[];

}


interface people {
    "name": string;
    "height": number;
    "mass": number;
    "hair_color": string;
    "skin_color": string;
    "eye_color": string;
    "birth_year": string;
    "gender": string;
    "homeworld": string;
    "films": [string];
    "species": [string];
    "vehicles": [string];
    "starships": [string];
    "created": string;
    "edited": string;
    "url": string;
}

interface OpcionesPregunta {
    opcionMenu: 'Crear' | 'Borrar' | 'Buscar' | 'Actualizar'
}

interface RespuestaUsuario {
    respuestaUsuario: OpcionesPregunta,
    respuestaBDD: RespuestaBDD
    usuario?: people
}













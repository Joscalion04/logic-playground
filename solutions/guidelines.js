/*
============================================================
 GUÍA COMPACTA DE JAVASCRIPT EN UN SOLO ARCHIVO
 Autor: Joscalion04 (Joseph Leon)
 Propósito: Repaso de estructuras de control, sintaxis, semántica,
            funciones (incl. lambdas/arrow), POO, asincronía y tips.

 NOTAS GENERALES
 - Standard moderno: ECMAScript 2020+ (ES2020+). Usa 'use strict' cuando sea útil.
 - JS es dinámico, débilmente tipado, multiparadigma y con GC.
 - Motor de ejecución con Event Loop, Call Stack, Heap, Queue y Microtask Queue.
============================================================
*/

'use strict'; // Activa modo estricto: evita errores silenciosos y ciertas malas prácticas.

/*
============================================================
 1) TIPOS PRIMITIVOS Y OBJETOS BÁSICOS
============================================================
*/
// Primitivos: string, number (incl. NaN, Infinity), boolean, null, undefined, bigint, symbol
const cadena = 'Hola';
const numero = 42;          // IEEE-754 double, también 42.0
const booleano = true;      
const nada = null;          // "ausencia intencional de valor"
let indefinido;             // undefined por omisión
const grande = 123n;        // BigInt (enteros arbitrariamente grandes)
const uniq = Symbol('id');  // Identificadores únicos

// Objetos: envoltorios y estructuras ricas (Array, Object, Function, Date, Map, Set, RegExp, etc.)
const obj = { a: 1, b: 2 };
const arr = [1, 2, 3];

// typeof: operador de inspección de tipo (ojo con null)
// console.log(typeof null); // 'object' (quirk histórico)

/*
============================================================
 2) VARIABLES, ÁMBITO Y HOISTING
============================================================
*/
// var: ámbito de función, hoisting de declaración (evitar en código moderno)
// let/const: ámbito de bloque, sin redeclaración en el mismo bloque
let x = 1;
const y = 2; // inmutable en binding, no hace inmutable al objeto referenciado

// Hoisting: las declaraciones se mueven al tope del ámbito, pero asignaciones no
// console.log(hoisted); // ReferenceError con let/const, undefined con var
var hoisted = 'ok';

/*
============================================================
 3) OPERADORES Y COERCIÓN
============================================================
*/
// == permite coerción; === comparación estricta (recomendado)
// console.log(0 == false); // true (coerción)
// console.log(0 === false); // false

// Nullish coalescing (??): usa el RHS solo si LHS es null o undefined
const valor = undefined ?? 'fallback'; // 'fallback'

// Optional chaining (?.): evita errores si una ruta es null/undefined
const usuario = { perfil: { nombre: 'Ada' } };
const nombreSeguro = usuario?.perfil?.nombre; // 'Ada'

/*
============================================================
 4) DESTRUCTURING, SPREAD Y REST
============================================================
*/
const punto = { px: 10, py: 20, pz: 30 };
const { px, py, pz = 0 } = punto; // alias directo; default si falta

const tuple = [10, 20, 30, 40];
const [primero, segundo, ...resto] = tuple; // resto: [30, 40]

const copia = { ...punto, py: 99 }; // spread (shallow copy)

/*
============================================================
 5) ESTRUCTURAS DE CONTROL
============================================================
*/
// IF / ELSE IF / ELSE
function clasificar(n) {
  if (n > 0) return 'positivo';
  else if (n < 0) return 'negativo';
  else return 'cero';
}

// SWITCH (ideal cuando hay múltiples casos discretos)
function calificacion(nota) {
  switch (true) {
    case nota >= 90: return 'A';
    case nota >= 80: return 'B';
    case nota >= 70: return 'C';
    default: return 'D';
  }
}

// BUCLES: for, while, do-while
for (let i = 0; i < 3; i++) {
  // iteración clásica
}

let i = 0;
while (i < 3) { i++; }

do { /* cuerpo */ } while (false);

// for...of: sobre iterables (Array, String, Map, Set, etc.)
for (const n of [1, 2, 3]) { /* n es valor */ }

// for...in: sobre claves enumerables de objetos (ojo con herencia)
for (const k in { a: 1, b: 2 }) { /* k es 'a', 'b' */ }

// break/continue y etiquetas (usar con moderación)
outer: for (let a = 0; a < 2; a++) {
  for (let b = 0; b < 2; b++) {
    if (a === b) continue;
    if (a + b > 2) break outer;
  }
}

/*
============================================================
 6) MANEJO DE ERRORES: try/catch/finally y throw
============================================================
*/
function dividir(a, b) {
  if (b === 0) throw new Error('División por cero');
  return a / b;
}

try {
  dividir(4, 0);
} catch (e) {
  // e instanceof Error
  // console.error('Error:', e.message);
} finally {
  // siempre se ejecuta
}

/*
============================================================
 7) FUNCIONES, ÁMBITO LÉXICO Y CIERRES (CLOSURES)
============================================================
*/
// Declaración (hoisting de la firma)
function suma(a, b = 0) { // default params
  return a + b;
}

// Expresión de función
const mul = function (a, b) { return a * b; };

// Arrow functions (lambdas): this léxico, return implícito cuando es expresión
const cuadrado = x => x * x;           // 1 parámetro, retorno implícito
const par = (x) => (x % 2 === 0);      // paréntesis opcional según estilo
const toObj = (k, v) => ({ [k]: v });  // envolver en () para devolver objeto literal

// Closures: función interna recuerda variables del entorno donde fue creada
function contador() {
  let c = 0; // estado privado
  return function () { c++; return c; };
}
const inc = contador(); // inc() -> 1, 2, 3...

// Rest parameters y spread en llamadas
function maximo(...nums) { return nums.reduce((m, n) => n > m ? n : m, -Infinity); }
const m = maximo(...[1, 5, 3]);

/*
============================================================
 8) EL VALOR DE `this`, call/apply/bind
============================================================
*/
const contexto = {
  valor: 10,
  normal: function () { return this.valor; }, // this dinámico (según invocación)
  arrow: () => { /* this léxico (heredado del entorno) */ return this; }
};

const metodo = contexto.normal;
// metodo(); // en modo estricto -> undefined como this; en no estricto -> objeto global

// Forzar this con call/apply; bind retorna función ligada
function show(prefix) { return `${prefix}:${this.valor}`; }
show.call({ valor: 7 }, '>>'); // '>>:7'
show.apply({ valor: 8 }, ['**']); // '**:8'
const ligada = show.bind({ valor: 9 }, '!!'); // parámetros parciales

/*
============================================================
 9) OBJETOS, PROTOTIPOS Y CLASES (POO)
============================================================
*/
// Prototipos directos
const base = { saludar() { return 'hola'; } };
const derivado = Object.create(base); // hereda de base

// Definición con funciones constructoras (estilo clásico)
function Persona(nombre) {
  this.nombre = nombre;
}
Persona.prototype.saludar = function () { return `Hola, soy ${this.nombre}`; };
const p1 = new Persona('Ada');

// Clases (azúcar sintáctico sobre prototipos)
class Punto {
  // campos públicos
  x; y;
  // campo privado (# require soporte moderno)
  #id;
  constructor(x = 0, y = 0) {
    this.x = x; this.y = y; this.#id = Symbol('p');
  }
  mover(dx, dy) { this.x += dx; this.y += dy; }
  get r() { return Math.hypot(this.x, this.y); } // getter
  set r(nuevo) { /* ejemplo didáctico */ this.x = nuevo; this.y = 0; } // setter
  static origen() { return new Punto(0, 0); } // método estático
}

class PuntoColor extends Punto {
  constructor(x, y, color = 'black') { super(x, y); this.color = color; }
  toString() { return `(${this.x},${this.y})#${this.color}`; }
}

// Mixins (composición de comportamientos)
const Movible = Base => class extends Base { mover(dx, dy) { this.x += dx; this.y += dy; } };
class Entidad {}
class Sprite extends Movible(Entidad) { constructor(){ super(); this.x=0; this.y=0; } }

/*
============================================================
 10) INMUTABILIDAD SUPERFICIAL Y COPIAS
============================================================
*/
const original = { a: 1, b: { c: 2 } };
const copiaShallow = { ...original }; // b sigue compartido (shallow)
const copiaDeep = JSON.parse(JSON.stringify(original)); // deep naive (pierde métodos, fechas, etc.)

/*
============================================================
 11) COLECCIONES MODERNAS: Map, Set, WeakMap, WeakSet
============================================================
*/
const mapa = new Map();
mapa.set('k', 1); mapa.set({ obj: true }, 2);
const conjunto = new Set([1,2,2,3]); // -> {1,2,3}

/*
============================================================
 12) ITERABLES Y GENERADORES
============================================================
*/
// Un objeto es iterable si implementa Symbol.iterator -> retorna un iterador
const rango = {
  from: 1, to: 3,
  [Symbol.iterator]() {
    let cur = this.from; const end = this.to;
    return {
      next() {
        return cur <= end ? { value: cur++, done: false } : { done: true };
      }
    };
  }
};

// Generadores: producen iteradores de forma más simple
function* genId() {
  let id = 0;
  while (true) yield id++;
}
const nextId = genId(); // nextId.next().value -> 0,1,2...

/*
============================================================
 13) FUNCIONAL: inmutabilidad, map/filter/reduce, composición
============================================================
*/
const nums = [1,2,3,4];
const cuadrados = nums.map(n => n*n);
const pares = nums.filter(n => n%2===0);
const sumaTotal = nums.reduce((acc, n) => acc + n, 0);

/*
============================================================
 14) ASINCRONÍA: Callbacks, Promesas y async/await
============================================================
*/
// Callback (evitar pirámide del infierno)
function tareaAsincronaCB(ok, err) {
  setTimeout(() => ok('listo'), 10);
}

// Promesa
function tareaAsincrona() {
  return new Promise((resolve) => setTimeout(() => resolve('ok'), 10));
}

// Encadenamiento y manejo de errores
// tareaAsincrona().then(r => r).catch(e => e).finally(() => {});

// async/await (azúcar sobre promesas)
async function flujo() {
  try {
    const r = await tareaAsincrona();
    return r;
  } catch (e) {
    // manejo de error
    return 'error';
  }
}

// Microtareas vs Macrotareas: Promise.then encola microtarea; setTimeout es macrotarea
Promise.resolve().then(() => {/* microtask */});
setTimeout(() => {/* macrotask */}, 0);

/*
============================================================
 15) MÓDULOS (ESM) Y COMMONJS (NOTA RÁPIDA)
============================================================
*/
// ESM (navegador moderno / Node con "type":"module"):
// export function foo() {}
// export default class {}
// import { foo } from './mod.js';

// CommonJS (Node clásico):
// module.exports = { foo };
// const { foo } = require('./mod');

/*
============================================================
 16) FECHAS, REGEX Y UTILERÍAS
============================================================
*/
const ahora = new Date(); // cuidado con zonas horarias
const iso = ahora.toISOString();

const correoRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const esCorreo = (s) => correoRe.test(s);

/*
============================================================
 17) BUENAS PRÁCTICAS RESUMIDAS
============================================================
*/
// - Prefiere const/let y ===/!==.
// - Limita el uso de var, for...in y this implícito.
// - Maneja errores: try/catch o .catch en promesas.
// - Evita mutaciones innecesarias; usa spread y funciones puras cuando sea razonable.
// - Documenta contratos de función (args, retorno, efectos colaterales).
// - Separa sincronía de asincronía; nombra funciones async con claridad.
// - En POO, prefiere composición sobre herencia profunda.
// - Mide performance antes de optimizar (console.time, Performance API, profilers).

/*
============================================================
 18) MINI-EJERCICIOS DE REPASO (sin soluciones aquí)
============================================================
*/
// 1) Implementar memoización de una función pura (e.g., fib) con Map.
// 2) Crear un limitador de concurrencia para promesas (p-limit simple).
// 3) Diseñar una LRU cache con Map y lista doblemente enlazada (o solo Map + orden).
// 4) Implementar un EventEmitter minimalista (on/off/once/emit).
// 5) Escribir un retry con backoff exponencial para funciones async.

/* Fin de la guía */

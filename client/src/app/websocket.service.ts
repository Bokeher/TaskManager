// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { io, Socket } from 'socket.io-client';
// import { HttpClient } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root',
// })
// export class WebSocketService {
//   private socket: Socket;
//   private baseUrl = 'http://localhost:4000';

//   constructor(private http: HttpClient) {
//     this.socket = io(this.baseUrl);
//   }

//   emit(event: string): void {
//     this.socket.emit(event);
//   }

//   on(event: string): Observable<any> {
//     return new Observable((observer) => {
//       this.socket.on(event, () => {
//         observer.next();
//       });
//     });
//   }

//   onDataChange(): Observable<any> {
//     return this.on('dataChange');
//   }
// }

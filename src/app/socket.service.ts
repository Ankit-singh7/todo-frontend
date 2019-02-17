import { Injectable } from '@angular/core';

//Added for Http and Observables
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import * as io from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public baseUrl = "http://localhost:3002";
  public socket;

  constructor(private http: HttpClient) {
    //console.log("SocketService is called");
    //handshake is happening
    //console.log("Contructor of Socket Service")
    this.socket = io(this.baseUrl,{forceNew: true});
    //console.log(this.socket)
  } 

    //events that has to be listen
    public verifyUser = () => {
      return Observable.create((observer) => {
        this.socket.on('verifyUser', (data) => {
          observer.next(data);
        });//On method
      });//end observable
    }//end verifyUser
  
    public onlineUserList = () => {
      return Observable.create((observer) => {
        this.socket.on('online-user-list', (userList) => {
          observer.next(userList);
        });//end On method
      });//end observable
  
    }//end onlineUserList
  
    public disconnect = () => {
      return Observable.create((observer) => {
        this.socket.on('disconnect', () => {
          observer.next();
        });//end On method
      });//end observable
  
    }//end disconnect
    public listenAuthError = () => {
      return Observable.create((observer) => {
        this.socket.on('auth-error', (data) => {
          observer.next(data);
        }); // end Socket
      }); // end Observable
    } // end listenAuthError
      
    public getUpdatesFromUser = (userId) => {
      return Observable.create((observer) => {
        this.socket.on(userId, (data) => {
          observer.next(data);
        }); // end Socket
      }); // end Observable
    } // end getUpdatesFromUser


    //* Events that are emitted *//


  public setUser = (authToken) => {
    this.socket.emit('set-user', authToken);
  }


  public notifyUpdates = (data) => {
    this.socket.emit('notify-updates', data);
  }

  public notifyUpdatesItem = (data) => {
    this.socket.emit('notify-updates-item', data);
  }

  public exitSocket = () =>{
    this.socket.disconnect();
  }// end exit socket
  public disconnectedSocket = () => {

      this.socket.emit("disconnect", "");//end Socket

  }//end disconnectedSocket

} 
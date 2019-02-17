
import { Component, OnInit ,Input,OnChanges,SimpleChanges} from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import { AppService } from '../../app.service'
import { SocketService } from '../../socket.service';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-own-navbar',
  templateUrl: './own-navbar.component.html',
  styleUrls: ['./own-navbar.component.css']
})
export class OwnNavbarComponent implements OnInit,OnChanges {
  @Input() active: string;


  public userId:string;
  public userName:string;
  public authToken:string;
  public activeNav:any

  constructor(
    public appService:AppService,
    public toastr:ToastrService,
    public router:Router,
    public socketService: SocketService,

  ) { }

  ngOnInit() {
    this.authToken = Cookie.get('authToken');
    this.userId = Cookie.get('userId');
    this.userName = Cookie.get('userName');

    this.activeNav = this.active;
  }

  public logoutFunction = () => {

    this.appService.logout(this.userId,this.authToken).subscribe(
      (apiResponse) => {
        if (apiResponse.status === 200) {
          localStorage.clear();
          Cookie.delete('authToken');//delete all the cookies
          Cookie.delete('userId');
          Cookie.delete('userName');
          this.socketService.disconnectedSocket();//calling the method which emits the disconnect event.
          this.socketService.exitSocket();//this method will disconnect the socket from frontend and close the connection with the server.
          this.router.navigate(['/login']);//redirects the user to login page.
        } else {
          this.toastr.error(apiResponse.message,"Error!")
          this.router.navigate(['/serverError']);//in case of error redirects to error page.
        } // end condition
      },
      (err) => {
        if(err.status == 404){
          this.toastr.warning("Logout Failed", "Already Logged Out or Invalid User");
          this.router.navigate(['/user/login']);
        }
        else{
          this.toastr.error("Some Error Occurred", "Error!");
          this.router.navigate(['/serverError']);

        }
    });

  }//end logout  
  ngOnChanges(changes: SimpleChanges){
    this.activeNav = changes.active;
  }

}
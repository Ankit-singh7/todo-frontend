
import { Component, OnInit ,Inject, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '../../app.service'
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import { SocketService } from '../../socket.service';

@Component({
  selector: 'app-single-user',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.css'],
  providers: [SocketService]

})
export class SingleUserComponent implements OnInit ,OnDestroy{
  /* User Details */
  public userId:string;
  public userName:string;
  public userInfo: any;
  public authToken:string;
  public allLists:any = []

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
    this.userInfo = this.appService.getUserInfoFromLocalStorage()
    //console.log(this.userInfo)
    this.verifyUserConfirmation()
    this.getUpdatesFromUser()
    this.getAllListFunction()
  }


  getUpdatesFromContainer(){
    this.getAllListFunction()
  }

  //* Database functions *//

  /* List Related Functions */

  public getAllListFunction = () => {
    //this function will get all the lists of User. 
        
    if (this.userId != null && this.authToken != null) {
      this.appService.getAllList(this.userId, this.authToken).subscribe((apiResponse) => {
        if (apiResponse.status == 200) {

          this.allLists = apiResponse.data;
          //this.toastr.info("Lists Updated", `Lists Found!`);
          //console.log(this.allLists)

        }
        else {
          this.toastr.info(apiResponse.message, "Update!");
          this.allLists.length = 0;

        }
      },
        (error) => {
          if (error.status == 400) {
            this.toastr.warning("Lists Failed to Update", "Either user or List not found");
            this.allLists.length = 0;
          }
          else {
            this.toastr.error("Some Error Occurred", "Error!");
            this.router.navigate(['/serverError']);

          }
        }//end error
      );//end appservice.getAllLists

    }//end if checking undefined
    else {
      this.toastr.info("Missing Authorization Key", "Please login again");
      this.router.navigate(['/login']);

    }

  }//end getAllListFunction


  //listened
  public verifyUserConfirmation: any = () => {
    this.socketService.verifyUser()
      .subscribe(() => {
        this.socketService.setUser(this.authToken);//in reply to verify user emitting set-user event with authToken as parameter.
      },
      (err) => {
        this.toastr.error(err,"Some error occured");
      });//end subscribe
  }//end verifyUserConfirmation
  public getUpdatesFromUser= () =>{

    this.socketService.getUpdatesFromUser(this.userId).subscribe((data) =>{
      //getting message from user.
      
      this.toastr.info(data.message);
    });
  }

  ngOnDestroy() {
    this.socketService.exitSocket()
  }

}

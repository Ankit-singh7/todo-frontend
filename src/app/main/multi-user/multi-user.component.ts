
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '../../app.service'
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import { SocketService } from '../../socket.service';

@Component({
  selector: 'app-multi-user',
  templateUrl: './multi-user.component.html',
  styleUrls: ['./multi-user.component.css'],
  providers: [SocketService]

})
export class MultiUserComponent implements OnInit {
  public allLists: any = []

  /* User Details */
  public userId: string;
  public userName: string;
  public userInfo: any;
  public authToken: string;
  public userDetails: any;
  public cookieFriends:any;
  public userFriendsTemp: any = []
  public userFriends: any = []

  constructor(
    public appService: AppService,
    public toastr: ToastrService,
    public router: Router,
    public socketService: SocketService,

  ) { }

  ngOnInit() {
    this.authToken = Cookie.get('authToken');
    this.userId = Cookie.get('userId');
    this.userName = Cookie.get('userName');
  
    
    this.userInfo = this.appService.getUserInfoFromLocalStorage()
    
    this.userFriendsTemp.push(this.userId) // add all friends and user to variable to get their public lists

    for (let x of this.userInfo.friends) {
      this.userFriendsTemp.push(x.friendId)
      this.userFriends.push(x.friendId) // array of friends to notify about changes of todo
    }

    //console.log(this.userFriendsTemp)
    this.verifyUserConfirmation()

    this.getUpdatesFromUser()
    
    this.getAllPublicListFunction(this.userFriendsTemp)
  }


  getUpdatesFromContainer(data) {

    let dataForNotify = {
      message: data.message,
      userId: this.userFriends,
      listId:data.listId
    }

    this.notifyUpdatesToUser(dataForNotify);
  }



  //* Database functions *//

  /* List Related Functions */

  public getAllPublicListFunction = (userIds) => {
    //this function will get all the public lists of User. 
    this.allLists = []
    if (this.authToken != null) {
      this.appService.getAllSharedList(userIds, this.authToken).subscribe((apiResponse) => {
        if (apiResponse.status == 200) {

          //console.log(apiResponse.data)

          for (let apiItem of apiResponse.data) {
            this.allLists.push(apiItem)
          }


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

  }//end getAllPublicListFunction

  //* Sockets functions *//
  /* Listened Events */

  public getUpdatesFromUser = () => {

    this.socketService.getUpdatesFromUser(this.userId).subscribe((data) => {
      //getting message from user.
      this.toastr.info(data.message);
      //console.log(data)

      if(!data.listId)
        this.getAllPublicListFunction(this.userFriendsTemp)

    });
  }//end getUpdatesFromUser

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
  
  //emitted 
  public notifyUpdatesToUser: any = (data) => {
    //data will be object with message and userId(recieverId)
    this.socketService.notifyUpdates(data);
    //console.log(data)

    if(!data.listId)
      this.getAllPublicListFunction(this.userFriendsTemp)

  }//end notifyUpdatesToUser


}

import { Component, OnInit, Input, EventEmitter, Output, ViewChild, TemplateRef, HostListener } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';


import { MatDialog } from '@angular/material';

import { AppService } from '../../app.service'

import { SocketService } from '../../socket.service';

//import for Routing
import { Router } from '@angular/router';


//import for toastr
import { ToastrService } from 'ngx-toastr';

import { DialogBoxComponent } from '../../shared/dialog-box/dialog-box.component'

import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],

})

export class ListComponent implements OnInit {
  @Input() allLists: any = [];
  @Input() userMode: any;

  @Output()
  notify: EventEmitter<String> = new EventEmitter<String>();

  @ViewChild('modalContent') modalContent: TemplateRef<any>;


  public value = 'push';
  public other = false;
  public enteredListName = '';
  public enteredTaskName = '';
  public enteredSubTaskName = '';

  public errorMessage;

  public enableAddTaskBox = true;
  public enableAddSubTaskBox = true;

  public taskBox = false;
  public subTaskBox = false;


  /* User Details */
  public userId: string;
  public userName: string;
  public userInfo: any;
  public authToken: string;
  //public allLists = []
  public allItems = []

  /* list Details */
  public selectedListName: string;
  public selectedListNameTemp: string = '';
  public selectedListId: string;
  public selectedListMode: string;
  public listName: string;
  public listCreatorId:string;
  public selectedItemId: string;
  public selectedItemName: string;
  public itemName: string;
  public itemsCount: number;
  public itemsDoneCount: number;

  public subItemName: string;

  /* Model Data */
  modalData: {
    eventData: any;
  };


  constructor(
    public appService: AppService,
    public toastr: ToastrService,
    public router: Router,
    public dialog: MatDialog,
    private modal: NgbModal,
    public socketService: SocketService,

  ) { }

  ngOnInit() {
    this.authToken = Cookie.get('authToken');
    this.userId = Cookie.get('userId');
    this.userName = Cookie.get('userName');
    this.userInfo = this.appService.getUserInfoFromLocalStorage()

    //console.log(this.userInfo)
    this.getUpdatesFromUser()
  }

  notifyUserAboutList(data) {
    this.notify.emit(data);
  }


  /* List Functions */

  public addListUsingKeypress: any = (event: any) => {

    if (event.keyCode === 13) { // 13 is keycode of enter.
      if (this.enteredListName === null || this.enteredListName === '' || this.enteredListName == undefined) {
        this.toastr.error("You must enter a value", "Error!");
      }
      else {
        //console.log("Full")
        this.listName = this.enteredListName;
        this.addListFunction()
        this.enteredListName = ''
        this.disableListBox();
      }
    }//end keycode if

  } // end addListUsingKeypress

  public updateListUsingKeypress: any = (event: any) => {

    if (event.keyCode === 13) { // 13 is keycode of enter.
      if (this.selectedListName === null || this.selectedListName === '' || this.selectedListName == undefined || this.selectedListName == this.selectedListNameTemp) {
        this.toastr.info("Not Updated", "Info!");
      }
      else {
    
        this.updateListFunction(this.selectedListName, this.userMode)
        this.selectedListNameTemp = this.selectedListName

      }
    }//end keycode if

  } // end updateListUsingKeypress

  public updateListName: any = () => {
    //console.log(this.selectedListName)
    //console.log(this.selectedListNameTemp)

    if (this.selectedListName != this.selectedListNameTemp) {
      this.updateListFunction(this.selectedListName, this.userMode)
      this.selectedListNameTemp = this.selectedListName
    }

  } // end updateListName

  public updateListMode: any = () => {
    //console.log(this.selectedListName)
    //console.log(this.selectedListMode)

    this.updateListFunction(this.selectedListName, this.selectedListMode)

  } // end updateListMode

  public enableListBox: any = () => {

    this.other = true;

  } // end enableListBox

  public disableListBox: any = () => {

    this.other = false;

  } // end disableListBox


  public getItemsOfList = (list) => {
    this.selectedListNameTemp = list.listName;
    this.selectedListName = list.listName;
    this.selectedListId = list.listId;
    this.selectedListMode = list.listMode;
    this.listCreatorId = list.listCreatorId
    this.enableAddTaskBox = true;
    this.taskBox = false;
    this.getAllItemFunction()
  }


  /* Item Functions */

  public addTaskUsingKeypress: any = (event: any) => {

    if (event.keyCode === 13) { // 13 is keycode of enter.
      if (this.enteredTaskName === null || this.enteredTaskName === '' || this.enteredTaskName == undefined) {

        this.toastr.error("You must enter a value", "Error!");

      }
      else {

        this.itemName = this.enteredTaskName
        this.addItemFunction();
        this.enteredTaskName = ''
        this.disableAddTaskBoxFunction();
      }
    }//end keycode if

  } // end addTaskUsingKeypress

  public updateTaskName: any = () => {
    //console.log(this.selectedListName)
    //console.log(this.selectedListNameTemp)

    if (this.selectedListName != this.selectedListNameTemp) {
      this.updateListFunction(this.selectedListName, 'private')
      this.selectedListNameTemp = this.selectedListName
    }

  } // end updateTaskName

  public markAsDoneUndone: any = (itemId, itemName, itemDone) => {
    //console.log(itemId)
    //console.log(itemName)
    //console.log(itemDone)

    this.updateItemFunction(false, null, itemId, itemName, itemDone)

  } // end markAsDoneUndone

  public enableAddTaskBoxFunction: any = () => {

    this.enableAddTaskBox = false;
    this.taskBox = true;

  } // end enableAddTaskBoxFunction

  public disableAddTaskBoxFunction: any = () => {

    this.enableAddTaskBox = true;
    this.taskBox = false;

  } // end disableAddTaskBoxFunction



  /* sub item Functions */

  public enableAddSubTaskBoxFunction: any = () => {

    this.enableAddSubTaskBox = false;
    this.subTaskBox = true;

  } // end enableAddSubTaskBoxFunction


  public markSubTaskAsDoneUndone: any = (itemId, subItemId, subItemName, subItemDone) => {
    //console.log(subItemDone)
    this.updateSubItemFunction(false,null,itemId, subItemId, subItemName, subItemDone,)

  } // end markSubTaskAsDoneUndone


  /* View Details */

  public openModel: any = (eventData: any) => {
    this.modalData = { eventData };
    this.modal.open(this.modalContent, { size: 'lg' });
  }



  /* Database functions */

  /* List functions */
  public getListDetailsFunction = () => {

    //this function will get details of given list. 

    if (this.selectedListId != null && this.authToken != null) {
      this.appService.getListDetails(this.selectedListId, this.authToken).subscribe((apiResponse) => {
        if (apiResponse.status == 200) {

          let resultData = {
            action: 'List Details',
            name: apiResponse.data.listName,
            creatorName: apiResponse.data.listCreatorName,
            createdOn: apiResponse.data.listCreatedOn,
            modifierName: apiResponse.data.listModifierName,
            modifiedOn: apiResponse.data.listModifiedOn
          }

          //Open model here with response data
          this.openModel(resultData)

        }
        else {
          this.toastr.info(apiResponse.message, "Update!");
        }
      },
        (error) => {
          if (error.status == 400) {
            this.toastr.warning("Failed to get List Details", "Either user or List not found");

          }
          else {
            this.toastr.error("Some Error Occurred", "Error!");
            this.router.navigate(['/serverError']);

          }
        }//end error
      );//end appservice.getListDetails

    }//end if checking undefined
    else {
      this.toastr.info("Missing Authorization Key", "Please login again");
      this.router.navigate(['/login']);

    }

  }//end getListDetailsFunction

  public addListFunction(): any {

    if (!this.listName) {
      this.toastr.warning("List Name is required", "Warning!");
    }
    else {
      let data = {
        listName: this.listName,
        listCreatorId: this.userId,
        listCreatorName: this.userName,
        listModifierId: this.userId,
        listModifierName: this.userName,
        listMode: this.userMode,
        authToken: this.authToken
      }

      //console.log(data)  
      this.appService.addList(data).subscribe((apiResponse) => {

        if (apiResponse.status == 200) {
          this.listName="";
          this.toastr.success("List Added", "Success");
         

          let notifyData = {
            message: `${data.listCreatorName} has added a List named as ${data.listName}`,
          }
    
          this.notifyUserAboutList(notifyData);


          
        }
        else {
          this.toastr.error(apiResponse.message, "Error!");
        }
      },
        (error) => {
          if (error.status == 400) {
            this.toastr.warning("Failed to add List", "One or more fields are missing");
          }
          else {
            this.toastr.error("Some Error Occurred", "Error!");
            this.router.navigate(['/serverError']);

          }
        });//end calling addMeeting
    }
  }//end addListFunction

  public updateListFunction(name, mode): any {

    if (!name) {
      this.toastr.warning("List Name is required", "Warning!");
    }
    else if (mode == undefined) {
      this.toastr.warning("List Mode is required", "Warning!");
    }
    else {
      let data = {
        listId: this.selectedListId,
        listName: name,
        listModifierId: this.userId,
        listModifierName: this.userName,
        listMode: mode,
        authToken: this.authToken
      }

      //console.log(data)  
      this.appService.updateList(data).subscribe((apiResponse) => {

        if (apiResponse.status == 200) {
          this.toastr.success("List Name Updated", "Success");

          let notifyData = {
            message: `${data.listModifierName} has updated a list name ${data.listName}`,
          }
    
          this.notifyUserAboutList(notifyData);

        }
        else {
          this.toastr.error(apiResponse.message, "Error!");
        }
      },
        (error) => {
          if (error.status == 400) {
            this.toastr.warning("Failed to Update List", "One or more fields are missing");
          }
          else {
            this.toastr.error("Some Error Occurred", "Error!");
            this.router.navigate(['/serverError']);

          }
        });//end calling addMeeting
    }
  }//end updateListFunction

  public deleteListFunction(): any {

    if (!this.selectedListId) {
      this.toastr.warning("List Id is required", "Warning!");
    }
    else {
      let data = {
        listId: this.selectedListId,
        authToken: this.authToken
      }
      this.appService.deleteList(data).subscribe((apiResponse) => {

        if (apiResponse.status == 200) {
          this.toastr.success("List Deleted", "Success");

          let notifyData = {
            message: `${this.userName} has deleted a List named as ${this.selectedListName}`,
          }
    
          this.notifyUserAboutList(notifyData);

          this.selectedListName = ''
          this.itemsCount = 0;

        }
        else {
          
          this.toastr.error(apiResponse.message, "Error!");
        }
      },
        (error) => {
          if (error.status == 400) {
            this.toastr.warning("Failed to Delete List", "One or more fields are missing");
          }
          else {
            this.toastr.error("Some Error Occurred", "Error!");
            this.router.navigate(['/serverError']);

          }
        });//end calling addMeeting
    }
  }//end deleteListFunction


  /* Item Related Functions */

  public getItemDetailsFunction = (itemId) => {

    //this function will get details of given item. 

    if (itemId != null && this.authToken != null) {
      this.appService.getItemDetails(itemId, this.authToken).subscribe((apiResponse) => {
        if (apiResponse.status == 200) {

          let resultData = {
            action: 'Item Details',
            name: apiResponse.data.itemName,
            creatorName: apiResponse.data.itemCreatorName,
            createdOn: apiResponse.data.itemCreatedOn,
            modifierName: apiResponse.data.itemModifierName,
            modifiedOn: apiResponse.data.itemModifiedOn
          }

          //Open model here with response data
          this.openModel(resultData)

        }
        else {
          this.toastr.info(apiResponse.message, "Update!");
        }
      },
        (error) => {
          if (error.status == 400) {
            this.toastr.warning("Failed to get List Details", "Either user or List not found");

          }
          else {
            this.toastr.error("Some Error Occurred", "Error!");
            this.router.navigate(['/serverError']);

          }
        }//end error
      );//end appservice.getListDetails

    }//end if checking undefined
    else {
      this.toastr.info("Missing Authorization Key", "Please login again");
      this.router.navigate(['/login']);

    }

  }//end getItemDetailsFunction

  public getAllItemFunction = () => {//this function will get all the items of given list. 

    this.allItems = [];

    if (this.selectedListId != null && this.authToken != null) {
      this.appService.getAllItems(this.selectedListId, this.authToken).subscribe((apiResponse) => {
        if (apiResponse.status == 200) {

          this.allItems = apiResponse.data;
          this.itemsCount = this.allItems.length;

          let itemsDone = this.allItems.filter(item => item.itemDone == 'yes');
          this.itemsDoneCount = itemsDone.length
          //console.log(itemsDone.length)

          //this.toastr.info("Lists Updated", `Lists Found!`);
          //console.log(this.allItems)

        }
        else {
          this.toastr.info(apiResponse.message, "Update!");
          this.allItems.length = 0;
          this.itemsCount = 0;
        }
      },
        (error) => {
          if (error.status == 400) {
            this.toastr.warning("Items Failed to Update", "Either user or Item not found");
            this.allItems.length = 0;
            this.itemsCount = 0;

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

  }//end getAllItemFunction


  public addItemFunction(hasValue?: Boolean, gotData?: any): any {

    if (!this.selectedListId) {
      this.toastr.warning("List Id is required", "Warning!");
    }
    else if (!this.itemName) {
      this.toastr.warning("Item Name is required", "Warning!");
    }
    else {

      let data: any = {}
      if (hasValue) {
        data = gotData
      } else {
        data = {
          listId: this.selectedListId,
          itemName: this.itemName,
          itemCreatorId: this.userId,
          itemCreatorName: this.userName,
          itemModifierId: this.userId,
          itemModifierName: this.userName,
        }

      }
      data.authToken = this.authToken


      //console.log(data.listId)


      this.appService.addItem(data).subscribe((apiResponse) => {

        if (apiResponse.status == 200) {
          this.toastr.success("Item Added", "Success");
          //console.log(apiResponse.data)

          let saveItem: any = {
            listId: this.selectedListId,
            key: 'Item Add',
            authToken: this.authToken

          }

          saveItem.itemId = apiResponse.data.itemId;
          this.addHistoryFunction(saveItem)

          this.getAllItemFunction();

          let notifyData = {
            message: `${this.userName} has added a item into list named as ${this.selectedListName}`,
            listId:this.selectedListId
          }
    
          this.notifyUserAboutList(notifyData);

        }
        else {
          this.toastr.error(apiResponse.message, "Error!");
        }
      },
        (error) => {
          if (error.status == 400) {
            this.toastr.warning("Failed to add Item", "One or more fields are missing");
          }
          else {
            this.toastr.error("Some Error Occurred", "Error!");
            this.router.navigate(['/serverError']);

          }
        });//end calling addMeeting


    }
  }//end addItemFunction

  public updateItemFunction(hasValue?: Boolean, gotData?: any, itemId?: any, itemName?: any, itemDone?: any): any {

    let data: any = {}

    if (hasValue) {
      data = gotData
    }
    else {
      data = {
        itemId: itemId,
        itemName: itemName,
        itemModifierId: this.userId,
        itemModifierName: this.userName,
        itemDone: itemDone,
      }

      let saveItem: any = {
        listId: this.selectedListId,
        key: 'Item Update',
        authToken: this.authToken,
        itemId: itemId
      }

      this.addHistoryFunction(saveItem)
    }

    data.authToken = this.authToken

    //console.log(data)
    this.appService.updateItem(data).subscribe((apiResponse) => {

      if (apiResponse.status == 200) {
        this.toastr.success("Item Updated", "Success");
        this.getAllItemFunction();

        let notifyData = {
          message: `${this.userName} has updated a item from list named as ${this.selectedListName}`,
          listId:this.selectedListId

        }
  
        this.notifyUserAboutList(notifyData);

      }
      else {
        this.toastr.error(apiResponse.message, "Error!");
      }
    },
      (error) => {
        if (error.status == 400) {
          this.toastr.warning("Failed to update Item", "One or more fields are missing");
        }
        else {
          this.toastr.error("Some Error Occurred", "Error!");
          this.router.navigate(['/serverError']);

        }
      });//end calling addMeeting

  }//end updateItemFunction

  public deleteItemFunction(itemId, instructionFromHistory?: Boolean): any {

    if (!itemId) {
      this.toastr.warning("Item Id is required", "Warning!");
    }
    else {

      if (!instructionFromHistory) {
        let saveItem: any = {
          listId: this.selectedListId,
          key: 'Item Delete',
          authToken: this.authToken,
          itemId: itemId
        }
        this.addHistoryFunction(saveItem)
      }

      let data = {
        itemId: itemId,
        authToken: this.authToken
      }

      this.appService.deleteItem(data).subscribe((apiResponse) => {

        if (apiResponse.status == 200) {
          this.toastr.success("Item Deleted", "Success");
          this.getAllItemFunction();

          let notifyData = {
            message: `${this.userName} has deleted a item from list named as ${this.selectedListName}`,
            listId:this.selectedListId

          }
    
          this.notifyUserAboutList(notifyData);
        }
        else {
          this.toastr.error(apiResponse.message, "Error!");
        }
      },
        (error) => {
          if (error.status == 400) {
            this.toastr.warning("Failed to Delete Item", "One or more fields are missing");
          }
          else {
            this.toastr.error("Some Error Occurred", "Error!");
            this.router.navigate(['/serverError']);

          }
        });//end calling deleteItem
    }
  }//end deleteItemFunction

  /* Sub item Functions */

  public getSubItemDetailsFunction = (itemId, subItemId) => {

    //this function will get details of given item. 

    if (itemId != null && this.authToken != null && subItemId != null) {

      let data = {
        itemId: itemId,
        subItemId: subItemId,
        authToken: this.authToken

      }

      this.appService.getSubItemDetails(data).subscribe((apiResponse) => {
        if (apiResponse.status == 200) {

          //console.log(apiResponse.data[0].subItems[0])
          let resultData = {
            action: 'Sub Item Details',
            name: apiResponse.data[0].subItems[0].subItemName,
            creatorName: apiResponse.data[0].subItems[0].subItemCreatorName,
            createdOn: apiResponse.data[0].subItems[0].subItemCreatedOn,
            modifierName: apiResponse.data[0].subItems[0].subItemModifierName,
            modifiedOn: apiResponse.data[0].subItems[0].subItemModifiedOn
          }

          //Open model here with response data
          this.openModel(resultData)

        }
        else {
          this.toastr.info(apiResponse.message, "Update!");
        }
      },
        (error) => {
          if (error.status == 400) {
            this.toastr.warning("Failed to get List Details", "Either user or List not found");

          }
          else {
            this.toastr.error("Some Error Occurred", "Error!");
            this.router.navigate(['/serverError']);

          }
        }//end error
      );//end appservice.getListDetails

    }//end if checking undefined
    else {
      this.toastr.info("Missing Authorization Key", "Please login again");
      this.router.navigate(['/login']);

    }

  }//end getSubItemDetailsFunction

  public addSubItemFunction(hasValue?: Boolean, gotData?: any): any {

    let data: any = {}

    if (hasValue) {
      
      data.itemId = this.selectedItemId
      data.subItemId = gotData.subItemId
      data.subItemName= gotData.subItemName
      data.subItemCreatorId= gotData.subItemCreatorId
      data.subItemCreatorName= gotData.subItemCreatorName
      data.subItemModifierId=this.userId
      data.subItemModifierName= this.userName

    }
    else {
      data = {
        itemId: this.selectedItemId,
        subItemName: this.subItemName,
        subItemCreatorId: this.userId,
        subItemCreatorName: this.userName,
        subItemModifierId: this.userId,
        subItemModifierName: this.userName,
      }

    }

    data.authToken = this.authToken

    //console.log(data)

    this.appService.addSubItem(data).subscribe((apiResponse) => {

      if (apiResponse.status == 200) {
        this.toastr.success("Sub Item Added", "Success");

        //console.log(apiResponse.data)
        if (!hasValue) {
          let saveItem: any = {
            listId: this.selectedListId,
            key: 'Sub Item Add',
            authToken: this.authToken,
            itemId: this.selectedItemId,
            subItemId: apiResponse.data.subItemId
          }

          this.addHistoryFunction(saveItem)

        }

        this.getAllItemFunction();

        let notifyData = {
          message: `${this.userName} has added a sub item into list named as ${this.selectedListName}`,
          listId:this.selectedListId

        }
  
        this.notifyUserAboutList(notifyData);

      }
      else {
        this.toastr.error(apiResponse.message, "Error!");
      }
    },
      (error) => {
        if (error.status == 400) {
          this.toastr.warning("Failed to add Sub Item", "One or more fields are missing");
        }
        else {
          this.toastr.error("Some Error Occurred", "Error!");
          this.router.navigate(['/serverError']);

        }
      });//end calling addMeeting
  }//end addSubItemFunction

  public updateSubItemFunction(hasValue?: Boolean, gotData?: any, itemId?: any, subItemId?: any, subItemName?: any, subItemDone?: any): any {

    let data: any = {}
    
    if (hasValue) {
      data.itemId = itemId
      data.subItemId = gotData.subItemId
      data.subItemName = gotData.subItemName
      data.subItemModifierId = this.userId
      data.subItemModifierName =  this.userName
      data.subItemDone = gotData.subItemDone

    }
    else {
      data = {
        itemId: itemId,
        subItemId: subItemId,
        subItemName: subItemName,
        subItemModifierId: this.userId,
        subItemModifierName: this.userName,
        subItemDone: subItemDone,
      }

      let saveItem: any = {
        listId: this.selectedListId,
        key: 'Sub Item Update',
        authToken: this.authToken,
        itemId: this.selectedItemId,
        subItemId: subItemId,
      }

      //console.log(saveItem)

      this.addHistoryFunction(saveItem)

    }
    data.authToken = this.authToken


    //console.log(data)  
    this.appService.updateSubItem(data).subscribe((apiResponse) => {

      if (apiResponse.status == 200) {
        this.toastr.success("Sub Item Updated", "Success");
        this.getAllItemFunction();

        let notifyData = {
          message: `${this.userName} has updated a sub item from list named as ${this.selectedListName}`,
          listId:this.selectedListId

        }
  
        this.notifyUserAboutList(notifyData);

      }
      else {
        this.toastr.error(apiResponse.message, "Error!");
      }
    },
      (error) => {
        if (error.status == 400) {
          this.toastr.warning("Failed to update Item", "One or more fields are missing");
        }
        else {
          this.toastr.error("Some Error Occurred", "Error!");
          this.router.navigate(['/serverError']);

        }
      });//end calling addMeeting
  }//end updateSubItemFunction

  public deleteSubItemFunction(itemId, subItemId, instructionFromHistory?: Boolean): any {

    if (!itemId) {
      this.toastr.warning("Sub Item Id is required", "Warning!");
    }
    else if (!subItemId) {
      this.toastr.warning("Sub Item Id is required", "Warning!");
    }
    else {
      let data = {
        itemId: itemId,
        subItemId: subItemId,
        authToken: this.authToken
      }

      if (!instructionFromHistory) {
        let saveItem: any = {
          listId: this.selectedListId,
          key: 'Sub Item Delete',
          authToken: this.authToken,
          itemId: itemId,
          subItemId: subItemId
        }

        //console.log(saveItem)
        this.addHistoryFunction(saveItem)
      }

      this.appService.deleteSubItem(data).subscribe((apiResponse) => {

        if (apiResponse.status == 200) {
          this.toastr.success("Sub Item Deleted", "Success");
          this.getAllItemFunction();

          let notifyData = {
            message: `${this.userName} has deleted a sub item from list named as ${this.selectedListName}`,
            listId:this.selectedListId

          }
    
          this.notifyUserAboutList(notifyData);

        }
        else {
          this.toastr.error(apiResponse.message, "Error!");
        }
      },
        (error) => {
          if (error.status == 400) {
            this.toastr.warning("Failed to Delete Sub Item", "One or more fields are missing");
          }
          else {
            this.toastr.error("Some Error Occurred", "Error!");
            this.router.navigate(['/serverError']);

          }
        });//end calling addMeeting
    }
  }//end deleteSubItemFunction



  /* History management */

  public addHistoryFunction(data): any {
    this.appService.addHistory(data).subscribe((apiResponse) => {
      if (apiResponse.status == 200) {
        //console.log(apiResponse.data)
      }
    });//end calling addHistory
  }//end addHistoryFunction

  //method to perform undo using shortcut keys
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key == 'z' || event.metaKey && event.key == 'z') {
      if (this.selectedListId) {
        let data = {
          listId: this.selectedListId,
          authToken: this.authToken
        }
        this.getHistoryFunction(data);
      }

    }

  }//end

  public getHistoryFunction(data): any {
    this.appService.getHistory(data).subscribe((apiResponse) => {
      if (apiResponse.status == 200) {
        // if key is 'Item Add' then delete the Item according to time
        if (apiResponse.data.key == 'Item Add') {
          this.deleteItemFunction(apiResponse.data.itemId, true)
        }
        else if (apiResponse.data.key == 'Item Delete') {
          this.addItemFunction(true, apiResponse.data.itemValues[0])
        }
        else if (apiResponse.data.key == 'Item Update') {
          this.updateItemFunction(true, apiResponse.data.itemValues[0])
        }
        else if (apiResponse.data.key == 'Sub Item Add') {
          this.deleteSubItemFunction(apiResponse.data.itemId, apiResponse.data.subItemId, true)
        }
        else if (apiResponse.data.key == 'Sub Item Delete') {
          
          let itemsFromHistory = apiResponse.data.itemValues[0].subItems
          let itemToAdd = itemsFromHistory.filter(item => item.subItemId == apiResponse.data.subItemId);
          this.addSubItemFunction(true, itemToAdd[0])
        }
        else if (apiResponse.data.key == 'Sub Item Update') {
          
          let itemsFromHistory = apiResponse.data.itemValues[0].subItems
          let itemToAdd = itemsFromHistory.filter(item => item.subItemId == apiResponse.data.subItemId);
          this.updateSubItemFunction(true, itemToAdd[0], apiResponse.data.itemId, apiResponse.data.subItemId)
        }


      }
      else if (apiResponse.status == 404) {
        this.toastr.info("No more undos found", "Undo Update!");
      }
    });//end calling getHistory
  }//end getHistoryFunction



  /* Dialog */

  openDialogToAddSubItem(): void {
    const dialogRefAddSubItem = this.dialog.open(DialogBoxComponent, {
      width: '250px',
      data: { title: 'Please Enter Sub Item Name', value: this.enteredSubTaskName }

    });

    dialogRefAddSubItem.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      //console.log(result);      
      this.enteredSubTaskName = result;
      if (this.enteredSubTaskName === null || this.enteredSubTaskName === '' || this.enteredSubTaskName == undefined) {

        this.toastr.error("You must enter a value", "Error!");

      }
      else {

        this.subItemName = this.enteredSubTaskName
        //console.log(this.enteredSubTaskName)
        //console.log(this.selectedItemId)

        this.addSubItemFunction();
        this.enteredSubTaskName = ''

      }

    });
  }

  openDialogToupdateTaskName(itemId, itemName, itemDone): void {
    const dialogRefAddSubItem = this.dialog.open(DialogBoxComponent, {
      width: '250px',
      data: { title: 'Please Edit Task Name', value: itemName }

    });

    dialogRefAddSubItem.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      //console.log(result);      
      this.enteredTaskName = result;
      if (this.enteredTaskName === null || this.enteredTaskName === '' || this.enteredTaskName == undefined) {

        this.toastr.error("You must enter a value", "Error!");

      }
      else {

        this.updateItemFunction(false, null, itemId, this.enteredTaskName, itemDone);
        this.enteredTaskName = ''

      }

    });
  }

  openDialogToupdateSubTaskName(itemId, subItemId, subItemName, subItemDone): void {

    const dialogRefAddSubItem = this.dialog.open(DialogBoxComponent, {
      width: '250px',
      data: { title: 'Please Edit Sub Task Name', value: subItemName }

    });

    dialogRefAddSubItem.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      //console.log(result);      
      this.enteredSubTaskName = result;
      if (this.enteredSubTaskName === null || this.enteredSubTaskName === '' || this.enteredSubTaskName == undefined) {

        this.toastr.error("You must enter a value", "Error!");

      }
      else {

        this.updateSubItemFunction(false,null,itemId, subItemId, this.enteredSubTaskName, subItemDone);
        this.enteredSubTaskName = ''

      }

    });
  }

  //* Sockets functions *//

  /* Listened Events */

  public getUpdatesFromUser = () => {

    this.socketService.getUpdatesFromUser(this.userId).subscribe((data) => {
      //getting message from user.
      //console.log(data)
      if(data.listId != undefined && data.listId == this.selectedListId)
        this.getAllItemFunction()
        
    });
  }//end getUpdatesFromUser
}
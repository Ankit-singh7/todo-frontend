
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';


import { FirstCharComponent } from './first-char/first-char.component';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';

/* Module for Toaster */
import { ToastrModule } from 'ngx-toastr';


import {MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatRadioModule,
  MatButtonModule,
  MatCheckboxModule,
  MatTooltipModule,
  MatSidenavModule,
  MatMenuModule,  
  MatListModule,
  MatDialogModule,
} from '@angular/material';

import { ListComponent } from './list/list.component';
import { OwnNavbarComponent } from './own-navbar/own-navbar.component';
import { FriendListComponent } from './friend-list/friend-list.component';

import {  NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSidenavModule,
    MatMenuModule,
    MatListModule,
    MatDialogModule,

    NgbModalModule.forRoot(),
    
    ReactiveFormsModule,
    RouterModule,


    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),

  ],

  declarations: [ FirstCharComponent,
                  DialogBoxComponent,
                  ListComponent,
                  OwnNavbarComponent,
                  FriendListComponent],

  exports: [
    FirstCharComponent,
    DialogBoxComponent,
    ListComponent,
    OwnNavbarComponent,
    FriendListComponent,
    CommonModule,
    FormsModule
  ],

  entryComponents: [
    DialogBoxComponent
  ],

})
export class SharedModule { }
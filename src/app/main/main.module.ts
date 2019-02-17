import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule ,Routes } from '@angular/router';

import { SingleUserComponent } from './single-user/single-user.component';
import { MultiUserComponent } from './multi-user/multi-user.component';
import { FriendsListComponent } from './friends-list/friends-list.component';
import { SharedModule } from '../shared/shared.module';
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
  MatTabsModule
} from '@angular/material';

import { DialogBoxComponent } from '../shared/dialog-box/dialog-box.component';





@NgModule({
  
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatTabsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    RouterModule.forChild([

      { path: 'multi-user', component: MultiUserComponent },
      { path: 'single-user', component: SingleUserComponent },
      {path: 'friend-list', component:FriendsListComponent}


    ])


  ],
  entryComponents: [
    DialogBoxComponent
  ],
  declarations: [SingleUserComponent, MultiUserComponent,FriendsListComponent]
})
export class MainModule { }

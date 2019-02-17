import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';

import { UserModule } from './user/user.module';

import { NotFoundComponent } from './not-found/not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';


//import this module for using toastr
import { ToastrModule } from 'ngx-toastr';
import { AppService } from './app.service';
import { StartPageComponent } from './start-page/start-page.component';



@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent, 
    ServerErrorComponent,
     StartPageComponent, 
    
    
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UserModule,
  
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 7000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
   


  ],
  providers: [ AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }

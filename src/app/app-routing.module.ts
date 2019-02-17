import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import { Routes, RouterModule } from '@angular/router';

import { NotFoundComponent } from './not-found/not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { StartPageComponent } from './start-page/start-page.component';


import { UserModule } from './user/user.module';
import { MainModule } from './main/main.module';




const routes: Routes = [

  
    {path:'',redirectTo:'Intro',pathMatch:'full'},
    {path:'Intro',component:StartPageComponent},
    {path:'serverError',component:ServerErrorComponent},
    {path :'*',component:NotFoundComponent},
    {path :'**',component:NotFoundComponent},
  


]; 

@NgModule({
  imports: [
    CommonModule,
    UserModule,
    MainModule,
    RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { RouterModule ,Routes } from '@angular/router';



import { RegisterComponent } from './register/register.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ResetPassComponent } from './reset-pass/reset-pass.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from '../app.component';
import { LoginComponent } from './login/login.component';
import { SortCountriesPipe } from '../sort-countries.pipe';
import { MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatRadioModule, MatButtonModule, MatCheckboxModule, MatTooltipModule } from '@angular/material';

@NgModule({
  declarations: [

    RegisterComponent,
    ForgotPassComponent,
    VerifyEmailComponent,
    ResetPassComponent ,
    LoginComponent,
    SortCountriesPipe

  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    FormsModule,
    HttpClientModule,
  
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    RouterModule.forChild([ 
      {path:'login',component:LoginComponent},
      { path: 'register', component: RegisterComponent },
      { path: 'forgot-pass', component: ForgotPassComponent },
      { path: 'VerifyEmail/:userId', component: VerifyEmailComponent },
      { path: 'Reset-Pass/:validationToken', component: ResetPassComponent}
     

    ])
    
  ],
  exports:[
    RouterModule
  ],
  providers:[SortCountriesPipe]

})
export class UserModule { }

import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


import { AppService } from '../../app.service';
import { ToastrService } from 'ngx-toastr';



import { Cookie } from 'ng2-cookies/ng2-cookies';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public email:any;
  public password:any;
  public passwordType:string ='password';
  public passwordShown:boolean=false;


  

  constructor(
    public appService: AppService,
    public _route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService,

  ) { }

  public togglePassword(){

    if(this.passwordShown){

      this.passwordShown=false;
      this.passwordType='password';
     
    }
    else{
      this.passwordShown=true;
      this.passwordType="text";
    

    }
  }



 
  public signInFunction(): any {

    if (!this.email) {
      this.toastr.warning("Email is required", "Warning!");
    }
  
    else if (!this.password) {
      this.toastr.warning("Password is required", "Warning!");
    }
    else {
      let data = {
        email: this.email,
        password: this.password
      }

      //console.log(data)  
      this.appService.signIn(data).subscribe((apiResponse) => {

          if (apiResponse.status == 200) {
            this.toastr.success("Login Successfull", "Welcome to Trego");
            //console.log(apiResponse.data)
            
            Cookie.set('authToken', apiResponse.data.authToken);
            Cookie.set('userId', apiResponse.data.userDetails.userId);
            Cookie.set('userName', `${apiResponse.data.userDetails.firstName} ${apiResponse.data.userDetails.lastName}`);
            this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails);

            setTimeout(() => {
              this.router.navigate(['/single-user']);//redirects the single user platform.
            }, 1000);
  
          }
          else {
            this.toastr.error(apiResponse.message, "Error!");
          }
        },
          (error) => {
            
            if(error.status == 404){
              this.toastr.warning("Login Failed", "User Not Found or Email is not verified!");
            }
            else if(error.status == 400){
              this.toastr.warning("Login Failed", "Wrong Password");
            }
            else{
              this.toastr.error("Some Error Occurred", "Error!");
              this.router.navigate(['/serverError']);
  
            }
              
          });//end calling SignInFunction
    }
  }//end signInFunction

  public loginUsingKeypress: any = (event: any) => {

    if (event.keyCode === 13) { 
      // 13 is keycode of enter.
      this.signInFunction();
    }

  } // end loginUsingKeypress

  ngOnInit() {

    


}
}
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


import { AppService } from '../../app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.css']
})
export class ForgotPassComponent implements OnInit {

  public email:any;

  constructor(
    public appService: AppService,
    public _route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService,

  ) { }

  ngOnInit() {
  }

 
  public forgotPasswordFunction(): any {

    if (!this.email) {
      this.toastr.warning("Email is required", "Warning!");
    }
   
    else {
      let data = {
        email: this.email,
      }

      //console.log(data)  
      this.appService.resetPassword(data).subscribe((apiResponse) => {

          if (apiResponse.status == 200) {
            this.toastr.success("Reset Password", "Password reset instructions sent successfully");

          }
          else {
            this.toastr.error(apiResponse.message, "Error!");
          }
        },
          (error) => {
            if(error.status == 404){
              this.toastr.warning("Reset Password Failed", "Email Not Found!");
            }
            else{
              this.toastr.error("Some Error Occurred", "Error!");
              this.router.navigate(['/serverError']);
  
            }
              
          });//end calling resetPassword
    }
  }//end forgotPasswordFunction

}
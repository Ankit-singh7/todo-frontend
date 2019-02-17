import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

//import for toastr
import { ToastrService } from 'ngx-toastr';
//for Service
import { AppService } from '../../app.service';
//for routing
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.css']
})
export class ResetPassComponent implements OnInit {
  public validationToken: any;
  public password: any;
  public confirmPassword: any;

  constructor(
    public appService: AppService,
    public _route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService

  ) { }

  ngOnInit() {
    this.validationToken = this._route.snapshot.paramMap.get('validationToken');

  }

  public goToSignIn(): any {
    this.router.navigate(['/login']);
  }//end of goToSign function

  public updatePasswordFunction(): any {
    if (this.password != this.confirmPassword) {
      this.toastr.warning("Password doesn't match", "Warning!");
    }
    else {
      let data = {
        validationToken: this.validationToken,
        password: this.password,
      }

      this.appService.updatePassword(data).subscribe((apiResponse) => {

        if (apiResponse.status == 200) {
          this.toastr.success("Please login", "Password Updated!");
          setTimeout(() => {
            this.goToSignIn();
          }, 1000);//redirecting to signIn page

        }
        else {
          this.toastr.error(apiResponse.message, "Error!");
        }
      },
        (error) => {
          if (error.status == 404) {
            this.toastr.warning("Password Update failed", "Please request another password reset!");
          }
          else {
            this.toastr.error("Some Error Occurred", "Error!");
            this.router.navigate(['/serverError']);

          }

        });//end calling updatePassword

    }

  }//end updatePasswordFunction

}
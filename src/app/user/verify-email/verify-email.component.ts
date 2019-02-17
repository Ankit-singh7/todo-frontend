import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../app.service';


@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  public userId:string;
  public message: string;

  constructor(
    public appService: AppService,
    public _route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService

  ) { }

  ngOnInit() {
    this.userId = this._route.snapshot.paramMap.get('userId');
    this.verifyEmailFunction()
  }

  public verifyEmailFunction(): any {

      this.appService.verifyEmail(this.userId).subscribe((apiResponse) => {

          if (apiResponse.status == 200) {
            this.toastr.success("Please login", "Email Verified!");
            this.message = "Your account has been activated. You can login now"
          }
          else {
            this.toastr.error(apiResponse.message, "Error!");

          }
        },
          (error) => {
            if(error.status == 404){
              this.toastr.warning("Email Verification failed", "User Not Found!");
              this.message = "Email Verification failed"

            }
            else{
              this.toastr.error("Some Error Occurred", "Error!");
              this.router.navigate(['/serverError']);
  
            }
              
          });//end calling verifyEmail
    
  }//end verifyEmailFunction

}
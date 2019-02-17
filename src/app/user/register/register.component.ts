import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { AppService } from '../../app.service';
//import for toastr
import { ToastrService } from 'ngx-toastr';
//import for Routing
import { ActivatedRoute, Router } from '@angular/router';
import { SortCountriesPipe } from '../../sort-countries.pipe';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  
  public email:any;
  public firstName: any;
  public lastName: any;
  public password: any;
  public confirmPassword:any;
  public mobileNumber: any;
  public country: any ="";
  public countryList:any;
  public finalCountryList:any=[];
  public codeList:any=[];
  public code:any;


  constructor(
    public appService: AppService,
    public _route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService,
    public sortCountries : SortCountriesPipe,
 

  ) { }

  ngOnInit() {
   
  
      
  this.appService.getCountryList().subscribe(
    Response=>{
       this.countryList=Response;
       for (var prop in this.countryList) {
        this.finalCountryList.push({
          'key': prop,
          'value': this.countryList[prop]
      });

       }
      this.finalCountryList=this.sortCountries.transform(this.finalCountryList);
     
    }
  )

  }

  
  public onChange=()=>{  
    this.appService.getCountryCode().subscribe(
      Response=>{
        this.codeList=Response;
       
        this.code=this.codeList[this.country];
  
      }
    )
  }//end

  public goToSignIn(): any {
    this.router.navigate(['/login']);
  }//end of goToSign function

  public signupFunction(): any {

    if (!this.firstName) {
      this.toastr.warning("First Name is required", "Warning!");
    }
    else if (!this.lastName) {
      this.toastr.warning("Last Name is required", "Warning!");
    }
    else if (!this.mobileNumber) {
      this.toastr.warning("Mobile Number is required", "Warning!");
    }
    else if (!this.country) {
      this.toastr.warning("Country is required", "Warning!");
    }
    else if (!this.email) {
      this.toastr.warning("Email is required", "Warning!");
    }
    else if (!this.password) {
      this.toastr.warning("Password is required", "Warning!");
    }
   
    else {      
      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        mobileNumber: `+${this.code}-${this.mobileNumber}`,
        email: this.email,
        password: this.password,
        countryName: this.country,
      }

      //console.log(data)  
      this.appService.signUp(data)
        .subscribe((apiResponse) => {

          if (apiResponse.status == 200) {
            this.toastr.success("Please check your email", "Registered with Lets Meet");
            setTimeout(() => {
              this.goToSignIn();
            }, 1000);//redirecting to signIn page

          }
          else {
            this.toastr.error(apiResponse.message, "Error!");
          }
        },
          (error) => {
            this.toastr.error("Some Error Occurred", "Error!");
            this.router.navigate(['/serverError']);
          });//end calling signUpFunction
    }
  }//end signUp function


}
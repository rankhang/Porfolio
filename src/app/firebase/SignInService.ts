import { FormGroup } from "@angular/forms";
import { AuthService } from "../auth.service";
import { MatDialog } from "@angular/material/dialog";
import { ErrorMessageModalComponent } from "../error-message-modal/error-message-modal.component";
import { Router } from "@angular/router";
import { Name } from "../name";



export class SignInService{
    static errorMessage: string= "";
    static errorCode: string = "";
    static solutionText: string = "";

    static async signIn(form: FormGroup, signInForm: FormGroup, authService: AuthService, dialogRef: MatDialog, route: Router, appNameString:string){
        if(signInForm.valid){
      
            this.errorMessage = await authService.signIn(form);
            
            
            
            if(this.errorMessage == "Logged In Success"){
              
                if(appNameString === Name.CRYPTOCURRENCYGAME){
                    route.navigate(['appsList/cryptoCurrencyGame/home'])
                }else if(appNameString === Name.KATBOOK){
                    route.navigate(['appsList/katbook/home'])
                }
              
            }else{
              if(this.errorMessage =="Firebase: Error (auth/wrong-password)."){
                this.errorMessage = "You've entered wrong email or password"
                this.solutionText = "Please try again";
              }else if(this.errorMessage =="Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests)."){
                this.errorMessage = "Access to this account has been temporarily disabled due to many failed login attempts"
                this.solutionText = "Please try again later";
              }else if(this.errorMessage =="Firebase: Error (auth/user-not-found)."){
                this.errorMessage = "Not found profile"
                this.solutionText = "Please create an account before using";
              }
              dialogRef.open(ErrorMessageModalComponent,{
                data: {
                  errorCode: "Login Failed",
                  errorMessage: this.errorMessage,
                  errorSolution: this.solutionText
                }
              });
              
            }
        }
    }
}
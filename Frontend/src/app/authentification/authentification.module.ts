import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";

@NgModule({
    declarations: [LoginComponent, SignupComponent],

    imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule],
    entryComponents: [SignupComponent],
})
export class AuthentificationModule {}

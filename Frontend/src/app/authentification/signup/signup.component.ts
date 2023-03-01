import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "src/app/services/auth.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { catchError, EMPTY, switchMap, tap } from "rxjs";
import { validityForm } from "../validityForm.service";

@Component({
    selector: "app-signup",
    templateUrl: "./signup.component.html",
    styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
    signupForm!: FormGroup;
    errorMsg!: string;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private dialog: MatDialog,
        private authService: AuthService,
        private validator: validityForm
    ) {}
    ngOnInit(): void {
        this.signupForm = this.formBuilder.group(
            {
                emailSignup: [null, [Validators.required, this.validator.emailValidator()]],
                firstname: ["", [Validators.required, this.validator.onlyTextValidator()]],
                lastname: [null, [Validators.required, this.validator.onlyTextValidator()]],
                password: [
                    "",
                    [
                        Validators.required,
                        Validators.minLength(8),
                        this.validator.createPasswordStrengthValidator(),
                    ],
                ],
                passwordControl: [null, [Validators.required]],
            },
            {
                validator: this.validator.passwordMatchValidator("password", "passwordControl"),
            }
        );
    }

    onSubmit() {
        const email = this.signupForm.get("emailSignup")!.value;
        const password = this.signupForm.get("password")!.value;
        const lastname = this.signupForm.get("lastname")!.value;
        const firstname = this.signupForm.get("firstname")!.value;
        this.authService
            .createUser(email, password, lastname, firstname)
            .pipe(
                switchMap(() => this.authService.loginUser(email, password)),

                tap(() => {
                    this.router.navigate(["/get-started"]);
                    this.closeTab();
                }),
                catchError((error) => {
                    this.errorMsg = error.error.error;
                    return EMPTY;
                })
            )
            .subscribe();
    }

    onClose() {
        this.dialog.closeAll();
    }

    closeTab() {
        this.onClose();
    }

    get password() {
        return this.signupForm.controls["password"];
    }

    get firstname() {
        return this.signupForm.controls["firstname"];
    }

    get emailSignup() {
        return this.signupForm.controls["emailSignup"];
    }

    get lastname() {
        return this.signupForm.controls["lastname"];
    }

    get passwordControl() {
        return this.signupForm.controls["passwordControl"];
    }
}

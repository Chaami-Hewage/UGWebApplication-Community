import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { SignupComponent } from "../signup/signup.component";
import { AuthService } from "src/app/services/auth.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { catchError, EMPTY, tap } from "rxjs";
import { UserService } from "src/app/services/user.service";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    errorMsg!: string;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private dialog: MatDialog,
        private authService: AuthService,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            email: ["", { Validators: [Validators.required, Validators.email], updateOn: "blur" }],
            password: ["", [Validators.required]],
        });
    }

    onSubmit() {
        const email = this.loginForm.get("email")!.value;
        const password = this.loginForm.get("password")!.value;

        this.authService
            .loginUser(email, password)
            .pipe(
                tap(() => {
                    const id = this.authService.getUserId();

                    this.userService.getUserById(id);
                    this.router.navigate(["/home"]);
                }),
                catchError((error) => {
                    this.errorMsg = error.error.error;
                    return EMPTY;
                })
            )
            .subscribe();
    }

    onCreate() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "600px";
        dialogConfig.maxWidth = "80%";
        this.dialog.open(SignupComponent, dialogConfig);
    }
}

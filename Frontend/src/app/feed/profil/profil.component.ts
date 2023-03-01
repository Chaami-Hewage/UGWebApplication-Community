import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { catchError, EMPTY, Observable, tap } from "rxjs";
import { validityForm } from "src/app/authentification/validityForm.service";
import { AuthService } from "src/app/services/auth.service";
import { UserService } from "src/app/services/user.service";
import { User } from "src/models/User.model";

@Component({
    selector: "app-profil",
    templateUrl: "./profil.component.html",
    styleUrls: ["./profil.component.scss"],
})
export class ProfilComponent implements OnInit {
    profilForm!: FormGroup;
    passwordForm!: FormGroup;

    errorMsg!: string;
    url: string;

    selectedFile: HTMLInputElement | undefined;
    userId: string;
    user: User;
    user$!: Observable<User>;
    
    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private router: Router,
        private authService: AuthService,
        private dialog: MatDialog,
        private validator: validityForm
    ) {}

    ngOnInit(): void {
        this.userId = this.authService.getUserId();
        this.userService.user$
            .pipe(
                tap((user) => {
                    this.user = user;
                    this.url = this.user.imgUser;
                })
            )
            .subscribe();
        this.profilForm = this.formBuilder.group({
            firstname: [this.user.firstname],
            lastname: [this.user.lastname],
        });

        this.passwordForm = this.formBuilder.group(
            {
                oldpassword: [null, [Validators.required]],
                confirmNewpassword: [null, [Validators.required]],
                newpassword: [
                    null,
                    [
                        Validators.required,
                        Validators.minLength(8),
                        this.validator.createPasswordStrengthValidator(),
                    ],
                ],
            },
            {
                validator: this.validator.passwordMatchValidator("newpassword", "confirmNewpassword"),
            }
        );
    }

    get firstname() {
        return this.profilForm.controls["firstname"];
    }

    get lastname() {
        return this.profilForm.controls["lastname"];
    }

    get oldpassword() {
        return this.passwordForm.controls["oldpassword"];
    }

    get newpassword() {
        return this.passwordForm.controls["newpassword"];
    }

    get confirmNewpassword() {
        return this.passwordForm.controls["confirmNewpassword"];
    }

    onselectFile(event: any) {
        this.selectedFile = event.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: any) => {
            this.url = event.target.result;
        };
    }
    deleteUser() {
        this.userService
            .deleteUser(this.userId)
            .pipe(
                tap(() => {
                    this.router.navigate(["/login"]);
                    this.closeTab();
                }),
                catchError((error) => {
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

    onSubmit() {
        const oldPassword = this.passwordForm.get("oldpassword")!.value;
        const newPassword = this.passwordForm.get("newpassword")!.value;

        this.userService
            .updatePassword(this.userId, oldPassword, newPassword)
            .pipe(
                tap(() => {
                    this.router.navigate(["/login"]);
                    this.closeTab();
                }),
                catchError((error) => {
                    this.errorMsg = error.error.message;
                    return EMPTY;
                })
            )
            .subscribe();
    }

    saveProfil() {
        const firstname = this.profilForm.get("firstname")!.value || this.user.firstname;
        const lastname = this.profilForm.get("lastname")!.value || this.user.lastname;

        let imgProfil;
        this.selectedFile ? (imgProfil = this.selectedFile) : (imgProfil = this.url);

        this.userService
            .updateUser(this.userId, imgProfil, firstname, lastname)
            .pipe(
                tap(() => {
                    this.userService.getUserById(this.userId);

                    this.router.navigateByUrl("", { skipLocationChange: true }).then(() => {
                        this.router.navigate(["/accueil/feed"]);
                    });
                    this.closeTab();
                }),
                catchError((error) => {
                    this.errorMsg = error.error.message;
                    return EMPTY;
                })
            )
            .subscribe();
    }
}

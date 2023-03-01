import { Component,OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { catchError, EMPTY,tap, } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { ThemeService } from "src/app/services/theme.service";
import { UserService } from "src/app/services/user.service";
import { User } from "src/models/User.model";
import { ProfilComponent } from "../profil/profil.component";


@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
    user: User | undefined;
    dark: boolean;
    light: boolean;

    constructor(
        private router: Router,
        private userService: UserService,
        private authService: AuthService,
        private dialog: MatDialog,
        private themeService: ThemeService,
    ) {}

    ngOnInit(): void {
        this.dark = false;
        this.userService.user$
            .pipe(
                tap((user) => {
                    this.user = user;
                })
            )
            .subscribe();
    }

    logOut() {
        this.authService
            .logout()
            .pipe(
                tap(() => {
                    this.router.navigate(["/login"]);
                }),
                catchError((error) => {
                    return EMPTY;
                })
            )
            .subscribe();
    }
 
    displayProfil() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "600px";
        dialogConfig.height = "600px";
        dialogConfig.maxWidth = "80%";
        this.dialog.open(ProfilComponent, dialogConfig);
    }
    toggleDarkTheme(): void {
        if (this.themeService.isDarkTheme()) {
            this.themeService.setLightTheme();
            this.light = true;
            this.dark = false;
        } else {
            this.themeService.setDarkTheme();
            this.light = false;
            this.dark = true;
        }
    }
}

import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { tap } from "rxjs";
import { UserService } from "src/app/services/user.service";
import { User } from "src/models/User.model";

@Component({
    selector: "app-feed",
    template: ` <app-create-post></app-create-post> `,
    styles: [],
})
export class FeedComponent implements OnInit {
    user: User | undefined;
    constructor(private userService: UserService, private authService: AuthService) {}

    ngOnInit(): void {
        const id = this.authService.getUserId();
        this.userService.getUserById(id);
        this.userService.user$
            .pipe(
                tap((user) => {
                    this.user = user;
                })
            )
            .subscribe();
    }
}

import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { UserService } from "src/app/services/user.service";
import { User } from "src/models/User.model";

@Component({
    selector: "app-users",
    templateUrl: "./users.component.html",
    styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit {
    filteredString: string = "";
    users: [User];
    constructor(private router: Router, private userService: UserService, private authService: AuthService) {}

    ngOnInit(): void {
        this.userService.getAllUser().subscribe((users) => (this.users = users));
    }
}

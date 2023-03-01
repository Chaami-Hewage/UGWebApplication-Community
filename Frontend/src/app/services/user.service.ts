import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, tap } from "rxjs";
import { User } from "src/models/User.model";
import { environment } from "src/environments/environment";
@Injectable({
    providedIn: "root",
})
export class UserService {
    user$ = new BehaviorSubject<any>([]);
    private backendServer = environment.backendServer;
    constructor(private http: HttpClient) {}

    getUserById(id: string) {
        this.http
            .get<User>(this.backendServer + "/api/user/" + id)
            .pipe(
                tap((user) => {
                    this.user$.next(user);
                })
            )
            .subscribe();
    }

    updateUser(id: string, image: any, firstname: string, lastname: string) {
        const formData = new FormData();
        const user = { lastname: lastname, firstname: firstname };
        formData.append("user", JSON.stringify(user));
        formData.append("image", image);
        return this.http.put<{ message: string }>(this.backendServer + "/api/user/" + id, formData);
    }

    updatePassword(id: string, oldpassword: string, newpassword: string) {
        return this.http.put<{ message: string }>(this.backendServer + "/api/user/password/" + id, {
            oldpassword: oldpassword,
            newpassword: newpassword,
        });
    }
    getAllUser() {
        return this.http.get<[User]>(this.backendServer + "/api/user");
    }

    deleteUser(id: string) {
        return this.http.delete<{ message: string }>(this.backendServer + "/api/user/" + id);
    }
}

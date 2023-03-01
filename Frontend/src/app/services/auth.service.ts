import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from "rxjs";

import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    isLoggedIn: boolean = false;
    private access_token = "";
    private userId = "";
    private backendServer = environment.backendServer;

    constructor(private http: HttpClient) {}

    createUser(email: string, password: string, lastname: string, firstname: string) {
        return this.http.post<{ message: string }>(this.backendServer + "/api/auth/signup", {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
        });
    }

    loginUser(email: string, password: string) {
        return this.http
            .post<{
                userId: string;
                access_token: string;
                token_type: string;
                expires_in: string;
            }>(this.backendServer + "/api/auth/login", {
                email: email,
                password: password,
            })
            .pipe(
                tap(({ userId, access_token }) => {
                    this.userId = userId;
                    this.access_token = access_token;
                    this.isLoggedIn = true;
                })
            );
    }

    getToken() {
        return this.access_token;
    }

    getUserId() {
        return this.userId;
    }

    logout() {
        return this.http
            .post<{ message: string }>(this.backendServer + "/api/auth/logout", this.access_token)
            .pipe(
                tap(() => {
                    this.isLoggedIn = false;
                    this.access_token = "";
                    this.userId = "";
                })
            );
    }
}

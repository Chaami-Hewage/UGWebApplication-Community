import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Category } from "src/models/Category.model";
import { BehaviorSubject, tap } from "rxjs";
import { environment } from "src/environments/environment";
@Injectable({
    providedIn: "root",
})
export class CategoriesService {
    categories$ = new BehaviorSubject<any>([]);
    private backendServer = environment.backendServer;

    constructor(private http: HttpClient) {}

    getAllCategories() {
        this.http
            .get<[Category]>(this.backendServer + "/api/categories")
            .pipe(
                tap((categorie) => {
                    this.categories$.next(categorie);
                })
            )
            .subscribe();
    }

    createCategories(name: string, slug: string) {
        return this.http.post<{ message: string }>(this.backendServer + "/api/categories", {
            name,
            slug,
        });
    }
}

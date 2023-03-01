import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CategoriesService } from "src/app/services/categories.service";
import { catchError, EMPTY, tap } from "rxjs";
import { Category } from "src/models/Category.model";
import { Router } from "@angular/router";

@Component({
    selector: "app-insert-category",
    templateUrl: "./insert-category.html",
    styleUrls: ["./insert-category.scss"],
})
export class InsertCategoryComponent implements OnInit {
    categories: [Category];
    categoryForm!: FormGroup;
    errorMsg: string;

    constructor(
        private formBuilder: FormBuilder,
        private categorieService: CategoriesService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.categoryForm = this.formBuilder.group({
            name: [null, [Validators.required, Validators.maxLength(10)]],
            slug: [null, [Validators.required]],
        });

        this.categorieService.categories$
            .pipe(
                tap((categorie) => {
                    this.categories = categorie;
                })
            )
            .subscribe();
    }

    createCategories() {
        const name = this.categoryForm.get("name")!.value;
        const slug = this.categoryForm.get("slug")!.value;

        this.categorieService
            .createCategories(name, slug)
            .pipe(
                catchError((error) => {
                    this.errorMsg = error.error.error;
                    return EMPTY;
                })
            )
            .subscribe(() => {
                this.router
                    .navigateByUrl("/", { skipLocationChange: true })
                    .then(() => this.router.navigate(["/accueil/feed"]));
            });
    }

    get name() {
        return this.categoryForm.controls["name"];
    }

    get slug() {
        return this.categoryForm.controls["slug"];
    }
}

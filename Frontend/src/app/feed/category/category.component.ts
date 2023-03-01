import { Component, OnInit } from "@angular/core";
import { Category } from "src/models/Category.model";
import { CategoriesService } from "../../services/categories.service";
import { catchError, EMPTY, tap } from "rxjs";
import { ToggleService } from "src/app/services/toggle.service";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";

@Component({
    selector: "app-category",
    templateUrl: "./category.component.html",
    styleUrls: ["./category.component.scss"],
})
export class CategoryComponent implements OnInit {
    categories: [Category];
    isMenuOpen: boolean = false;

    constructor(
        private categorieService: CategoriesService,
        private toggleService: ToggleService,
        public breakpointObserver: BreakpointObserver
    ) {}
    ngOnChanges() {
        this.toggleService.$toggle.subscribe((val: any) => {
            this.isMenuOpen = val;
        });
    }
    ngOnInit(): void {
        this.categorieService.getAllCategories();

        this.categorieService.categories$
            .pipe(
                tap((categories) => {
                    this.categories = categories;
                }),
                catchError((error) => {
                    return EMPTY;
                })
            )
            .subscribe();

        this.toggleService.$toggle.subscribe((val: any) => {
            this.isMenuOpen = val;
        });

        this.breakpointObserver
            .observe(["(min-width: 424px)"])

            .subscribe((state: BreakpointState) => {
                if (state.matches) {
                    this.toggleService.setToggle(false);
                }
            });
    }

    toggleBox(): void {
        this.isMenuOpen = !this.isMenuOpen;
        this.toggleService.setToggle(this.isMenuOpen);
    }

    clickedOutside() {
        this.isMenuOpen = false;
        this.toggleService.setToggle(this.isMenuOpen);
    }
}

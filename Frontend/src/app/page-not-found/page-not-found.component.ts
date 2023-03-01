import { Component, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { DOCUMENT } from "@angular/common";
@Component({
    selector: "app-page-not-found",
    templateUrl: "./page-not-found.component.html",
    styleUrls: ["./page-not-found.component.scss"],
})
export class PageNotFoundComponent {
    constructor(@Inject(DOCUMENT) private _document: any, private router: Router) {}

    ngOnInit(): void {
        this._document.body.classList.add("bodybg-color");
    }

    ngOnDestroy(): void {
        this._document.body.classList.add("bodybg-color");
    }

    redirect() {
        this.router.navigate(["/login"]);
    }
}

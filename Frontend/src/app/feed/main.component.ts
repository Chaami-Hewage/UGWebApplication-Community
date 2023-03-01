import { Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";

import { DOCUMENT } from "@angular/common";
import { fromEvent, map, take } from "rxjs";
import { ToggleService } from "../services/toggle.service";
import { BreakpointObserver, Breakpoints, BreakpointState } from "@angular/cdk/layout";

@Component({
    selector: "app-feed",
    templateUrl: "./main.component.html",
    styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
    @ViewChild("scrolltop") scrollTop: ElementRef;
    isMenuOpen: boolean;

    constructor(
        @Inject(DOCUMENT) private _document: any,
        private toggleService: ToggleService,
        public breakpointObserver: BreakpointObserver,
        private el: ElementRef
    ) {}

    ngOnInit(): void {
        const scroll$ = fromEvent(window, "scroll").pipe(
            map((event) => {
                return window.document.documentElement.scrollTop;
            })
        );

        scroll$.subscribe((event) => {
            if (event > 500) {
                this.scrollTop.nativeElement.classList.remove("hidden");
            } else {
                this.scrollTop.nativeElement.classList.add("hidden");
            }
        });
        this._document.body.classList.remove("bodybg-color");
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

    topPage() {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    }

    // clickedOutside() {
    //     console.log("salut");

    //     this.isMenuOpen = false;
    //     this.toggleService.setToggle(this.isMenuOpen);
    // }
}

import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class ToggleService {
    private toggle = new Subject<boolean>();
    public $toggle = this.toggle.asObservable();

    setToggle(val: boolean) {
        this.toggle.next(val);
    }
}

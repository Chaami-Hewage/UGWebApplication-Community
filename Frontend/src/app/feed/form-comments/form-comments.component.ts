import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { catchError, EMPTY, tap } from "rxjs";
import { ContentService } from "src/app/services/content.service";
import { UserService } from "src/app/services/user.service";
import { User } from "src/models/User.model";

@Component({
    selector: "app-form-comments",
    templateUrl: "./form-comments.component.html",
    styleUrls: ["./form-comments.component.scss"],
    encapsulation: ViewEncapsulation.ShadowDom,
})
export class FormCommentsComponent implements OnInit {
    @Output() display: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() threadId: any;
    @Input() comment$: any;

    commentForm!: FormGroup;

    urlCommentFile: string;
    commentFile: HTMLInputElement | undefined;
    user: User | undefined;

    constructor(
        private formBuilder: FormBuilder,
        private contentService: ContentService,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.userService.user$
            .pipe(
                tap((user) => {
                    this.user = user;
                })
            )
            .subscribe();
        //------------------------------
        this.commentForm = this.formBuilder.group({
            content: [""],
        });
        this.urlCommentFile = "";
    }

    selectFile($event: any) {
        this.commentFile = $event.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL($event.target.files[0]);
        reader.onload = (event: any) => {
            this.urlCommentFile = event.target.result;
        };
    }
    cancel() {
        this.urlCommentFile = "";
        this.commentFile = undefined;
        this.commentForm.controls["content"].setValue("");
    }

    onSubmit(value: any) {
        const content = this.commentForm.get("content")!.value;
        this.contentService
            .createComment(value, this.commentFile || content)
            .pipe(
                catchError((error) => {
                    this.urlCommentFile = "";
                    this.commentFile = undefined;
                    this.commentForm.controls["content"].setValue("");
                    console.error(error);
                    return EMPTY;
                })
            )
            .subscribe((data) => {
                this.urlCommentFile = "";
                this.commentFile = undefined;
                this.commentForm.controls["content"].setValue("");
                this.display.emit(true);
            });
    }
}

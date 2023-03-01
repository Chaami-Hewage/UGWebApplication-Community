import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { catchError, distinctUntilChanged, EMPTY, tap } from "rxjs";
import { CategoriesService } from "src/app/services/categories.service";
import { ContentService } from "src/app/services/content.service";
import { Category } from "src/models/Category.model";

@Component({
    selector: "app-form-post",
    templateUrl: "./form-post.component.html",
    styleUrls: ["./form-post.component.scss"],
})
export class FormPostComponent implements OnInit {
    postForm!: FormGroup;
    leftCharLength: number;
    selectedFile: File | undefined;
    url: any = "";
    categories: [Category];

    constructor(
        private formBuilder: FormBuilder,
        private contentService: ContentService,
        private router: Router,
        private dialog: MatDialog,
        private categorieService: CategoriesService
    ) {}

    ngOnInit(): void {
        this.leftCharLength = 70;
        this.postForm = this.formBuilder.group({
            title: [null, [Validators.required, Validators.maxLength(80)]],
            content: [null, [Validators.required, Validators.maxLength(1000)]],
            file: [null, [Validators.required]],
            categorie: ["", [Validators.required]],
        });
        this.setContentValidators();

        document.getElementById("label")?.classList.remove("d-none");
        document.getElementById("remove-btn")?.classList.add("d-none");

        this.categorieService.categories$
            .pipe(
                tap((categories) => {
                    this.categories = categories;
                })
            )
            .subscribe();
    }

    setValue(event: any) {
        const valueLength = event.target.value.length;
        this.leftCharLength = 70 - valueLength;
    }

    createPost() {
        const title = this.postForm.get("title")!.value;
        const categorie = this.postForm.get("categorie")!.value;
        const content = this.postForm.get("content")!.value;
        const file = this.postForm.get("file")!.value;

        let postContent;
        this.selectedFile ? (postContent = this.selectedFile) : (postContent = content);

        this.contentService
            .createPost(title, postContent, categorie)
            .pipe(
                tap(() => {
                    this.router.navigateByUrl("", { skipLocationChange: true }).then(() => {
                        this.router.navigate(["/accueil/feed"]);
                    });
                    this.postForm.patchValue({ content: "" });

                    this.selectedFile = undefined;
                    this.url = "";
                    this.dialog.closeAll();
                }),
                catchError((error) => {
                    this.postForm.patchValue({ content: "" });

                    this.selectedFile = undefined;
                    this.url = "";
                    return EMPTY;
                })
            )
            .subscribe();
    }

    onClose() {
        this.dialog.closeAll();
    }

    closeTab() {
        this.onClose();
    }
    get title() {
        return this.postForm.controls["title"];
    }

    get content() {
        return this.postForm.controls["content"];
    }

    get file() {
        return this.postForm.controls["file"];
    }

    get categorie() {
        return this.postForm.controls["categorie"];
    }

    addFile($event: any) {
        this.selectedFile = $event.target.files[0];
        let reader = new FileReader();

        reader.readAsDataURL($event.target.files[0]);
        reader.onload = (event: any) => {
            this.url = event.target.result;
        };

        document.getElementById("label")?.classList.add("hidden");
        document.getElementById("remove-btn")?.classList.remove("hidden");
    }

    removeFile() {
        this.postForm.patchValue({ content: null });
        this.postForm.patchValue({ file: null });
        const content = this.postForm.get("content");

        this.selectedFile = undefined;
        this.url = "";
        document.getElementById("label")?.classList.remove("hidden");
        document.getElementById("remove-btn")?.classList.add("hidden");
    }

    setContentValidators() {
        const content = this.postForm.get("content");
        const file = this.postForm.get("file");

        this.postForm
            .get("content")
            ?.valueChanges.pipe(distinctUntilChanged())
            .subscribe((content) => {
                if (content !== null) {
                    file?.setValidators(null);
                } else {
                    file?.setValidators(Validators.required);
                }
                file?.updateValueAndValidity();
            });

        this.postForm
            .get("file")
            ?.valueChanges.pipe(distinctUntilChanged())
            .subscribe((file) => {
                if (file !== null) {
                    content?.setValidators(null);
                } else {
                    content?.setValidators(Validators.required);
                }

                content?.updateValueAndValidity();
            });
    }
}

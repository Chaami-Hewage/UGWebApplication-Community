import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { catchError, EMPTY, tap } from "rxjs";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ContentService } from "src/app/services/content.service";
import { CategoriesService } from "src/app/services/categories.service";
import { Category } from "src/models/Category.model";

@Component({
    selector: "app-modify-comment",
    templateUrl: "./modify-post.component.html",
    styleUrls: ["./modify-post.component.scss"],
})
export class ModifyPostComponent implements OnInit {
    modifyForm!: FormGroup;
    urlFile: string;

    modifFile: File | undefined;
    leftCharLength: number;
    errorMsg: string;
    categories: [Category];
    dataCategorie: any;

    
    constructor(
        private contentService: ContentService,
        private router: Router,
        private dialog: MatDialog,
        private categorieService: CategoriesService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.categorieService.categories$
            .pipe(
                tap((categories) => {
                    this.categories = categories;
                })
            )
            .subscribe();

        this.dataCategorie = this.categories.filter((categorie) => categorie.name === this.data.categorie);

        this.leftCharLength = 70 - this.data.title.length;
        this.modifyForm = new FormGroup({
            title: new FormControl(this.data.title),
            content: new FormControl(this.data.content),
            file: new FormControl(""),
            categorie: new FormControl(this.dataCategorie[0].categoriesId.toString()),
        });
        if (this.data.content.includes("post_picture")) {
            this.urlFile = this.data.content;
        } else {
            this.urlFile = "";
        }

        this.modifyForm.get("categorie")?.setValue(this.dataCategorie[0].categoriesId.toString());
    }

    setValue(event: any) {
        const valueLength = event.target.value.length;
        this.leftCharLength = 70 - valueLength;
    }
    modifyComment() {
        const id = this.data.contents_id;
        const title = this.modifyForm.get("title")!.value;
        const content = this.modifyForm.get("content")!.value;
        const categorie = this.modifyForm.get("categorie")!.value;

        let postContent;
        this.modifFile ? (postContent = this.modifFile) : (postContent = content);
        this.contentService;
        this.contentService
            .modifyPost(id, title, postContent, categorie)
            .pipe(
                tap(() => {
                    this.router.navigateByUrl("", { skipLocationChange: true }).then(() => {
                        for (const categorieDefault of this.categories) {
                            let newCategorie = [];
                            if (categorieDefault.categoriesId == parseInt(categorie)) {
                                newCategorie.push(categorieDefault);
                                this.router.navigate(["/accueil/feed/category/" + newCategorie[0].slug]);
                            }
                        }
                    });

                    this.closeTab();
                }),
                catchError((error) => {
                    this.errorMsg = error.error.message;

                    return EMPTY;
                })
            )
            .subscribe();
    }

    get content() {
        return this.modifyForm.controls["content"];
    }

    get title() {
        return this.modifyForm.controls["title"];
    }

    get file() {
        return this.modifyForm.controls["file"];
    }

    get categorie() {
        return this.modifyForm.controls["categorie"];
    }
    onClose() {
        this.dialog.closeAll();
    }
    closeTab() {
        this.onClose();
    }

    addFile($event: any) {
        this.modifFile = $event.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL($event.target.files[0]);
        reader.onload = (event: any) => {
            this.urlFile = event.target.result;
        };
        document.getElementById("label")?.classList.add("hidden");
        document.getElementById("remove-btn")?.classList.remove("hidden");
    }

    removeFile(index: any) {
        this.modifyForm.patchValue({ content: "" });
        this.modifFile = undefined;
        this.urlFile = "";
        document.getElementById("label")?.classList.remove("hidden");
        document.getElementById("remove-btn")?.classList.add("hidden");
    }
}

import { NgModule } from "@angular/core";
import { CommonModule} from "@angular/common";
import { HeaderComponent } from "./header/header.component";
import { MainComponent } from "./main.component";
import { CreatePostComponent } from "./create-post/create-post.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FormPostComponent } from "./form-post/form-post.component";
import { RouterModule } from "@angular/router";
import { UsersComponent } from "./users/users.component";
import { FilterPipe } from "../Pipes/filter.pipe";
import { CalculDatePipe } from "../Pipes/calcul-date.pipe";
import { ProfilComponent } from "./profil/profil.component";
import { MatTabsModule } from "@angular/material/tabs";
import { PostListComponent } from "./post-list/post-list.component";
import { CommentListComponent } from "./comment-list/comment-list.component";
import { MatMenuModule } from "@angular/material/menu";
import { FormCommentsComponent } from "./form-comments/form-comments.component";
import { CategoryComponent } from "./category/category.component";
import { FeedComponent } from "./feed/feed.component";
import { MatIconModule } from "@angular/material/icon";
import { ModifyPostComponent } from "./modify-post/modify-post.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { InsertCategoryComponent } from './insert-category/insert-category.component';
import { ClickOutsideDirective } from "../click-outside.directive";

@NgModule({
    declarations: [
        HeaderComponent,
        MainComponent,
        CreatePostComponent,
        FormPostComponent,
        UsersComponent,
        ProfilComponent,
        PostListComponent,
        CommentListComponent,
        CalculDatePipe,
        FilterPipe,
        ModifyPostComponent,
        FormCommentsComponent,
        CategoryComponent,
        FeedComponent,
        InsertCategoryComponent,
        ClickOutsideDirective
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        RouterModule,
        MatTabsModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatMenuModule
    ],
    entryComponents: [FormPostComponent, ModifyPostComponent],
})
export class MainModule {}

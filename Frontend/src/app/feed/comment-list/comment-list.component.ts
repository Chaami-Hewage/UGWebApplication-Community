import { Component, Input, OnInit } from "@angular/core";
import { BehaviorSubject, forkJoin, map, Observable, take, tap } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { ContentService } from "src/app/services/content.service";
import { UserService } from "src/app/services/user.service";
import { Content } from "src/models/Content.model";
import { User } from "src/models/User.model";

@Component({
    selector: "app-comment-list",
    templateUrl: "./comment-list.component.html",
    styleUrls: ["./comment-list.component.scss"],
})
export class CommentListComponent implements OnInit {
    @Input() threadId: any;

    currentPage: number = 1;
    pageSize: number = 4;
    loading!: boolean;

    comments: Array<Content>;
    nbComments: number;

    userid: string;
    user: User | undefined;

    like: boolean;

    obsCommentArray: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    comment$: Observable<any> = this.obsCommentArray.asObservable();

    constructor(
        private contentService: ContentService,
        private authService: AuthService,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.loading = true;
        this.userid = this.authService.getUserId();
        this.contentService
            .getComment(this.threadId, this.currentPage, this.pageSize)

            .subscribe((comments) => {
                this.comments = comments;

                this.loading = false;
                this.obsCommentArray.next(comments);
            });

        this.userService.user$
            .pipe(
                tap((user) => {
                    this.user = user;
                })
            )
            .subscribe();
        this.contentService.getNumberComment(this.threadId).subscribe((nbOfComments) => {
            this.nbComments = nbOfComments;
        });
    }

    deleteComment(comment: any) {
        this.contentService.deleteComment(comment.contents_id).subscribe(() => {
            this.comment$
                .pipe(
                    take(1),
                    map((data: any) => {
                        let newData = [];
                        for (let content of data) {
                            content.contents_id !== comment.contents_id ? newData.push(content) : null;
                        }
                        return newData;
                    })
                )
                .subscribe((data) => {
                    this.nbComments--;
                    this.obsCommentArray.next(data);
                });
        });
    }

    onLike(comment: any, index: number) {
        if (comment.isLike == 1) {
            this.like = false;
            this.contentService.likePost(comment.contents_id, this.like).subscribe((data) => {
                this.comment$
                    .pipe(
                        take(1),
                        map((data) => {
                            data[index].nbLike--;
                            data[index].isLike = 0;
                            return data;
                        })
                    )
                    .subscribe((newArr) => {
                        this.obsCommentArray.next(newArr);
                    });
            });
        } else {
            this.like = true;
            this.contentService.likePost(comment.contents_id, this.like).subscribe((data) => {
                this.comment$
                    .pipe(
                        take(1),
                        map((data) => {
                            data[index].nbLike++;
                            data[index].isLike = 1;
                            return data;
                        })
                    )
                    .subscribe((newArr) => {
                        this.obsCommentArray.next(newArr);
                    });
            });
        }
    }

    updateComments(boolean: boolean) {
        if (boolean) {
            this.currentPage = 1;
            this.contentService
                .getComment(this.threadId, this.currentPage, this.pageSize)
                .subscribe((Array) => {
                    this.nbComments++;
                    this.obsCommentArray.next(Array);
                });
        }
    }

    displayMoreComment() {
        this.loading = true;
        this.currentPage++;
        this.comment$.pipe(take(1)).subscribe(() => {
            forkJoin([
                this.comment$.pipe(take(1)),
                this.contentService.getComment(this.threadId, this.currentPage, this.pageSize),
            ]).subscribe((data: Array<Array<any>>) => {
                this.loading = false;
                const newArr = [...data[0], ...data[1]];
                this.obsCommentArray.next(newArr);
            });
        });
    }
}

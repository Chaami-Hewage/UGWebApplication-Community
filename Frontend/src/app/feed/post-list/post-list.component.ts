import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, forkJoin, fromEvent, map, Observable, take, tap } from "rxjs";
import { ContentService } from "src/app/services/content.service";
import { AuthService } from "src/app/services/auth.service";

import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ModifyPostComponent } from "../modify-post/modify-post.component";
import { DOCUMENT } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "src/models/User.model";
import { UserService } from "src/app/services/user.service";



@Component({
    selector: "app-post-list",
    templateUrl: "./post-list.component.html",
    styleUrls: ["/post-list.component.scss"],
})
export class PostListComponent implements OnInit, OnDestroy {
    loading!: boolean;
    loadingScroll!: boolean;

    currentPage: number = 1;
    pageSize: number = 10;

    
    isMenuOpen: boolean;
    stillPost: boolean;
    
    obsArrayContent: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    content$: Observable<any> = this.obsArrayContent.asObservable();
    
    like: boolean;
    
    
    categorie: string | null;
    user: User | undefined;
    userid: string;

    constructor(
        private contentService: ContentService,
        private authService: AuthService,
        private userService: UserService,
        private dialog: MatDialog,
        @Inject(DOCUMENT) private document: any,
        private activitedRoute: ActivatedRoute,
        private route: Router
    ) {}

    ngOnInit(): void {
        this.isMenuOpen = false;
        this.loading = true;
        this.loadingScroll = false;
        this.userService.user$
            .pipe(
                tap((user) => {
                    this.user = user;
                })
            )
            .subscribe();

        this.userid = this.authService.getUserId();
        this.stillPost = true;
        this.route.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };
        this.categorie = this.activitedRoute.snapshot.paramMap.get("category");
        
        this.contentService
            .getPost(this.currentPage, this.pageSize, this.categorie)
            .pipe(
                tap(() => {
                    this.loading = false;
                })
            )
            .subscribe((data) => {
                this.obsArrayContent.next(data);
            });

        const scroll$ = fromEvent(window, "scroll").pipe(
            map((event) => {
                return window.document.documentElement.scrollTop;
            })
        );

        scroll$.subscribe((scrollPos) => {
            const { scrollHeight, clientHeight } = window.document.documentElement;

            if (clientHeight + scrollPos >= scrollHeight - 20 && this.stillPost) {
                this.loadingScroll = true;
                this.currentPage++;
                forkJoin([
                    this.content$.pipe(take(1)),
                    this.contentService.getPost(this.currentPage, this.pageSize, this.categorie),
                ]).subscribe((data: Array<Array<any>>) => {
                    const newArr = [...data[0], ...data[1]];

                    if (data[1].length === 0) {
                        this.stillPost = false;
                        this.loadingScroll = false;
                        this.obsArrayContent.next(newArr);
                    } else {
                        this.stillPost = true;
                        this.loadingScroll = false;
                        this.obsArrayContent.next(newArr);
                    }
                });
            }
        });
    }

    onDelete(post: any, index: number) {
        this.contentService.deletePost(post.threads_id).subscribe(() => {
            this.content$
                .pipe(
                    take(1),
                    map((data: any) => {
                        let newData = [];
                        for (let content of data) {
                            content.threads_id !== post.threads_id ? newData.push(content) : null;
                        }
                        return newData;
                    })
                )
                .subscribe((data) => {
                    this.stillPost = true;
                    this.obsArrayContent.next(data);
                });
        });
    }

    onLike(post: any, index: number) {
        if (post.isLiked == 1) {
            this.like = false;
            this.contentService.likePost(post.contents_id, this.like).subscribe((data) => {
                this.content$
                    .pipe(
                        take(1),
                        map((data) => {
                            data[index].nbLike--;
                            data[index].isLiked = 0;
                            return data;
                        })
                    )
                    .subscribe((newArr) => {
                        this.obsArrayContent.next(newArr);
                    });
            });
        } else {
            this.like = true;
            this.contentService.likePost(post.contents_id, this.like).subscribe((data) => {
                this.content$
                    .pipe(
                        take(1),
                        map((data) => {
                            data[index].nbLike++;
                            data[index].isLiked = 1;
                            return data;
                        })
                    )
                    .subscribe((newArr) => {
                        this.obsArrayContent.next(newArr);
                    });
            });
        }
    }

    showComment(event: any) {
        event.target.closest("article").querySelector("app-comment-list").classList.toggle("d-none");
    }

    modifyPost(post: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "600px";
        dialogConfig.maxWidth = "80%";
        dialogConfig.data = post;

        this.dialog.open(ModifyPostComponent, dialogConfig);
    }

    ngOnDestroy(): void {
        this.categorie = "";
        this.currentPage = 1;
    }
}

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Content } from "src/models/Content.model";
import { environment } from "src/environments/environment";
@Injectable({
    providedIn: "root",
})
export class ContentService {
    nbComments: any;
    content: any;
    private backendServer = environment.backendServer;
    constructor(private http: HttpClient, private router: Router) {}

    getComment(id: string, pageNumber: number, pageSize: number) {
        return this.http.get<Content[]>(
            this.backendServer + "/api/comment/" + id + "/" + pageNumber + "/" + pageSize
        );
    }
    getPost(pageNumber: number, pageSize: number, categorie: string | null) {
        return this.http.get<Content[]>(
            this.backendServer +
                "/api/post?start=" +
                pageNumber +
                "&limit=" +
                pageSize +
                "&category=" +
                categorie
        );
    }

    deletePost(id: string) {
        return this.http.delete<{ message: string }>(this.backendServer + "/api/post/" + id);
    }

    createPost(title: string, content: string | File, categorie: string) {
        if (typeof content === "string") {
            const post = { title: title, categorie: categorie, content: content };

            return this.http.post<{ message: string }>(
                this.backendServer + "/api/post/",
                this.createFormData("post", JSON.stringify(post))
            );
        } else {
            const post = { title: title, categorie: categorie };

            return this.http.post<{ message: string }>(
                this.backendServer + "/api/post/",
                this.createFormData("post", JSON.stringify(post), "image", content)
            );
        }
    }

    modifyPost(id: string, title: string, content: string | File, categorie: string) {
        if (typeof content === "string") {
            const post = { title: title, content: content, categorie: categorie };

            return this.http.put<{ message: string }>(
                this.backendServer + "/api/post/" + id,
                this.createFormData("post", JSON.stringify(post))
            );
        } else {
            const post = { title: title, categorie: categorie };

            return this.http.put<{ message: string }>(
                this.backendServer + "/api/post/" + id,
                this.createFormData("post", JSON.stringify(post), "image", content)
            );
        }
    }

    createComment(threadid: any, content: string | File) {
        if (typeof content === "string") {
            const comment = { threadId: threadid, content: content };

            return this.http.post<{ message: string }>(
                this.backendServer + "/api/comment/",
                this.createFormData("comment", JSON.stringify(comment))
            );
        } else {
            const comment = { threadId: threadid };

            return this.http.post<{ message: string }>(
                this.backendServer + "/api/comment/",
                this.createFormData("comment", JSON.stringify(comment), "image", content)
            );
        }
    }

    likePost(id: any, like: boolean) {
        return this.http.post<{ message: string }>(this.backendServer + "/api/like/" + id, {
            like: like ? 1 : 0,
        });
    }

    getNumberLike(id: any) {
        return this.http.get<any>(this.backendServer + "/api/like/" + id);
    }

    deleteComment(id: string) {
        return this.http.delete<{ message: string }>(this.backendServer + "/api/comment/" + id);
    }

    getNumberComment(id: any) {
        return this.http.get<any>(this.backendServer + "/api/comment/" + id + "/nb");
    }

    createFormData(name: string, value: any, nameImage: string = "image", image: any = "") {
        const formData = new FormData();
        formData.append(name, value);
        formData.append(nameImage, image);
        return formData;
    }
}

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { AuthentificationModule } from "./authentification/authentification.module";

import { AppComponent } from "./app.component";
import { GetStartedComponent } from "./get-started/get-started.component";
import { AuthInterceptor } from "src/interceptors/auth-interceptor";
import { MainModule } from "./feed/main.module";
import { CommonModule } from "@angular/common";
import {RouterModule} from "@angular/router";
import {CommunityHomeComponent} from "./community-home/community-home.component";


@NgModule({
    declarations: [AppComponent, PageNotFoundComponent, GetStartedComponent],
    imports: [
        BrowserModule,
        CommonModule,
        MatDialogModule,
        HttpClientModule,
        AppRoutingModule,
        AuthentificationModule,
        MainModule,
        NoopAnimationsModule,
        MatIconModule,
        MatMenuModule,
        RouterModule,
    ],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
    bootstrap: [AppComponent,CommunityHomeComponent],
})
export class AppModule {}

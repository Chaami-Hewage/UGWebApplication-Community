import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./authentification/login/login.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { SignupComponent } from "./authentification/signup/signup.component";
import { GetStartedComponent } from "./get-started/get-started.component";
import { MainComponent } from "./feed/main.component";
import { AuthGuard } from "./auth.guard";

import { UsersComponent } from "./feed/users/users.component";
import { FeedComponent } from "./feed/feed/feed.component";
import {CommunityHomeComponent} from "./community-home/community-home.component";

const routes: Routes = [
    { path: "home", component: CommunityHomeComponent},
    { path: "login", component: LoginComponent },
    { path: "signup", component: SignupComponent },
    { path: "get-started", component: GetStartedComponent, canActivate: [AuthGuard] },
    {

        path: "accueil",
        component: MainComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: "feed",
                component: FeedComponent,
            },
            { path: "users", component: UsersComponent },
            { path: "feed/category/:category", component: FeedComponent },
        ],
    },

    { path: "", redirectTo: "login", pathMatch: "full" },
    { path: "**", component: PageNotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}

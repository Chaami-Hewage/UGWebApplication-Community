import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-community-home',
  templateUrl: './community-home.component.html',
  styleUrls: ['./community-home.component.scss']
})
export class CommunityHomeComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }
  goToLogin(): void{
      this.router.navigateByUrl("accueil/feed");
  }

}

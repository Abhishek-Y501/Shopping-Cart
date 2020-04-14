import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = ':: ShopKart ::';

  constructor(private titleService: Title, private router: Router, private activatedRoute: ActivatedRoute,
    private authService: AuthService) { }
  ngOnInit(): void {
    const appTitle = this.titleService.getTitle();
    this.router
      .events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let child = this.activatedRoute.firstChild;
          while (child.firstChild) {
            child = child.firstChild;
          }
          if (child.snapshot.data['title']) {
            return child.snapshot.data['title'] + ' | ' + this.title;
          }
          return appTitle + ' | ' + this.title;
        })
      ).subscribe((ttl: string) => {
        this.titleService.setTitle(ttl);
      });
  }

  public logout() {
    this.authService.logout();
    this.router.navigate(['/signIn']);
  }
}
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  providers: [Router]
})
export class NavbarComponent {

  constructor(readonly appConfig: ConfigService, private router: Router) { }

  navigate(link: string) {
    this.router.navigate([link]);
  }

}

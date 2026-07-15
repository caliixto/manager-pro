import { Component } from '@angular/core';
import { AuthService } from '../../features/auth/auth';
import { Router } from '@angular/router';
import { Dashboard } from '../../features/dashboard/dashboard/dashboard/dashboard';

@Component({
  selector: 'app-header',
  imports: [Dashboard],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(private auth: AuthService, private router: Router) {}
  name:any = "";

  ngOnInit(){
    const user = this.auth.getUser();
    this.name = user?.name;
  }


  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

}

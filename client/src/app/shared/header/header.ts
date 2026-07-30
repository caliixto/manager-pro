import { Component } from '@angular/core';
import { AuthService } from '../../features/auth/auth';
import { Router } from '@angular/router';
import { Dashboard } from '../../features/dashboard/dashboard/dashboard/dashboard';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [Dashboard, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  menuAbierto = false; 

  constructor(private auth: AuthService, private router: Router) {}
  name:any = "";

  ngOnInit(){
    const user = this.auth.getUser();
    this.name = user?.name;
  }

    toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }


  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  
  

}

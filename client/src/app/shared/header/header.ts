import { Component } from '@angular/core';
import { AuthService } from '../../features/auth/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
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

  get currentUser() {
    return this.auth.getUser();
  }


  get monedasFormateadas(): string {
    const monedas = this.auth.usuario()?.monedas ?? 0;
    return (monedas / 1000000).toFixed(1) + 'M';
  }
  
  

}

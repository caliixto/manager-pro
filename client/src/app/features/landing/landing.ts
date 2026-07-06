import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Authmodal } from '../auth/authmodal/authmodal';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-landing',
  imports: [ButtonModule, Authmodal, CommonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  
    showAuthModal = false;
    initialTab: 'login' | 'register' = 'login';

    openAuth(tab: 'login' | 'register') {
      this.initialTab = tab;
      this.showAuthModal = true;
    }
}

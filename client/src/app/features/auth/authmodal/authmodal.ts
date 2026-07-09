import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { Login } from '../login/login';
import { Register } from '../register/register';
import { CommonModule } from '@angular/common'; 
import { ForgotPassword } from '../../forgotpassword/forgotpassword';


@Component({
  selector: 'app-auth-modal',
  imports: [Login, Register, CommonModule,ForgotPassword],
  templateUrl: './authmodal.html',
  styleUrl: './authmodal.css',
})
export class Authmodal implements OnInit {
  @Input() initialTab: 'login' | 'register' = 'login';
  @Output() close = new EventEmitter<void>();

  activeTab: 'login' | 'register' | 'forgot' = 'login';

  ngOnInit() {
    this.activeTab = this.initialTab;
  }

   setTab(tab: 'login' | 'register' | 'forgot') {
    this.activeTab = tab;
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}

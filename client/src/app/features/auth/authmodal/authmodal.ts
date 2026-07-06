import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { Login } from '../login/login';
import { Register } from '../register/register';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-auth-modal',
  imports: [Login, Register, CommonModule],
  templateUrl: './authmodal.html',
  styleUrl: './authmodal.css',
})
export class Authmodal implements OnInit {
  @Input() initialTab: 'login' | 'register' = 'login';
  @Output() close = new EventEmitter<void>();

  activeTab: 'login' | 'register' = 'login';

  ngOnInit() {
    this.activeTab = this.initialTab; // arranca en la pestaña que le diga el padre
  }

  setTab(tab: 'login' | 'register') {
    this.activeTab = tab;
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}

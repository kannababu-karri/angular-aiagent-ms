import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './login-home.component.html',
  styles: []
})

export class LoginHomeComponent implements OnInit {
  constructor(public authService: AuthService) { }

  ngOnInit() {
    // Load user when page opens
    this.authService.loadUser();
  }
}

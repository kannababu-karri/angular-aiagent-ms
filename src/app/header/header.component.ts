import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit, OnDestroy {

  user: any;
  private sub!: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Load stored user
    this.authService.loadUser();

    // Subscribe to user changes
    this.sub = this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  logout() {
    this.authService.clear();
    location.href = '/';
  }
}
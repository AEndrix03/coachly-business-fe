import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly isAuthenticatedSignal = signal(false);

  readonly isAuthenticated = computed(() => this.isAuthenticatedSignal());

  login(): void {
    this.isAuthenticatedSignal.set(true);
  }

  logout(): void {
    this.isAuthenticatedSignal.set(false);
  }
}

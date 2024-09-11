import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-alumno',
  templateUrl: './home-alumno.page.html',
  styleUrls: ['./home-alumno.page.scss'],
})
export class HomeAlumnoPage implements OnInit, OnDestroy {
  username: string = '';
  private userSubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private menuController: MenuController
  ) { }

  ngOnInit() {
    this.checkAuthStatus();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  checkAuthStatus() {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.username = user.name || 'Alumno';
      } else {
        // Intenta recuperar el token almacenado
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Si hay un token, intenta validarlo
          this.authService.validateToken(token).subscribe(
            (isValid) => {
              if (!isValid) {
                this.router.navigate(['/login']);
              }
            },
            (error) => {
              console.error('Error validando el token:', error);
              this.router.navigate(['/login']);
            }
          );
        } else {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  async logout() {
    this.authService.logout();
    this.presentToast('Has cerrado sesión', 'bottom', 3000, 'success');
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3000);
  }

  async presentToast(message: string, position: 'top' | 'bottom', duration: number, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration,
      position,
      color,
    });
    toast.present();
  }

  async openProfileMenu() {
    await this.menuController.open('end');
  }
}
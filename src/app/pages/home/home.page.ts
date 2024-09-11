import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  username: string = '';
  private userSubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private menuController: MenuController
  ) { }

  ngOnInit() {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.username = user.name || 'Usuario';
      } else {
        this.router.navigate(['/login']); // Redirigir a login si no hay usuario
      }
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  async logout() {
    this.authService.logout(); // Utilizar el servicio para cerrar sesión
    this.presentToast('Has cerrado sesión', 'bottom', 3000, 'success');
    // Esperar a que el toast se muestre y luego redirigir a login
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3000); // Asegúrate de que el tiempo coincida con la duración del toast
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

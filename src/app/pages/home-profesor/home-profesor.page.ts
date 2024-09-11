import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-profesor',
  templateUrl: './home-profesor.page.html',
  styleUrls: ['./home-profesor.page.scss'],
})
export class HomeProfesorPage implements OnInit, OnDestroy {
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
        this.username = user.name || 'Profesor';
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
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
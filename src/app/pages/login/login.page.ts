import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.clearFields();
  }

  clearFields() {
    this.email = '';
    this.password = '';
  }

  async login() {
    try {
      const user = await this.authService.login(this.email, this.password);
      if (user) {
        this.clearFields();
        this.redirectBasedOnRole(user.role);
      } else {
        await this.presentToast('Credenciales incorrectas', 'bottom', 3000, 'danger');
      }
    } catch (error) {
      await this.presentToast('Error al iniciar sesión', 'bottom', 3000, 'danger');
    }
  }

  redirectBasedOnRole(role: string) {
    if (role === 'profesor') {
      this.router.navigate(['/home-profesor']);
    } else if (role === 'alumno') {
      this.router.navigate(['/home-alumno']);
    } else {
      this.router.navigate(['/home']); // Ruta por defecto si no se reconoce el rol
    }
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
}
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.page.html',
  styleUrls: ['./sing-up.page.scss'],
})
export class SingUpPage implements OnInit {
  name: string = '';
  email: string = '';
  password: string = '';
  role: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.clearFields();
  }

  clearFields() {
    this.name = '';
    this.email = '';
    this.password = '';
    this.role = '';
  }

  async signUp() {
    if (!this.name || !this.email || !this.password || !this.role) {
      await this.presentToast('Por favor, complete todos los campos', 'bottom', 3000, 'danger');
      return;
    }

    const emailValidation = this.validateEmail(this.email);
    if (!emailValidation.isValid) {
      await this.presentToast(emailValidation.message, 'bottom', 3000, 'danger');
      return;
    }

    const passwordValidation = this.validatePassword(this.password);
    if (!passwordValidation.isValid) {
      await this.presentToast(passwordValidation.message, 'bottom', 3000, 'danger');
      return;
    }

    const isRegistered = this.authService.register(this.email, this.name, this.password, this.role);
    if (!isRegistered) {
      await this.presentToast('El correo ya está registrado', 'bottom', 3000, 'danger');
      return;
    }

    const user = this.authService.login(this.email, this.password);
    if (user) {
      this.redirectBasedOnRole(user.role);
    } else {
      await this.presentToast('Error al iniciar sesión después del registro', 'bottom', 3000, 'danger');
    }
  }

  validateEmail(email: string): { isValid: boolean; message: string } {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.includes('@')) {
      return { isValid: false, message: 'El correo electrónico debe contener el símbolo @' };
    } else if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Por favor, ingrese un correo electrónico válido' };
    }
    return { isValid: true, message: '' };
  }

  validatePassword(password: string): { isValid: boolean; message: string } {
    if (password.length < 6) {
      return { isValid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    } else if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: 'La contraseña debe contener al menos una letra mayúscula' };
    }
    return { isValid: true, message: '' };
  }

  redirectBasedOnRole(role: string) {
    if (role === 'profesor') {
      this.router.navigate(['/home-profesor']);
    } else {
      this.router.navigate(['/home-alumno']);
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
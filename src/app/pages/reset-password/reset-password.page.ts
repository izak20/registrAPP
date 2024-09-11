import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showPasswordFields: boolean = false;

  constructor(
    private toastController: ToastController,
    private router: Router,
    private navCtrl: NavController
  ) {}

  goBack() {
    this.navCtrl.back();
  }

  validateEmail() {
    const emailValidation = this.validateEmailFormat(this.email);
    if (!emailValidation.isValid) {
      this.presentToast(emailValidation.message, 'bottom', 3000, 'danger');
      return;
    }

    const user = localStorage.getItem(this.email);

    if (user !== null) {
      this.showPasswordFields = true;
    } else {
      this.presentToast('El correo no está registrado', 'bottom', 3000, 'danger');
    }
  }

  resetPassword() {
    const passwordValidation = this.validatePassword(this.newPassword);
    if (!passwordValidation.isValid) {
      this.presentToast(passwordValidation.message, 'bottom', 5000, 'danger');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.presentToast('Las contraseñas no coinciden', 'bottom', 3000, 'danger');
      return;
    }

    const user = localStorage.getItem(this.email);

    if (user !== null) {
      const parsedUser = JSON.parse(user);
      parsedUser.password = this.newPassword;

      localStorage.setItem(this.email, JSON.stringify(parsedUser));

      this.presentToast('Contraseña actualizada con éxito', 'bottom', 3000, 'success');

      this.email = '';
      this.newPassword = '';
      this.confirmPassword = '';
      this.showPasswordFields = false;

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
    }
  }

  validateEmailFormat(email: string): { isValid: boolean; message: string } {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.includes('@')) {
      return { isValid: false, message: 'El correo electrónico debe contener el símbolo @' };
    } else if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Por favor, ingrese un correo electrónico válido' };
    }
    return { isValid: true, message: '' };
  }

  validatePassword(password: string): { isValid: boolean; message: string } {
    const requirements = [];
    if (password.length < 6) {
      requirements.push('al menos 6 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      requirements.push('al menos una letra mayúscula');
    }
    if (!/[a-z]/.test(password)) {
      requirements.push('al menos una letra minúscula');
    }
    if (!/\d/.test(password)) {
      requirements.push('al menos un número');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      requirements.push('al menos un carácter especial');
    }

    if (requirements.length > 0) {
      const message = `La contraseña debe contener: ${requirements.join(', ')}`;
      return { isValid: false, message };
    }
    return { isValid: true, message: '' };
  }

  async presentToast(message: string, position: 'top' | 'bottom', duration: number, color: 'danger' | 'success') {
    const toast = await this.toastController.create({
      message,
      duration,
      position,
      color,
    });
    toast.present();
  }
}
import { Component } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-toast',
    imports: [CommonModule],
    templateUrl: './toast.component.html',
    styleUrl: './toast.component.scss'
})
export class ToastComponent {
  // Access the `toasts` from the ToastService
  get toasts() {
    return this.toastService.toasts;
  }

  constructor(private toastService: ToastService) {}

  // Method to remove a toast
  removeToast(index: number) {
    this.toastService.removeToast(index);
  }
}

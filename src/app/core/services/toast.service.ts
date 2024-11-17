import { Injectable } from '@angular/core';

interface Toast {
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  show: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: { message: string; type: string }[] = [];

  // Method to add a toast
  show(message: string, type: 'success' | 'danger' | 'info' | 'warning' = 'info') {
    this.toasts.push({ message, type });
    setTimeout(() => {
      this.removeToast(0);  // Automatically remove the toast after 3 seconds
    }, 3000);
  }

  // Method to remove a toast by index
  removeToast(index: number) {
    this.toasts.splice(index, 1);
  }
}

import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { FcmService } from './services/fcm.service';
import { ToastController } from '@ionic/angular';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  private data:any = {
    docId: 'CA/0010/112',
    userId: '00500005',
    approvalStatus: ''
  };

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fcm: FcmService,
    public toastController: ToastController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initNotification();
    });
  }

  private initNotification() {
    this.fcm.getToken(this.data.userId);
    console.log('userid', this.data.userId);
    this.fcm.listenToNotifications().pipe(
      tap(msg => {
        if (this.platform.is('ios')) {
          this.presentToast(msg.aps.alert);
          console.log(`User opened a notification`, msg);
        } else {
          this.presentToast(msg.body);
          console.log(`User opened a notification`, msg);
        }
      })
    )
    .subscribe();
  }

  private async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 10000,
      position: 'top',
      showCloseButton: true
    });
    toast.present();
  }
}

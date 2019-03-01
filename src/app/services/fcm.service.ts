import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
// import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  private token: any;

  constructor(
    private firebase: Firebase,
    private afs: AngularFirestore,
    private platform: Platform
  ) { }

  async getToken(userId) {

    if (this.platform.is('android')) {
      this.token = await this.firebase.getToken();
      console.log(`The token is ${this.token}`);
    }

    if (this.platform.is('ios')) {
      this.token = await this.firebase.getToken();
      await this.firebase.grantPermission();
      console.log(`The token is ${this.token}`);
    }

    this.saveToken(this.token, userId);
  }

  private saveToken(token, userId) {
    if (!token && !userId) return;

    const devicesRef = this.afs.collection('devices');

    const data = {
      token,
      userId: userId,
    };

    return devicesRef.doc(token).set(data);
  }

  listenToNotifications() {
    return this.firebase.onNotificationOpen();
  }

  requestNotifications(userId, docId) {
    const notifRef = this.afs.collection('documents');

    const notif = {
      docId: docId,
      docName: 'Approval Document',
      approverId: userId
    };

    return notifRef.doc(userId).set(notif);
  }

}

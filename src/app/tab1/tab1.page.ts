import { Component } from '@angular/core';
import { FcmService } from '../services/fcm.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  private data:any = {
    docId: 'CA/0010/112',
    userId: '00500005'
  };
  
  constructor(private fcm: FcmService) { }

  sendNotifications() {
    this.fcm.requestNotifications(this.data.userId, this.data.docId).then(result => {
      console.log('send request notifications...', result);
    });
  }
}

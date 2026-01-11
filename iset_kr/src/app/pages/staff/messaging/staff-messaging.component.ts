import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-staff-messaging',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="messaging-container">
      <div class="messaging-layout glass-card">
        <!-- CONVERSATIONS LIST -->
        <div class="conversations-sidebar">
          <div class="sidebar-header">
            <h3>Messages</h3>
            <button class="icon-btn" title="Nouvelle discussion"><i class="fas fa-edit"></i></button>
          </div>
          <div class="search-wrap">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Rechercher...">
          </div>
          <div class="conv-list">
            <div *ngFor="let conv of conversations" 
                 class="conv-item" 
                 [class.active]="selectedConv?._id === conv._id"
                 [class.unread]="conv.unread"
                 (click)="selectConversation(conv)">
              <div class="avatar-wrap">
                <div class="avatar">{{ conv.name.charAt(0) }}</div>
                <div class="status-dot" [class.online]="conv.online"></div>
              </div>
              <div class="conv-info">
                <div class="name-row">
                  <span class="name">{{ conv.name }}</span>
                  <span class="time">{{ conv.time }}</span>
                </div>
                <div class="preview">{{ conv.lastMessage }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- CHAT AREA -->
        <div class="chat-area" *ngIf="selectedConv; else noSelection">
          <div class="chat-header">
            <div class="user-info">
              <div class="avatar">{{ selectedConv.name.charAt(0) }}</div>
              <div class="details">
                <h4>{{ selectedConv.name }}</h4>
                <p>{{ selectedConv.online ? 'En ligne' : 'Inactif' }}</p>
              </div>
            </div>
            <div class="header-actions">
              <button class="icon-btn"><i class="fas fa-video"></i></button>
              <button class="icon-btn"><i class="fas fa-phone"></i></button>
              <button class="icon-btn"><i class="fas fa-ellipsis-v"></i></button>
            </div>
          </div>

          <div class="messages-wrap" #scrollContainer>
            <div *ngFor="let msg of messages" class="message-row" [class.me]="msg.sender === 'me'">
              <div class="message-bubble">
                <p>{{ msg.text }}</p>
                <span class="time">{{ msg.time }} <i class="fas fa-check-double"></i></span>
              </div>
            </div>
          </div>

          <div class="chat-input-bar">
            <button class="attach-btn"><i class="fas fa-paperclip"></i></button>
            <input type="text" [(ngModel)]="newMessage" (keyup.enter)="sendMessage()" placeholder="Votre message...">
            <button class="send-btn" (click)="sendMessage()">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>

        <ng-template #noSelection>
          <div class="no-selection">
            <div class="illustration">
              <i class="fas fa-comments"></i>
            </div>
            <h3>Sélectionnez une discussion</h3>
            <p>Discutez avec vos étudiants ou l'administration en temps réel.</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
    styles: [`
    .messaging-container { height: calc(100vh - 180px); animation: fadeIn 0.6s ease; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .glass-card {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 24px;
      height: 100%;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
      display: flex;
      overflow: hidden;
    }

    /* SIDEBAR */
    .conversations-sidebar {
      width: 350px;
      border-right: 1px solid #f1f5f9;
      display: flex;
      flex-direction: column;
      
      .sidebar-header {
        padding: 1.5rem; display: flex; justify-content: space-between; align-items: center;
        h3 { font-size: 1.4rem; font-weight: 900; color: #0f172a; }
        .icon-btn { background: #eff6ff; color: #0055a4; border: none; width: 35px; height: 35px; border-radius: 10px; cursor: pointer; }
      }
      
      .search-wrap {
        padding: 0 1.5rem 1.5rem; position: relative;
        i { position: absolute; left: 2.2rem; top: 35%; color: #94a3b8; }
        input { width: 100%; background: #f1f5f9; border: none; padding: 0.8rem 1rem 0.8rem 3rem; border-radius: 12px; font-family: inherit; font-weight: 600; }
      }
      
      .conv-list { flex: 1; overflow-y: auto; padding: 0 1rem; }
      
      .conv-item {
        display: flex; gap: 1rem; padding: 1.2rem; border-radius: 16px; cursor: pointer; transition: all 0.3s; margin-bottom: 0.5rem;
        &:hover { background: #f8fafc; }
        &.active { background: #eff6ff; }
        &.unread { .preview { color: #0f172a; font-weight: 800; } .name { font-weight: 900; } }
        
        .avatar-wrap {
          position: relative;
          .avatar { width: 48px; height: 48px; background: #e2e8f0; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #475569; }
          .status-dot { position: absolute; bottom: -2px; right: -2px; width: 14px; height: 14px; background: #94a3b8; border: 3px solid white; border-radius: 50%; &.online { background: #10b981; } }
        }
        
        .conv-info {
          flex: 1;
          .name-row { display: flex; justify-content: space-between; margin-bottom: 0.2rem; .name { font-weight: 700; color: #0f172a; } .time { font-size: 0.75rem; color: #94a3b8; } }
          .preview { font-size: 0.85rem; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 200px; }
        }
      }
    }

    /* CHAT AREA */
    .chat-area { flex: 1; display: flex; flex-direction: column; background: white; }
    
    .chat-header {
      padding: 1.2rem 2rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;
      .user-info {
        display: flex; gap: 1rem; align-items: center;
        .avatar { width: 42px; height: 42px; background: #eff6ff; color: #0055a4; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 800; }
        h4 { font-weight: 800; color: #0f172a; margin-bottom: 0.1rem; }
        p { font-size: 0.75rem; color: #10b981; font-weight: 700; }
      }
      .header-actions { display: flex; gap: 1rem; .icon-btn { background: none; border: none; font-size: 1.1rem; color: #94a3b8; cursor: pointer; &:hover { color: #0055a4; } } }
    }

    .messages-wrap { flex: 1; padding: 2rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1.5rem; background: #fcfdfe; }
    
    .message-row {
      display: flex;
      &.me { justify-content: flex-end; .message-bubble { background: #0055a4; color: white; border-radius: 18px 18px 0 18px; } .time { color: rgba(255,255,255,0.7); } }
      &:not(.me) { .message-bubble { background: #f1f5f9; color: #0f172a; border-radius: 18px 18px 18px 0; } .time { color: #94a3b8; } }
      
      .message-bubble {
        max-width: 60%; padding: 1rem 1.2rem; box-shadow: 0 5px 15px rgba(0,0,0,0.02);
        p { line-height: 1.5; font-weight: 500; font-size: 0.95rem; }
        .time { display: block; text-align: right; font-size: 0.7rem; margin-top: 0.5rem; font-weight: 700; }
      }
    }

    .chat-input-bar {
      padding: 1.5rem 2rem; border-top: 1px solid #f1f5f9; display: flex; gap: 1rem; align-items: center;
      input { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; padding: 1rem 1.5rem; border-radius: 50px; font-family: inherit; font-weight: 600; &:focus { outline: none; border-color: #0055a4; background: white; } }
      .attach-btn { background: none; border: none; color: #94a3b8; font-size: 1.2rem; cursor: pointer; &:hover { color: #0055a4; } }
      .send-btn { background: #0055a4; color: white; border: none; width: 45px; height: 45px; border-radius: 50%; cursor: pointer; transition: all 0.3s; &:hover { transform: scale(1.1) rotate(-10deg); background: #003e7a; } }
    }

    .no-selection { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: #94a3b8;
      .illustration { font-size: 5rem; color: #f1f5f9; margin-bottom: 2rem; }
      h3 { font-size: 1.5rem; color: #0f172a; margin-bottom: 0.5rem; }
      p { font-weight: 500; }
    }
  `]
})
export class StaffMessagingComponent implements OnInit {
    selectedConv: any = null;
    newMessage = '';

    conversations = [
        { _id: '1', name: 'Ahmed Ben Salah', lastMessage: 'Merci Monsieur pour les supports.', time: '14:20', unread: true, online: true },
        { _id: '2', name: 'Administration ISET', lastMessage: 'Validation de votre planning S2.', time: 'Hier', unread: false, online: false },
        { _id: '3', name: 'Sarra Mahjoub', lastMessage: 'Est-ce que l\'examen sera QCM ?', time: 'Lundi', unread: false, online: true },
    ];

    messages = [
        { text: 'Bonjour Ahmed, as-tu pu télécharger le TP ?', sender: 'me', time: '14:15' },
        { text: 'Oui Monsieur, bien reçu. Merci pour les supports.', sender: 'them', time: '14:20' },
    ];

    ngOnInit(): void { }

    selectConversation(conv: any) {
        this.selectedConv = conv;
        conv.unread = false;
    }

    sendMessage() {
        if (!this.newMessage.trim()) return;
        this.messages.push({
            text: this.newMessage,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        this.newMessage = '';
    }
}

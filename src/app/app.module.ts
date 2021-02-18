import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component'
import { NewsComponent } from './news/news.component'
import { RouterModule } from '@angular/router'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TasklistsComponent } from './tasklists/tasklists.component';
import { MailComponent } from './mail/mail.component';
import { MailSidebarComponent } from './mail/mail-sidebar/mail-sidebar.component';
import { CalendarSidebarComponent } from './calendar/calendar-sidebar/calendar-sidebar.component';
import { firebaseConfig } from './firebaseConfig';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { TasklistComponent } from './tasklists/tasklist/tasklist.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FormsModule} from '@angular/forms';
import { PostComponent } from './news/post/post.component';
import { EditComponent } from './news/edit/edit.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    RouterModule.forRoot([
      {path: "login", component: LoginComponent, outlet: 'main'},
      {path: "news", component: NewsComponent, outlet: 'main'},
      {path: "calendar", component: CalendarComponent, outlet: 'main'},
      {path: "calendar", component: CalendarSidebarComponent, outlet: 'sidebar'},
      {path: "tasklist", component: TasklistsComponent, outlet: 'main', children: [
        {path: ":id", component: TasklistComponent, outlet: 'main'}
      ]},
      {path: "id", component: TasklistComponent, outlet: 'main'},
      {path: "mail", component: MailComponent, outlet: 'main'},
      {path: "mail", component: MailSidebarComponent, outlet: 'sidebar'},
      {path: '', redirectTo: '/calendar', pathMatch: 'full'}
    ]),
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularEditorModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    CalendarComponent,
    LoginComponent,
    NewsComponent,
    TasklistsComponent,
    MailComponent,
    MailSidebarComponent,
    CalendarSidebarComponent,
    TasklistComponent,
    PostComponent,
    EditComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

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
import { MailSidebarComponent } from './mail-sidebar/mail-sidebar.component';
import { CalendarSidebarComponent } from './calendar-sidebar/calendar-sidebar.component';
import { firebaseConfig } from './firebaseConfig';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

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
      {path: "login", component: LoginComponent},
      {path: "calendar", component: CalendarComponent},
      {path: "news", component: NewsComponent},
      {path: "mail", component: MailComponent},
      {path: "mail", component: MailSidebarComponent, outlet: 'sidebar'},
      {path: "calendar", component: CalendarSidebarComponent, outlet: 'sidebar'},
      {path: '', redirectTo: '/calendar', pathMatch: 'full'}
    ]),
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule
  ],
  declarations: [
    AppComponent,
    CalendarComponent,
    LoginComponent,
    NewsComponent,
    TasklistsComponent,
    MailComponent,
    MailSidebarComponent,
    CalendarSidebarComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

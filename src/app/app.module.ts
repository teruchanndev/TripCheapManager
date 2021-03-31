import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import {CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './menu/header/header.component';
import { CreateTicketComponent } from './functions/create-ticket/create-ticket.component';
import { TicketCreateComponent } from './tickets/ticket-create/ticket-create.component';
import { TicketListComponent } from './tickets/ticket-list/ticket-list.component';
import { TicketEditComponent } from './tickets/ticket-edit/ticket-edit.component';
import { CategoryComponent } from './categories/category/category.component';

import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error/error.component';
import { AngularMaterialModule } from './angular-material.module';
import { AuthModule } from './auth/auth.module';
import { SidebarComponent } from './menu/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CreateTicketComponent,
    TicketCreateComponent,
    TicketListComponent,
    TicketEditComponent,
    CategoryComponent,
    ErrorComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    AuthModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule {}

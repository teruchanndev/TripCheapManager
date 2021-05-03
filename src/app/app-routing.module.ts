import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

import { CreateInfoComponent } from './infomations/create-info/create-info.component';
import { InformationComponent } from './infomations/information/information.component';
import { HeaderComponent } from './menu/header/header.component';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { TicketCreateComponent } from './tickets/ticket-create/ticket-create.component';
import { TicketEditComponent } from './tickets/ticket-edit/ticket-edit.component';
import { TicketListComponent } from './tickets/ticket-list/ticket-list.component';
import { TicketsCreateFromExcelComponent } from './tickets/tickets-create-from-excel/tickets-create-from-excel.component';
import { TicketsCreateFromImageComponent } from './tickets/tickets-create-from-image/tickets-create-from-image.component';

const routes: Routes = [
  {path: '',
    redirectTo: 'login',
    pathMatch: 'full', },

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', component: HeaderComponent,
    children: [
      { path: 'home', component: DashboardComponent },
      { path: 'ticket', component: TicketsComponent },
      { path: 'list', component: TicketListComponent },
      { path: 'ticket/create', component: TicketCreateComponent },
      { path: 'ticket/create-upload-image', component: TicketsCreateFromImageComponent },
      { path: 'ticket/create-upload-excel', component: TicketsCreateFromExcelComponent },
      { path: 'ticket/edit/:ticketId', component: TicketEditComponent, canActivate: [AuthGuard] },
      { path: 'home/setting', component: InformationComponent, canActivate: [AuthGuard] },
      { path: 'order', component: OrderListComponent},

    ] },
  { path: 'shop/info', component: CreateInfoComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {

}

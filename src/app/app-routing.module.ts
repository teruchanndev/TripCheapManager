import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';


import { CreateTicketComponent } from './functions/create-ticket/create-ticket.component';
import { CreateInfoComponent } from './infomations/create-info/create-info.component';
import { InformationComponent } from './infomations/information/information.component';
import { HeaderComponent } from './menu/header/header.component';
import { TicketCreateComponent } from './tickets/ticket-create/ticket-create.component';
import { TicketEditComponent } from './tickets/ticket-edit/ticket-edit.component';
import { TicketListComponent } from './tickets/ticket-list/ticket-list.component';

const routes: Routes = [
  {path: '',
    redirectTo: 'login',
    pathMatch: 'full',},
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HeaderComponent, children: [
    { path: 'list', component: TicketListComponent},
    { path: 'create', component: TicketCreateComponent},
    { path: 'list/edit/:ticketId', component: TicketEditComponent, canActivate: [AuthGuard] },
    { path: 'setting', component: InformationComponent, canActivate: [AuthGuard] },
    
  ] },
  { path: 'shop/info',component: CreateInfoComponent, canActivate: [AuthGuard] },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {

}

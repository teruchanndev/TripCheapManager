import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';


import { CreateTicketComponent } from './functions/create-ticket/create-ticket.component';
import { TicketEditComponent } from './tickets/ticket-edit/ticket-edit.component';

const routes: Routes = [
  { path: '', component: CreateTicketComponent },
  { path: 'edit/:ticketId', component: TicketEditComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {

}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { CreateTicketComponent } from './functions/create-ticket/create-ticket.component';
import { TicketEditComponent } from './tickets/ticket-edit/ticket-edit.component';

const routes: Routes = [
  { path: '', component: CreateTicketComponent },
  { path: 'edit/:ticketId', component: TicketEditComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { CreateTicketComponent } from './functions/create-ticket/create-ticket.component';

const routes: Routes = [
  { path: '', component: CreateTicketComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}

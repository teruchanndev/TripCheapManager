import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { CreateTicketComponent } from "./functions/create-ticket/create-ticket.component";

const routes: Routes = [
  { path: '', component: CreateTicketComponent },
  { path: 'create', component: CreateTicketComponent },
  { path: 'edit/:postId', component: CreateTicketComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

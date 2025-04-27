import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceRoutingModule } from './workspace-routing.module';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {ListWorkspacesComponent} from './list-workspaces/list-workspaces.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    WorkspaceRoutingModule,
    FormsModule,
    HttpClientModule,
    ListWorkspacesComponent
  ]
})
export class WorkspaceModule { }

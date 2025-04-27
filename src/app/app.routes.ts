import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListWorkspacesComponent } from './workspace/list-workspaces/list-workspaces.component';
import { WorkspaceFormComponent } from './workspace/workspace-form/workspace-form.component';
import { WorkflowFormComponent } from './workflow/workflow-form/workflow-form.component';
import { WorkflowComponent } from './workflow/workflow/workflow.component';
import { LandingComponent } from './landing/landing.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProjectComponent } from './project/project/project.component';
import { TaskComponent } from './task/task/task.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthGuard } from './AuthGuard';
import { CollaborationComponent } from './collaboration/collaboration.component';
import { ProjectFormComponent } from './project/project-form/project-form.component';
import { TaskFormComponent } from './task/task-form/task-form.component';
import { ListGoalsComponent } from './goal/list-goals.component';
import { GoalFormComponent } from './goal/goal-form.component';
import { ListRewardsComponent } from './reward/list-rewards.component';
import { RewardFormComponent } from './reward/reward-form.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ListPartnershipComponent } from './strategicparternship/partnership-list/partnership-list.component';
import { AddPartnershipComponent } from './strategicparternship/add-partnership/add-partnership.component';

// Layouts
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import {PrivateLayoutComponent} from './layouts/private-layout/private-layout.component';
import {CalendarComponent} from './app/calendar/calendar.component';

import { ColumnComponent } from './column/column/column.component';
import { ColumnFormComponent } from './column/column-form/column-form.component';
import { ListBoardComponent } from './kanban/list-board/list-board.component';
import { FormBoardComponent } from './kanban/form-board/form-board.component';
import { BoardComponent } from './kanban/board/board.component';

import {PredictWorkflowComponent} from './predict-workflow/predict-workflow.component';
import {UserDetailComponent} from './user/user-detail/user-detail.component';
import {
  UpdatePartnershipComponent
} from './strategicparternship/update-partnership/update-partnership.component';
import {UserUpdateComponent} from './user/user-update/user-update.component';
import {StatsComponent} from './stats/stats.component';
import {ResetPasswordComponent} from './auth/reset-password/reset-password.component';
import {NoAuthGuardService} from './no-auth-guard.service';
import {WorkflowCalendarComponent} from './workflow-calendar/workflow-calendar.component';
import {
  StrategicPartenershipCalendarComponent
} from './strategic-partenership-calendar/strategic-partenership-calendar.component';
import {GoalCalendarComponent} from './goal-calendar/goal-calendar.component';
import {ProjectCalendarComponent} from './project-calendar/project-calendar.component';

import {GoalStatsComponent} from './goal-stats/goal-stats.component';
import {
  StrategicPartenershipStatsComponent
} from './strategic-partenership-stats/strategic-partenership-stats.component';
import {ProjectStatsComponent} from './project-stats/project-stats.component';
import {AllStatsComponent} from './all-stats/all-stats.component';
import { ChatComponent } from './chat/chat.component';


export const routes: Routes = [

  // PUBLIC ROUTES (No sidebar)
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignUpComponent },
      { path: 'home', component: LandingComponent },
      { path: 'forgetpassword', component: ForgotPasswordComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },

  // AUTHENTICATED ROUTES (With sidebar)
  {
    path: '',
    component: PrivateLayoutComponent,
    canActivate: [AuthGuard], // Protect all below routes
      children: [
        {
          path: 'login',
          component: LoginComponent,
          canActivate: [NoAuthGuardService] // <-- Blocks if already logged in
        },
        {
          path: 'signup',
          component: SignUpComponent,
          canActivate: [NoAuthGuardService] // <-- Blocks if already logged in
        },
        { path: 'reset-password', component: ResetPasswordComponent },
        { path: 'users', component: UserDetailComponent },
        {path: 'users/:id', component: UserDetailComponent, title: 'User Details'},
        { path: 'users/edit/:id', component: UserUpdateComponent },
        { path: 'dashboard', component: DashboardComponent },
        { path: 'workspaces', component: ListWorkspacesComponent },
        { path: 'workspaces/add', component: WorkspaceFormComponent },
        { path: 'workspaces/edit/:id', component: WorkspaceFormComponent },
        { path: 'calender', component: CalendarComponent},
        { path: 'workflows', component: WorkflowComponent },
        { path: 'workflows/add', component: WorkflowFormComponent },
        { path: 'workflows/edit/:id', component: WorkflowFormComponent },
        { path: 'collaborations', component: CollaborationComponent },
        { path: 'chat/:id', component: ChatComponent },
        { path: 'goals', component: ListGoalsComponent },
        { path: 'goals/add', component: GoalFormComponent },
        { path: 'goals/edit/:id', component: GoalFormComponent },
        { path: 'goals/calender', component: CalendarComponent},
        { path: 'rewards', component: ListRewardsComponent },
        { path: 'rewards/add', component: RewardFormComponent },
        { path: 'rewards/edit/:id', component: RewardFormComponent },
        { path: 'projects', component: ProjectComponent },
        { path: 'projects/add', component: ProjectFormComponent },
        { path: 'projects/edit/:id', component: ProjectFormComponent },
        { path: 'tasks', component: TaskComponent },
        { path: 'tasks/add', component: TaskFormComponent },
        { path: 'tasks/edit/:id', component: TaskFormComponent },
        { path: 'columns', component: ColumnComponent },
        { path: 'columns/add', component: ColumnFormComponent },
        { path: 'columns/edit/:id', component: ColumnFormComponent },
        { path: 'boards', component: ListBoardComponent },
        { path: 'boards/add', component: FormBoardComponent },
        { path: 'boards/edit/:id', component: FormBoardComponent },
        { path: 'kanban/:id', component: BoardComponent },
        { path: 'partnerships', component: ListPartnershipComponent },
        { path: 'add-partnership', component: AddPartnershipComponent },
        {path: 'partnerships/edit/:id', component: UpdatePartnershipComponent},
        { path: 'calender', component: CalendarComponent},
        { path: 'workflows/predict', component: PredictWorkflowComponent},
        { path: 'workflows/stats', component: StatsComponent},
        { path: 'workflows/calendar', component: WorkflowCalendarComponent},
        { path: 'partnerships/calendar', component: StrategicPartenershipCalendarComponent},
        { path: 'goals/calendar', component: GoalCalendarComponent},
        { path: 'projects/calendar', component: ProjectCalendarComponent},
        { path: 'partnerships/stats', component: StrategicPartenershipStatsComponent},
        { path: 'goals/stats', component: GoalStatsComponent},
        { path: 'projects/stats', component: ProjectStatsComponent},
        { path: 'allStats', component: AllStatsComponent}

        //AllStatsComponent

      ]
  },

  // 404 Route
  { path: '**', component: NotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

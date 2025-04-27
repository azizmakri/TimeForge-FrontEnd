import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GoalFormComponent} from '../goal/goal-form.component';
import {RewardFormComponent} from '../reward/reward-form.component';
import {ListGoalsComponent} from '../goal/list-goals.component';
import {ListRewardsComponent} from '../reward/list-rewards.component';


const routes: Routes = [
  { path: 'goals', component: ListGoalsComponent },
  { path: 'add-goal', component: GoalFormComponent },
  { path: 'rewards', component: ListRewardsComponent },
  { path: 'add-reward', component: RewardFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Remplacé forChild par forRoot car c'est le module principal
  exports: [RouterModule]
})
export class AppRoutingModule { }

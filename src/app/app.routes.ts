import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectLandingComponent } from './project/project-landing/project-landing.component';
import { ProjectDetailsComponent } from './project/project-details/project-details.component';
import { CreateProjectComponent } from './project/create-project/create-project.component';
import { AuthGuard } from './core/guard/auth.guard';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { WebsiteLandingPageComponent } from './project/website-landing-page/website-landing-page.component';
import { SprintDetailsComponent } from './project/sprint-details/sprint-details.component';
export const routes: Routes = [
  { path: '', redirectTo: '/product', pathMatch: 'full' },
  { path: 'product', component: WebsiteLandingPageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'landing', component: ProjectLandingComponent , canActivate: [AuthGuard]},  
  { path: 'project/:id', component: ProjectDetailsComponent, canActivate: [AuthGuard] },
  { path: 'project/:projectId/sprint/:sprintId', component: SprintDetailsComponent , canActivate: [AuthGuard]},
  {path:'**',redirectTo:'product'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
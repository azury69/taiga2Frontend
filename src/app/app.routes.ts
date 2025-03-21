import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectLandingComponent } from './project-landing/project-landing.component';
import { ProjectDetailsComponent } from './project/project-details/project-details.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { AuthGuard } from './core/guard/auth.guard';
import { WebsiteLandingPageComponent } from './landing/website-landing-page/website-landing-page.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
export const routes: Routes = [
  { path: '', redirectTo: '/product', pathMatch: 'full' },
  { path: 'product', component: WebsiteLandingPageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'landing', component: ProjectLandingComponent , canActivate: [AuthGuard]},  
  { path: 'project/:id', component: ProjectDetailsComponent, canActivate: [AuthGuard] },
  { path: 'create-project', component: CreateProjectComponent , canActivate: [AuthGuard]},

  {path:'**',redirectTo:'product'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CandidateDashboardComponent } from './components/candidate-dashboard/candidate-dashboard.component';
import { RecruiterDashboardComponent } from './components/recruiter-dashboard/recruiter-dashboard.component';
import { CreateJobOfferComponent } from './components/create-job-offer/create-job-offer.component';
import { ViewAllOffersComponent } from './components/view-all-offers/view-all-offers.component';
import { OfferDetailsComponent } from './components/offer-details/offer-details.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { CreateCategoryComponent } from './components/create-category/create-category.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { AuthGuard } from './services/auth.guard';
import { AppliedJobsComponent } from './components/applied-jobs/applied-jobs.component';
import { ProfileSettingsCandidateComponent } from './components/profile-settings-candidate/profile-settings-candidate.component';
import { CompanyListComponent } from './components/company-list/company-list.component';
import { CompanyDetailsComponent } from './components/company-details/company-details.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'recruiter-dashboard', component: RecruiterDashboardComponent, canActivate: [AuthGuard] },
  { path: 'recruiter-dashboard/create-job', component: CreateJobOfferComponent, canActivate: [AuthGuard] },
  { path: 'recruiter-dashboard/view-all', component: ViewAllOffersComponent, canActivate: [AuthGuard] },
  { path: 'recruiter/job-offer/:id', component: OfferDetailsComponent, canActivate: [AuthGuard] },
  { path: 'recruiter-dashboard/categories', component: CategoriesComponent, canActivate: [AuthGuard] },
  { path: 'recruiter-dashboard/create-category', component: CreateCategoryComponent, canActivate: [AuthGuard] },
  { path: 'recruiter-dashboard/profile-settings', component: ProfileSettingsComponent, canActivate: [AuthGuard] },
  { path: 'candidate-dashboard', component: CandidateDashboardComponent, canActivate: [AuthGuard] },
  { path: 'candidate-dashboard/profile-settings-candidate', component: ProfileSettingsCandidateComponent, canActivate: [AuthGuard] },
  { path: 'candidate-dashboard/applied-jobs', component: AppliedJobsComponent, canActivate: [AuthGuard] },
  { path: 'candidate-dashboard/companies', component: CompanyListComponent, canActivate: [AuthGuard] },
  { path: 'company-details/:id', component: CompanyDetailsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
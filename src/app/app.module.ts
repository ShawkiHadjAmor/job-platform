import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CandidateDashboardComponent } from './components/candidate-dashboard/candidate-dashboard.component';
import { RecruiterDashboardComponent } from './components/recruiter-dashboard/recruiter-dashboard.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { AuthService } from './services/auth.service';
import { JobService } from './services/job.service';
import { ProfileService } from './services/profile.service';
import { ProfilerecService } from './services/profilerec.service';
import { ReviewService } from './services/review.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CandidateCvModalComponent } from './components/candidate-cv-modal/candidate-cv-modal.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { CreateJobOfferComponent } from './components/create-job-offer/create-job-offer.component';
import { ViewAllOffersComponent } from './components/view-all-offers/view-all-offers.component';
import { OfferDetailsComponent } from './components/offer-details/offer-details.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { CreateCategoryComponent } from './components/create-category/create-category.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { ProfileSettingsCandidateComponent } from './components/profile-settings-candidate/profile-settings-candidate.component';
import { AppliedJobsComponent } from './components/applied-jobs/applied-jobs.component';
import { JobSearchComponent } from './components/job-search/job-search.component';
import { CompanyListComponent } from './components/company-list/company-list.component';
import { CompanyDetailsComponent } from './components/company-details/company-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    CandidateDashboardComponent,
    RecruiterDashboardComponent,
    HeaderComponent,
    CandidateCvModalComponent,
    SidebarComponent,
    CreateJobOfferComponent,
    ViewAllOffersComponent,
    OfferDetailsComponent,
    CategoriesComponent,
    CreateCategoryComponent,
    ProfileSettingsComponent,
    ProfileSettingsCandidateComponent,
    AppliedJobsComponent,
    JobSearchComponent,
    CompanyListComponent,
    CompanyDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [AuthService, JobService, ProfileService, ProfilerecService, ReviewService],
  bootstrap: [AppComponent]
})
export class AppModule { }
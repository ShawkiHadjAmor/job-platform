import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EmailValidatorService } from 'src/app/services/email-validator.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class RegisterComponent {
  userForm: FormGroup;
  candidateProfileForm: FormGroup;
  recruiterForm: FormGroup;
  step3Form: FormGroup;
  step4Form: FormGroup;
  skillsForm: FormGroup;
  showCandidateForm = false;
  showRecruiterForm = false;
  step = 1;
  recruiterStep = 1;
  candidatePhoto: string | null = null;
  recruiterPhoto: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router,
    private emailValidatorService: EmailValidatorService
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email], [this.emailAsyncValidator()]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.candidateProfileForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      nationality: [''],
      age: [null],
      photo: [null]
    });

    this.recruiterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email], [this.emailAsyncValidator()]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      companyName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      description: [''],
      logo: [null]
    });

    this.step3Form = this.fb.group({
      languages: this.fb.array([]),
      socialMediaLinks: this.fb.array([])
    });

    this.step4Form = this.fb.group({
      educations: this.fb.array([]),
      experiences: this.fb.array([])
    });

    this.skillsForm = this.fb.group({
      skills: this.fb.array([])
    });
  }

  emailAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      return this.emailValidatorService.checkEmail(control.value).pipe(
        map(exists => (exists ? { emailExists: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  get languages() {
    return this.step3Form.get('languages') as FormArray;
  }

  get socialMediaLinks() {
    return this.step3Form.get('socialMediaLinks') as FormArray;
  }

  get experiences() {
    return this.step4Form.get('experiences') as FormArray;
  }

  get educations() {
    return this.step4Form.get('educations') as FormArray;
  }

  get skills() {
    return this.skillsForm.get('skills') as FormArray;
  }

  addLanguage() {
    this.languages.push(this.fb.control('', Validators.required));
  }

  removeLanguage(index: number) {
    this.languages.removeAt(index);
  }

  addSocialMediaLink() {
    this.socialMediaLinks.push(this.fb.control(''));
  }

  removeSocialMediaLink(index: number) {
    this.socialMediaLinks.removeAt(index);
  }

  addExperience() {
    this.experiences.push(this.fb.group({
      company: ['', Validators.required],
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      description: ['']
    }));
  }

  removeExperience(index: number) {
    this.experiences.removeAt(index);
  }

  addEducation() {
    this.educations.push(this.fb.group({
      degree: ['', Validators.required],
      university: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['']
    }));
  }

  removeEducation(index: number) {
    this.educations.removeAt(index);
  }

  addSkill() {
    this.skills.push(this.fb.control('', Validators.required));
  }

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  triggerFileInput(id: string) {
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) {
      input.click();
    }
  }

  onFileChange(event: any, type: string) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        if (type === 'candidatePhoto') {
          this.candidateProfileForm.patchValue({ photo: base64 });
          this.candidatePhoto = reader.result as string;
        } else if (type === 'recruiterPhoto') {
          this.recruiterForm.patchValue({ logo: base64 });
          this.recruiterPhoto = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  nextStep() {
    switch (this.step) {
      case 1:
        this.userForm.markAllAsTouched();
        if (this.userForm.valid) {
          this.step++;
        }
        break;
      case 2:
        this.candidateProfileForm.markAllAsTouched();
        if (this.candidateProfileForm.valid) {
          this.step++;
        }
        break;
      case 3:
        this.step3Form.markAllAsTouched();
        if (this.step3Form.valid) {
          this.step++;
        }
        break;
      case 4:
        this.step4Form.markAllAsTouched();
        if (this.step4Form.valid) {
          this.step++;
        }
        break;
    }
  }

  previousStep() {
    if (this.step > 1) {
      this.step--;
    } else {
      this.showCandidateForm = false;
    }
  }

  nextRecruiterStep() {
    switch (this.recruiterStep) {
      case 1:
        this.recruiterForm.markAllAsTouched();
        if (this.recruiterForm.get('email')?.valid && this.recruiterForm.get('password')?.valid) {
          this.recruiterStep++;
        }
        break;
      case 2:
        this.recruiterForm.markAllAsTouched();
        if (this.recruiterForm.get('companyName')?.valid && this.recruiterForm.get('address')?.valid && this.recruiterForm.get('phone')?.valid) {
          this.recruiterStep++;
        }
        break;
      case 3:
        this.recruiterStep++;
        break;
    }
  }

  previousRecruiterStep() {
    if (this.recruiterStep > 1) {
      this.recruiterStep--;
    } else {
      this.showRecruiterForm = false;
    }
  }

  registerCandidate() {
    if (this.userForm.valid && this.candidateProfileForm.get('name')?.valid && this.skillsForm.valid) {
      const candidateData = {
        email: this.userForm.value.email,
        password: this.userForm.value.password,
        name: this.candidateProfileForm.value.name,
        description: this.candidateProfileForm.value.description,
        nationality: this.candidateProfileForm.value.nationality,
        age: this.candidateProfileForm.value.age,
        languages: this.step3Form.value.languages.filter((lang: string) => lang.trim() !== ''),
        socialMediaLinks: this.step3Form.value.socialMediaLinks.filter((link: string) => link.trim() !== ''),
        photo: this.candidateProfileForm.value.photo
      };

      this.authService.registerCandidate(candidateData).subscribe({
        next: (response: any) => {
          const profileData = {
            name: candidateData.name,
            description: candidateData.description,
            nationality: candidateData.nationality,
            age: candidateData.age,
            languages: candidateData.languages,
            socialMediaLinks: candidateData.socialMediaLinks,
            photo: candidateData.photo
          };
          this.profileService.updateCandidateProfile(profileData).subscribe({
            next: () => {
              const addExperiences = this.step4Form.value.experiences.map((exp: any) =>
                this.profileService.addExperience(exp).toPromise().catch(err => {
                  console.error('Error adding experience:', err);
                  throw err;
                })
              );
              const addEducations = this.step4Form.value.educations.map((edu: any) =>
                this.profileService.addEducation(edu).toPromise().catch(err => {
                  console.error('Error adding education:', err);
                  throw err;
                })
              );
              const addSkills = this.skillsForm.value.skills.map((skill: string) =>
                this.profileService.addSkill({ name: skill }).toPromise().catch(err => {
                  console.error('Error adding skill:', err);
                  throw err;
                })
              );

              Promise.all([...addExperiences, ...addEducations, ...addSkills])
                .then(() => {
                  this.showToast('Registration successful!');
                  this.router.navigate(['/candidate-dashboard']);
                })
                .catch((err) => {
                  this.showToast('Failed to add profile details: ' + err.message);
                });
            },
            error: (err: any) => this.showToast('Profile update failed: ' + err.message)
          });
        },
        error: (err: any) => this.showToast('Registration failed: ' + err.message)
      });
    } else {
      this.showToast('Please fill all required fields correctly.');
    }
  }

  registerRecruiter() {
    if (this.recruiterForm.valid) {
      const recruiterData = {
        email: this.recruiterForm.value.email,
        password: this.recruiterForm.value.password,
        companyName: this.recruiterForm.value.companyName,
        address: this.recruiterForm.value.address,
        phone: this.recruiterForm.value.phone,
        description: this.recruiterForm.value.description,
        logo: this.recruiterForm.value.logo
      };
      this.authService.registerRecruiter(recruiterData).subscribe({
        next: () => {
          this.showToast('Registration successful!');
          this.router.navigate(['/recruiter-dashboard']);
        },
        error: (err: any) => this.showToast('Registration failed: ' + err.message)
      });
    } else {
      this.showToast('Please fill all required fields correctly.');
    }
  }

  showToast(message: string) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    if (toast && toastMessage) {
      toastMessage.textContent = message;
      toast.classList.remove('hidden');
      toast.classList.add('bg-green-500');
      if (message.includes('failed')) {
        toast.classList.remove('bg-green-500');
        toast.classList.add('bg-red-500');
      }
      setTimeout(() => {
        toast.classList.add('hidden');
      }, 3000);
    }
  }
}
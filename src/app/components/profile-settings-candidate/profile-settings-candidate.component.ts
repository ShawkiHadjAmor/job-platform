import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-settings-candidate',
  templateUrl: './profile-settings-candidate.component.html'
})
export class ProfileSettingsCandidateComponent implements OnInit {
  profileForm: FormGroup;
  educationForm: FormGroup;
  experienceForm: FormGroup;
  skillForm: FormGroup;
  emailForm: FormGroup;
  passwordForm: FormGroup;
  educations: any[] = [];
  experiences: any[] = [];
  skills: any[] = [];
  languages: string[] = [];
  socialMediaLinks: string[] = [];
  photo: string | null = null;
  showEducationModal = false;
  showExperienceModal = false;
  showSkillModal = false;
  showEmailModal = false;
  showPasswordModal = false;
  showSettingsDropdown = false;
  isEditEducation = false;
  isEditExperience = false;
  isEditSkill = false;
  currentEducationId: number | null = null;
  currentExperienceId: number | null = null;
  currentSkillId: number | null = null;
  editModes: { [key: string]: boolean } = {};

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      description: [''],
      nationality: [''],
      age: [null],
      languages: [[]],
      socialMediaLinks: [[]],
      photo: [null]
    });

    this.educationForm = this.fb.group({
      degree: ['', Validators.required],
      university: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['']
    });

    this.experienceForm = this.fb.group({
      company: ['', Validators.required],
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      description: ['']
    });

    this.skillForm = this.fb.group({
      name: ['', Validators.required]
    });

    this.emailForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newEmail: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.profileService.getCandidateProfile().subscribe({
      next: (data) => {
        this.profileForm.patchValue({
          name: data.name,
          email: data.user.email,
          description: data.description,
          nationality: data.nationality,
          age: data.age,
          languages: data.languages || [],
          socialMediaLinks: data.socialMediaLinks || []
        });
        this.languages = data.languages || [];
        this.socialMediaLinks = data.socialMediaLinks || [];
        this.photo = data.photo ? `data:image/jpeg;base64,${data.photo}` : null;
        this.educations = data.educations || [];
        this.experiences = data.experiences || [];
        this.skills = data.skills || [];
      },
      error: (err) => this.showToast('Failed to load profile: ' + err.message)
    });
  }

  toggleEdit(field: string) {
    this.editModes[field] = !this.editModes[field];
  }

  toggleSettingsDropdown() {
    this.showSettingsDropdown = !this.showSettingsDropdown;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        this.profileForm.patchValue({ photo: base64 });
        this.photo = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  updateProfile() {
    if (this.profileForm.valid) {
      const profileData = {
        name: this.profileForm.value.name,
        description: this.profileForm.value.description,
        socialMediaLinks: this.socialMediaLinks.filter(link => link.trim() !== ''),
        nationality: this.profileForm.value.nationality,
        age: this.profileForm.value.age,
        languages: this.languages.filter(lang => lang.trim() !== ''),
        photo: this.profileForm.value.photo || (this.photo ? this.photo.split(',')[1] : null)
      };
      this.profileService.updateCandidateProfile(profileData).subscribe({
        next: () => {
          this.showToast('Profile updated successfully');
          Object.keys(this.editModes).forEach(key => this.editModes[key] = false);
        },
        error: (err) => this.showToast('Profile update failed: ' + err.message)
      });
    } else {
      this.showToast('Please fill all required fields correctly.');
    }
  }

  openEmailModal() {
    this.emailForm.reset();
    this.showEmailModal = true;
    this.showSettingsDropdown = false;
  }

  closeEmailModal() {
    this.showEmailModal = false;
  }

  updateEmail() {
    if (this.emailForm.valid) {
      const { currentPassword, newEmail } = this.emailForm.value;
      this.profileService.updateEmail({ currentPassword, newEmail }).subscribe({
        next: () => {
          this.showSuccessToast('Email updated successfully. Please log in again.');
          this.closeEmailModal();
          this.authService.logout();
        },
        error: (err) => this.showToast('Error updating email: ' + err.message)
      });
    } else {
      this.showToast('Please fill all required fields correctly.');
    }
  }

  openPasswordModal() {
    this.passwordForm.reset();
    this.showPasswordModal = true;
    this.showSettingsDropdown = false;
  }

  closePasswordModal() {
    this.showPasswordModal = false;
  }

  updatePassword() {
    if (this.passwordForm.valid) {
      const { currentPassword, newPassword } = this.passwordForm.value;
      this.profileService.updatePassword({ currentPassword, newPassword }).subscribe({
        next: () => {
          this.showSuccessToast('Password updated successfully. Please log in again.');
          this.closePasswordModal();
          this.authService.logout();
        },
        error: (err) => this.showToast('Error updating password: ' + err.message)
      });
    } else {
      this.showToast('Please fill all required fields correctly.');
    }
  }

  private passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  addLanguage() {
    this.languages.push('');
    this.editModes['language' + (this.languages.length - 1)] = true;
  }

  removeLanguage(index: number) {
    this.languages.splice(index, 1);
    delete this.editModes['language' + index];
  }

  addSocialMediaLink() {
    this.socialMediaLinks.push('');
    this.editModes['socialMediaLink' + (this.socialMediaLinks.length - 1)] = true;
  }

  removeSocialMediaLink(index: number) {
    this.socialMediaLinks.splice(index, 1);
    delete this.editModes['socialMediaLink' + index];
  }

  openAddEducationModal() {
    this.educationForm.reset();
    this.isEditEducation = false;
    this.currentEducationId = null;
    this.showEducationModal = true;
  }

  openEditEducationModal(edu: any) {
    this.educationForm.patchValue({
      degree: edu.degree,
      university: edu.university,
      startDate: edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : '',
      endDate: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : ''
    });
    this.isEditEducation = true;
    this.currentEducationId = edu.id;
    this.showEducationModal = true;
  }

  closeEducationModal() {
    this.showEducationModal = false;
    this.educationForm.reset();
  }

  saveEducation() {
    const educationData = this.educationForm.value;
    if (this.isEditEducation && this.currentEducationId) {
      this.profileService.updateEducation(this.currentEducationId, educationData).subscribe({
        next: (response) => {
          const index = this.educations.findIndex(e => e.id === this.currentEducationId);
          this.educations[index] = response;
          this.showToast('Education updated successfully');
          this.closeEducationModal();
        },
        error: (err) => this.showToast('Education update failed: ' + err.message)
      });
    } else {
      this.profileService.addEducation(educationData).subscribe({
        next: (response) => {
          this.educations.push(response);
          this.showToast('Education added successfully');
          this.closeEducationModal();
        },
        error: (err) => this.showToast('Education add failed: ' + err.message)
      });
    }
  }

  deleteEducation(id: number) {
    this.profileService.deleteEducation(id).subscribe({
      next: () => {
        this.educations = this.educations.filter(e => e.id !== id);
        this.showToast('Education deleted successfully');
      },
      error: (err) => this.showToast('Education deletion failed: ' + err.message)
    });
  }

  openAddExperienceModal() {
    this.experienceForm.reset();
    this.isEditExperience = false;
    this.currentExperienceId = null;
    this.showExperienceModal = true;
  }

  openEditExperienceModal(exp: any) {
    this.experienceForm.patchValue({
      company: exp.company,
      title: exp.title,
      startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
      description: exp.description
    });
    this.isEditExperience = true;
    this.currentExperienceId = exp.id;
    this.showExperienceModal = true;
  }

  closeExperienceModal() {
    this.showExperienceModal = false;
    this.experienceForm.reset();
  }

  saveExperience() {
    const experienceData = this.experienceForm.value;
    if (this.isEditExperience && this.currentExperienceId) {
      this.profileService.updateExperience(this.currentExperienceId, experienceData).subscribe({
        next: (response) => {
          const index = this.experiences.findIndex(e => e.id === this.currentExperienceId);
          this.experiences[index] = response;
          this.showToast('Experience updated successfully');
          this.closeExperienceModal();
        },
        error: (err) => this.showToast('Experience update failed: ' + err.message)
      });
    } else {
      this.profileService.addExperience(experienceData).subscribe({
        next: (response) => {
          this.experiences.push(response);
          this.showToast('Experience added successfully');
          this.closeExperienceModal();
        },
        error: (err) => this.showToast('Experience add failed: ' + err.message)
      });
    }
  }

  deleteExperience(id: number) {
    this.profileService.deleteExperience(id).subscribe({
      next: () => {
        this.experiences = this.experiences.filter(e => e.id !== id);
        this.showToast('Experience deleted successfully');
      },
      error: (err) => this.showToast('Experience deletion failed: ' + err.message)
    });
  }

  openAddSkillModal() {
    this.skillForm.reset();
    this.isEditSkill = false;
    this.currentSkillId = null;
    this.showSkillModal = true;
  }

  openEditSkillModal(skill: any) {
    this.skillForm.patchValue({ name: skill.name });
    this.isEditSkill = true;
    this.currentSkillId = skill.id;
    this.showSkillModal = true;
  }

  closeSkillModal() {
    this.showSkillModal = false;
    this.skillForm.reset();
  }

  saveSkill() {
    const skillData = this.skillForm.value;
    if (this.isEditSkill && this.currentSkillId) {
      this.profileService.updateSkill(this.currentSkillId, skillData).subscribe({
        next: (response) => {
          const index = this.skills.findIndex(s => s.id === this.currentSkillId);
          this.skills[index] = response;
          this.showToast('Skill updated successfully');
          this.closeSkillModal();
        },
        error: (err) => this.showToast('Skill update failed: ' + err.message)
      });
    } else {
      this.profileService.addSkill(skillData).subscribe({
        next: (response) => {
          this.skills.push(response);
          this.showToast('Skill added successfully');
          this.closeSkillModal();
        },
        error: (err) => this.showToast('Skill add failed: ' + err.message)
      });
    }
  }

  deleteSkill(id: number) {
    this.profileService.deleteSkill(id).subscribe({
      next: () => {
        this.skills = this.skills.filter(s => s.id !== id);
        this.showToast('Skill deleted successfully');
      },
      error: (err) => this.showToast('Skill deletion failed: ' + err.message)
      });
  }

  showToast(message: string) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    if (toast && toastMessage) {
      toastMessage.textContent = message;
      toast.classList.remove('hidden');
      toast.classList.add('bg-green-500');
      if (message.includes('failed') || message.includes('Error')) {
        toast.classList.remove('bg-green-500');
        toast.classList.add('bg-red-500');
      }
      setTimeout(() => {
        toast.classList.add('hidden');
      }, 3000);
    }
  }

  showSuccessToast(message: string) {
    this.showToast(message);
  }
}
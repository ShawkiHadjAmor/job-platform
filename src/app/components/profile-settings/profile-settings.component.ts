import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProfilerecService } from 'src/app/services/profilerec.service';
import { ReviewService } from 'src/app/services/review.service'; // Added

interface RecruiterProfileDTO {
  id: number;
  companyName: string;
  address: string;
  phone: string;
  description: string;
  logo?: string;
  user: { id: number; email: string; role?: string; createdDate?: string; lastModifiedDate?: string };
  createdDate: string;
  lastModifiedDate?: string;
}

interface ReviewDTO {
  rating: number;
  comment: string;
  reviewerName: string;
  reviewDate: string;
}

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  emailForm: FormGroup;
  profileData?: RecruiterProfileDTO;
  reviews: ReviewDTO[] = []; // Added for reviews
  showProfileModal = false;
  showEmailModal = false;
  showPasswordModal = false;
  toastMessage = '';
  showToast = false;
  photoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfilerecService,
    private authService: AuthService,
    private reviewService: ReviewService // Added
  ) {
    this.profileForm = this.fb.group({
      companyName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      description: [''],
      logo: [null]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

    this.emailForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newEmail: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.profileService.getRecruiterProfile().subscribe({
      next: (profile: RecruiterProfileDTO) => {
        console.log('Profile loaded:', profile);
        this.profileData = profile;
        this.profileForm.patchValue({
          companyName: profile.companyName,
          address: profile.address,
          phone: profile.phone,
          description: profile.description
        });
        this.photoPreview = this.getLogoUrl();
        this.loadReviews(profile.id); // Load reviews
      },
      error: (err) => {
        console.error('Failed to load profile:', err);
        this.showErrorToast('Failed to load profile');
      }
    });
  }

  loadReviews(recruiterId: number): void {
    this.reviewService.getReviewsForRecruiter(recruiterId).subscribe({
      next: (reviews) => {
        console.log('Reviews loaded:', reviews);
        this.reviews = reviews || [];
      },
      error: (err) => {
        console.error('Failed to load reviews:', err);
        this.showErrorToast('Failed to load reviews');
      }
    });
  }

  getLogoUrl(): string {
    if (!this.profileData?.logo) {
      console.log('No logo available');
      return '';
    }
    try {
      return `data:image/png;base64,${this.profileData.logo}`;
    } catch (err) {
      console.error('Error processing logo:', err);
      this.showErrorToast('Error displaying logo');
      return '';
    }
  }

  onLogoFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1]; // Remove prefix
        try {
          this.profileForm.patchValue({ logo: base64 });
          this.photoPreview = reader.result as string;
          console.log('Logo base64:', base64.slice(0, 10), '...');
        } catch (err) {
          console.error('Error processing logo file:', err);
          this.showErrorToast('Invalid logo file');
        }
      };
      reader.onerror = () => {
        this.showErrorToast('Failed to read logo file');
      };
      reader.readAsDataURL(file);
    }
  }

  openProfileModal() {
    this.profileForm.patchValue({
      companyName: this.profileData?.companyName,
      address: this.profileData?.address,
      phone: this.profileData?.phone,
      description: this.profileData?.description,
      logo: null
    });
    this.photoPreview = this.getLogoUrl();
    this.showProfileModal = true;
  }

  closeProfileModal() {
    this.showProfileModal = false;
    this.photoPreview = null;
    this.profileForm.patchValue({ logo: null });
  }

  openEmailModal() {
    this.emailForm.patchValue({
      newEmail: this.profileData?.user?.email || ''
    });
    this.showEmailModal = true;
  }

  closeEmailModal() {
    this.showEmailModal = false;
  }

  openPasswordModal() {
    this.passwordForm.reset();
    this.showPasswordModal = true;
  }

  closePasswordModal() {
    this.showPasswordModal = false;
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      const profileUpdate: any = {
        companyName: this.profileForm.value.companyName,
        address: this.profileForm.value.address,
        phone: this.profileForm.value.phone,
        description: this.profileForm.value.description,
        logo: this.profileForm.value.logo || this.profileData?.logo
      };
      console.log('Updating profile with:', profileUpdate);
      this.profileService.updateRecruiterProfile(profileUpdate).subscribe({
        next: (profile) => {
          console.log('Profile updated:', profile);
          this.profileData = { ...this.profileData, ...profile };
          this.photoPreview = this.getLogoUrl();
          this.showSuccessToast('Profile updated successfully');
          this.closeProfileModal();
        },
        error: (err) => {
          console.error('Error updating profile:', err);
          this.showErrorToast('Error updating profile');
        }
      });
    } else {
      this.showErrorToast('Please fill all required fields correctly');
    }
  }

  updatePassword(): void {
    if (this.passwordForm.valid) {
      const { currentPassword, newPassword } = this.passwordForm.value;
      this.profileService.updatePassword({ currentPassword, newPassword }).subscribe({
        next: () => {
          this.showSuccessToast('Password updated successfully. Please log in again.');
          this.closePasswordModal();
          this.authService.logout();
        },
        error: (err) => {
          console.error('Error updating password:', err);
          this.showErrorToast('Error updating password');
        }
      });
    } else {
      this.showErrorToast('Please fill all required fields correctly');
    }
  }

  updateEmail(): void {
    if (this.emailForm.valid) {
      const { currentPassword, newEmail } = this.emailForm.value;
      this.profileService.updateEmail({ currentPassword, newEmail }).subscribe({
        next: () => {
          this.showSuccessToast('Email updated successfully. Please log in again.');
          this.closeEmailModal();
          this.authService.logout();
        },
        error: (err) => {
          console.error('Error updating email:', err);
          this.showErrorToast('Error updating email');
        }
      });
    } else {
      this.showErrorToast('Please fill all required fields correctly');
    }
  }

  private passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  showSuccessToast(message: string) {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3000);
  }

  showErrorToast(message: string) {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3000);
  }
}
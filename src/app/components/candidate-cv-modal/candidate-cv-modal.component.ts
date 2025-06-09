import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-candidate-cv-modal',
  templateUrl: './candidate-cv-modal.component.html',
  styleUrls: ['./candidate-cv-modal.component.css'] // Ensure CSS file is linked
})
export class CandidateCvModalComponent implements OnInit {
  @Input() candidateId!: number;
  @Output() close = new EventEmitter<void>();
  candidate: any = {};
  photo: string | null = null;

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    console.log('Candidate CV Modal initialized with candidateId:', this.candidateId); // Debug log
    if (this.candidateId) {
      this.profileService.getCandidateCv(this.candidateId).subscribe({
        next: (data: any) => {
          console.log('Fetched Candidate CV Data:', data); // Debug log
          this.candidate = data;
          this.photo = data.photo ? `data:image/jpeg;base64,${data.photo}` : null;
        },
        error: (err: any) => {
          console.error('Failed to load CV:', err);
          this.candidate = {}; // Reset candidate on error
        }
      });
    }
  }

  closeModal() {
    this.close.emit();
  }
}
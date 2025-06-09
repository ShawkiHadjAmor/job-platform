import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-job-search',
  templateUrl: './job-search.component.html'
})
export class JobSearchComponent {
  @Output() search = new EventEmitter<string>();

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.search.emit(target.value.trim());
  }
}
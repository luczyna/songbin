import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,
         AbstractControl,
         Validators, ValidatorFn } from '@angular/forms';

import { Segment } from '../models/segment';

@Component({
  selector: 'app-segments',
  templateUrl: './segments.component.html',
  styleUrls: ['./segments.component.scss']
})
export class SegmentsComponent implements OnInit {
  segmentForm: FormGroup;
  showForm: boolean = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    this.segmentForm = this.formBuilder.group({
      name: '',
      start: '',
      end: ''
    });
  }

  saveSegment(): void {
    let newSegment: Segment = {
      name: this.segmentForm.get('name').value,
      start: this.segmentForm.get('start').value,
      end: this.segmentForm.get('end').value,
      loop: false,
      playing: false
    };
  }

  toggleSegmentForm(): void {
    this.showForm = !this.showForm;

    if (this.showForm) {
      this.buildForm();
    }
  }
}

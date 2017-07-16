import { Component, OnInit,
         Input, Output,
         EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup,
         AbstractControl,
         Validators, ValidatorFn } from '@angular/forms';

import { Song } from '../models/song';
import { Segment } from '../models/segment';

@Component({
  selector: 'app-segments',
  templateUrl: './segments.component.html',
  styleUrls: ['./segments.component.scss']
})
export class SegmentsComponent implements OnInit {
  @Input() song: Song;
  @Output() onUpdate = new EventEmitter();

  segmentForm: FormGroup;
  showForm: boolean = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  applyValidatorsToTimes(): void {
    // TODO add duration max limit to end
    // TODO add check against whether or not time frame already exists
    let start = this.segmentForm.get('start').value;
    let end = this.segmentForm.get('end').value;

    let startValidator = [ Validators.required ];
    let endValidator = [ Validators.required ];

    if (start !== null) {
      endValidator.push(Validators.min(start + 0.1));
    }

    if (end !== null) {
      startValidator.push(Validators.max(end - 0.1));
    }

    this.segmentForm.get('start').setValidators(Validators.compose(startValidator));
    this.segmentForm.get('end').setValidators(Validators.compose(endValidator));
  }

  buildForm(): void {
    // TODO add Segment i to default name value?, based on how many exist
    // TODO add current time of video to start?
    // TODO add current time + 5 to end?
    this.segmentForm = this.formBuilder.group({
      name: ['', Validators.required],
      start: [],
      end: []
    });

    this.applyValidatorsToTimes();

    this.segmentForm.valueChanges.subscribe((data) => {
      this.applyValidatorsToTimes();
    });
  }

  saveSegment(): void {
    let name = this.segmentForm.get('name').value;
    let start = this.segmentForm.get('start').value;
    let end = this.segmentForm.get('end').value;

    let newSegment: Segment = new Segment(name, start, end);

    this.song.segments.push(newSegment);
    this.onUpdate.emit();

    this.showForm = false;
  }

  toggleSegmentForm(): void {
    this.showForm = !this.showForm;

    if (this.showForm) {
      this.buildForm();
    }
  }
}

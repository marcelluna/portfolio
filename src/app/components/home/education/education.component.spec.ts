import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { EducationComponent } from './education.component';
import { HomeModule } from '../home.module';
import { commonTestProviders } from '../../../../testing/test-providers';

describe('EducationComponent', () => {
  let component: EducationComponent;
  let fixture: ComponentFixture<EducationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeModule, TranslateModule.forRoot()],
      providers: [commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(EducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the educations from the data service', () => {
    expect(component.educations.length).toBeGreaterThan(0);
  });
});

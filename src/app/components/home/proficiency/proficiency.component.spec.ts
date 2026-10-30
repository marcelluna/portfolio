import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProficiencyComponent } from './proficiency.component';
import { commonTestProviders } from '../../../../testing/test-providers';

describe('ProficiencyComponent', () => {
  let component: ProficiencyComponent;
  let fixture: ComponentFixture<ProficiencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProficiencyComponent],
      providers: [commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProficiencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

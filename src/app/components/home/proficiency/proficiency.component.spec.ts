import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ProficiencyComponent } from './proficiency.component';
import { HomeModule } from '../home.module';
import { commonTestProviders } from '../../../../testing/test-providers';

describe('ProficiencyComponent', () => {
  let component: ProficiencyComponent;
  let fixture: ComponentFixture<ProficiencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeModule, TranslateModule.forRoot()],
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

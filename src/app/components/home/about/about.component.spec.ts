import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AboutComponent } from './about.component';
import { HomeModule } from '../home.module';
import { commonTestProviders } from '../../../../testing/test-providers';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeModule, TranslateModule.forRoot()],
      providers: [commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the descriptions from the data service', () => {
    expect(component.descriptions.length).toBeGreaterThan(0);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatsCardComponent } from './stats-card.component';

describe('StatsCardComponent', () => {
  let component: StatsCardComponent;
  let fixture: ComponentFixture<StatsCardComponent>;

  const mockStat = {
    value: 1500,
    label: 'Test Stat',
    icon: 'fa-users',
    suffix: '+'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatsCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StatsCardComponent);
    component = fixture.componentInstance;
    component.stat = mockStat;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have stat input', () => {
    expect(component.stat).toEqual(mockStat);
  });

  it('should format value', () => {
    component.stat.value = 1500000;
    component.formatValue();
    expect(component.displayValue).toBe('1.5M');
  });

  it('should get formatted value', () => {
    expect(component.getFormattedValue()).toContain('1');
  });

  it('should get icon class', () => {
    expect(component.getIconClass()).toBe('fas fa-users');
  });

  it('should get color', () => {
    expect(component.getColor()).toBe('#0055a4');
    component.stat.color = '#ff0000';
    expect(component.getColor()).toBe('#ff0000');
  });
});

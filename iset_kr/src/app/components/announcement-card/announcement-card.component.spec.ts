import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnnouncementCardComponent } from './announcement-card.component';

describe('AnnouncementCardComponent', () => {
  let component: AnnouncementCardComponent;
  let fixture: ComponentFixture<AnnouncementCardComponent>;

  const mockAnnouncement = {
    id: 1,
    number: '1.5',
    title: 'Test Announcement',
    arabicText: 'نص عربي تجريبي',
    content: 'Test content',
    priority: 'high' as const
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnnouncementCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AnnouncementCardComponent);
    component = fixture.componentInstance;
    component.announcement = mockAnnouncement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have announcement input', () => {
    expect(component.announcement).toEqual(mockAnnouncement);
  });

  it('should toggle expand', () => {
    expect(component.isExpanded).toBeFalse();
    component.toggleExpand();
    expect(component.isExpanded).toBeTrue();
    component.toggleExpand();
    expect(component.isExpanded).toBeFalse();
  });

  it('should get priority color', () => {
    expect(component.getPriorityColor()).toBe('#d32f2f');
  });

  it('should open student space', () => {
    spyOn(window, 'open');
    component.openStudentSpace();
    expect(window.open).toHaveBeenCalledWith(
      'https://isetkairouan.edx.tn/login.faces',
      '_blank',
      'noopener,noreferrer'
    );
  });
});

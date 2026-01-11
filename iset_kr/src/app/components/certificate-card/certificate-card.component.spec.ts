import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CertificateCardComponent } from './certificate-card.component';

describe('CertificateCardComponent', () => {
  let component: CertificateCardComponent;
  let fixture: ComponentFixture<CertificateCardComponent>;

  const mockCertificate = {
    id: 1,
    title: 'Test Certificate',
    standard: 'ISO 9001:2015',
    description: 'Test description',
    issuedDate: '2023-01-01',
    badge: 'SMG'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CertificateCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CertificateCardComponent);
    component = fixture.componentInstance;
    component.certificate = mockCertificate;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have certificate input', () => {
    expect(component.certificate).toEqual(mockCertificate);
  });

  it('should toggle details', () => {
    expect(component.showDetails).toBeFalse();
    component.toggleDetails();
    expect(component.showDetails).toBeTrue();
    component.toggleDetails();
    expect(component.showDetails).toBeFalse();
  });

  it('should get standard color', () => {
    expect(component.getStandardColor()).toBe('#0055a4');
  });

  it('should verify certificate', () => {
    spyOn(window, 'open');
    component.verifyCertificate();
    expect(window.open).not.toHaveBeenCalled();
    
    component.certificate.verificationUrl = 'https://verify.test';
    component.verifyCertificate();
    expect(window.open).toHaveBeenCalledWith('https://verify.test', '_blank', 'noopener,noreferrer');
  });
});

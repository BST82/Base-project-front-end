import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Re-triggered at 2026-10-18
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

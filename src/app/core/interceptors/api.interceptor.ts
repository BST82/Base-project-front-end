import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  // If request begins with /api or /uploads and is not an absolute URL
  if (req.url.startsWith('/api') || req.url.startsWith('/uploads')) {
    const baseUrl = (environment.apiUrl || '').replace(/\/+$/, '');
    const cloned = req.clone({
      url: `${baseUrl}${req.url}`
    });
    return next(cloned);
  }
  return next(req);
};

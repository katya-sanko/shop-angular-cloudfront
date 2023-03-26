import { Injectable, Injector } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class ManageProductsService extends ApiService {
  constructor(injector: Injector) {
    super(injector);
  }

  uploadProductsCSV(file: File): Observable<unknown> {
    if (!this.endpointEnabled('import')) {
      console.warn(
        'Endpoint "import" is disabled. To enable change your environment.ts config'
      );
      return EMPTY;
    }

    const token = `Basic ${localStorage.getItem('authorization_token')}`;

    console.log(token);

    return this.getPreSignedUrl(file.name, token).pipe(
      switchMap((response) => {
        const url = response;
        return this.http.put(url, file, {
          headers: {
            //eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-Type': 'text/csv',
            //eslint-disable-next-line @typescript-eslint/naming-convention
            'Access-Control-Allow-Headers': '*',
            //eslint-disable-next-line @typescript-eslint/naming-convention
            'Access-Control-Allow-Origin': '*',
          },
        });
      })
    );
  }

  private getPreSignedUrl(fileName: string, token: string): Observable<any> {
    const url = this.getUrl('import', 'import');

    return this.http.get<any>(url, {
      params: {
        name: fileName,
      },
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: token,
      },
    });
  }
}

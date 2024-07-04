import Files from '../models/Files';

export interface Download extends Files {
  file: Buffer;
}

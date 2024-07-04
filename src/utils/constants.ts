export const PAGE_LIMIT = 1;
export const SIZE_LIMIT = 10;
export const PASSWORD_REGEX = new RegExp('^(?=.*[a-zA-Z])(?=.*\\d)(?!.*\\s).{8,80}$');

export const FILE_MIMETYPES: { [key: string]: string } = {
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.documentapplication/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'image/svg+xml': 'svg'
};

export const ALLOWED_FILE_TYPES: string[] = Object.keys(FILE_MIMETYPES);
export const MAX_FILE_SIZE: number = 10 * 1024 * 1024; // 10 MB

export const TOKEN_TYPE: string = 'bearer';

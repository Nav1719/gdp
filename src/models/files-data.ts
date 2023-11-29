export interface FileData {
  id?: string;
  pdfFile: FileObj;
  txtFile: FileObj;
  authorName: string;
  year: string;
}

export interface FileObj {
  fileName: string;
  content: string;
}

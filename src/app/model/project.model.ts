/** Text localized into the supported languages (mirrors the API shape). */
export interface LocalizedText {
  en: string;
  pt: string;
}

export interface Project {
  id: number;
  title: LocalizedText;
  description: LocalizedText;
  /** Set when the project links to an uploaded file. Mutually exclusive with githubUrl. */
  fileUrl: string | null;
  /** Set when the project redirects to an external GitHub page. */
  githubUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Payload for creating a project. Exactly one of fileUrl / githubUrl must be set. */
export interface CreateProjectPayload {
  title: LocalizedText;
  description: LocalizedText;
  fileUrl?: string;
  githubUrl?: string;
}

/** Partial update payload. */
export interface UpdateProjectPayload {
  title?: LocalizedText;
  description?: LocalizedText;
  fileUrl?: string | null;
  githubUrl?: string | null;
}

/** Response shape from POST /uploads. */
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

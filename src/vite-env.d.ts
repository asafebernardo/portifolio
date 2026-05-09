/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_USERNAME?: string
  readonly VITE_ADMIN_PASSWORD?: string
  /** Email opcional para maior limite na API MyMemory (tradução PT→EN) */
  readonly VITE_TRANSLATION_EMAIL?: string
  /** Opcional: Bearer para POST /api/upload (deve coincidir com UPLOAD_SECRET no servidor). */
  readonly VITE_UPLOAD_SECRET?: string
  /** Sobrepõe o URL do POST de upload (API externa). Por omissão: /api/upload no mesmo origin. */
  readonly VITE_UPLOAD_POST_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.module.css' {
  const classes: Readonly<Record<string, string>>
  export default classes
}

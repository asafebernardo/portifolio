/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly env: Record<string, string | undefined>
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.module.css' {
  const classes: Readonly<Record<string, string>>
  export default classes
}

/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare module '*.wasm?url' {
  const url: string;
  export default url;
}

// Minimal typings for the subset of sql.js we use (package ships no types).
declare module 'sql.js' {
  export interface QueryResult {
    columns: string[];
    values: unknown[][];
  }
  export interface SqlJsDatabase {
    exec(sql: string): QueryResult[];
    close(): void;
  }
  export interface SqlJsStatic {
    Database: new (data: Uint8Array) => SqlJsDatabase;
  }
  export interface InitConfig {
    locateFile?: (file: string) => string;
  }
  export default function initSqlJs(config?: InitConfig): Promise<SqlJsStatic>;
}

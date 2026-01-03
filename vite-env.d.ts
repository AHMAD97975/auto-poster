declare module '*?raw' {
  const content: string;
  export default content;
}

declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
    GEMINI_API_KEY: string;
    [key: string]: string | undefined;
  }
}

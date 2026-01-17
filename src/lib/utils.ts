export interface Tool {
  name: string;
  description: string;
  redirectUrl: string;
}

export const tools: Tool[] = [
  {
    name: 'Encoder/Decoder',
    description: 'Encode and decode text using various algorithms.',
    redirectUrl: '/encoder-decoder',
  },
  {
    name: 'Generator',
    description: 'Generate data in various formats.',
    redirectUrl: '/generator',
  }
]
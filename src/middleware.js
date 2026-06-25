import { NextResponse } from 'next/server';

export function middleware(request) {
  // Check if the request accepts markdown
  const acceptHeader = request.headers.get('accept') || '';
  
  if (acceptHeader.includes('text/markdown')) {
    // Basic Markdown representation of the app's capabilities
    const markdownContent = `# bg-remove - Magic Background Remover

Experience the next generation of automated image editing. Remove backgrounds instantly with our advanced AI technology.

## Features
- **Erase Background**: Remove backgrounds from images (PNG, JPG, JPEG, GIF) or PDFs.
- **Erase Video Background**: Remove backgrounds from short videos.
- **Privacy First**: Files are processed securely.
- **API Access**: Discover our API capabilities at /.well-known/api-catalog.
`;
    return new NextResponse(markdownContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown',
        'x-markdown-tokens': '248' // mock token count
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/',
};

import HomeClient from '../../../components/HomeClient';

// This makes Next.js pre-render these tool routes as static HTML if possible, 
// but since we are using client components, they are rendered on client.
export default function ToolPage() {
  return <HomeClient />;
}

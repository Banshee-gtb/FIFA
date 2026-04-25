import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-24">
      <div className="text-center">
        <div className="text-8xl font-black text-blue-600 mb-4">404</div>
        <h1 className="text-3xl font-black mb-2">Page Not Found</h1>
        <p className="text-gray-400 mb-8 text-sm">The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-full text-sm transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Leaf, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Leaf
          className="w-16 h-16 text-sage-300 mx-auto mb-6"
          strokeWidth={1}
        />
        <h1 className="font-display text-8xl font-light text-forest-200 mb-2">
          404
        </h1>
        <h2 className="font-display text-2xl font-medium text-forest-700 mb-3">
          Page not found
        </h2>
        <p className="font-body text-sage-500 mb-8">
          The page you&apos;re looking for seems to have wandered off into the botanical garden.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-body text-sm text-forest-600 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to home
        </Link>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header — darker background */}
      <header className="bg-darker text-light px-8 py-4 flex items-center justify-between">
        <span className="font-bold text-lg tracking-wide">QuzSpace</span>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            to="/login"
            className="text-muted hover:text-light transition-colors"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-brand text-light px-4 py-2 rounded hover:opacity-90 transition-opacity"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center gap-5 text-center px-4">
        <h1 className="text-4xl font-bold text-darker">Welcome to QuzSpace</h1>
        <p className="text-gray max-w-md text-base">
          Your workspace is ready. Pages and features are coming soon.
        </p>

        {/* Brand-colored CTA — confirms theme is active */}
        <div className="flex gap-3 mt-2">
          <Link
            to="/dashboard"
            className="bg-brand text-light px-5 py-2 rounded font-medium hover:opacity-90 transition-opacity"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/login"
            className="border border-brand text-brand px-5 py-2 rounded font-medium hover:bg-brand hover:text-light transition-colors"
          >
            Login
          </Link>
        </div>

        <p className="text-muted text-sm mt-1">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-brand underline hover:opacity-80 transition-opacity"
          >
            Sign up free
          </Link>
        </p>
      </main>
    </div>
  );
}

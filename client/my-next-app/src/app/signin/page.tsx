"use client";
import Navbar from "../../components/Navbar";

export default function SignInPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar />

      <div className="flex flex-1 h-screen">
        {/* Left Side - 60% Image Section */}
        <div className="hidden lg:block w-3/5">
          <img
            src="/sign-in.jpg" // Ensure this image exists in the public folder
            alt="Sign In"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side - 40% Sign In Form */}
        <div className="flex w-full lg:w-2/5 justify-center items-center px-12">
          <div className="w-full max-w-md">
            <h2 className="text-center text-3xl font-bold tracking-tight">
              Sign in to your account
            </h2>

            <form action="#" method="POST" className="space-y-6 mt-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="mt-2 block w-full rounded-md bg-gray-800 px-4 py-3 text-white placeholder-gray-400 focus:outline-cyan-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="mt-2 block w-full rounded-md bg-gray-800 px-4 py-3 text-white placeholder-gray-400 focus:outline-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-cyan-500 px-4 py-3 text-white font-semibold hover:bg-cyan-600 transition"
              >
                Sign in
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-400">
              Not a member?{' '}
              <a href="#" className="text-cyan-500 hover:underline">
                Start a 14-day free trial
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}




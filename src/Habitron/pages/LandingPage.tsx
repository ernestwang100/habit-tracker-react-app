import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Hero Section */}
      <header className="bg-blue-600 text-white py-16 text-center">
        <h1 className="text-4xl font-bold">Welcome to Our Platform</h1>
        <p className="mt-4 text-lg">Start your journey with us today!</p>
        <Link
          to="/signup"
          className="mt-6 inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold"
        >
          Get Started
        </Link>
      </header>

      {/* Features Section */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold">Feature One</h3>
            <p className="mt-2 text-gray-600">
              Quick, easy, and efficient solutions.
            </p>
          </div>
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold">Feature Two</h3>
            <p className="mt-2 text-gray-600">
              Seamless user experience with AI assistance.
            </p>
          </div>
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold">Feature Three</h3>
            <p className="mt-2 text-gray-600">
              Customizable and secure platform.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-200 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-xl font-semibold">1. Sign Up</h3>
            <p className="text-gray-600">Create an account to get started.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">2. Explore Features</h3>
            <p className="text-gray-600">Utilize our tools for your needs.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">3. Grow & Succeed</h3>
            <p className="text-gray-600">Leverage our platform for success.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6">
        <p>&copy; 2025 Your Company. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;

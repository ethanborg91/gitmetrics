export default function Home() {
  return (
    <section className="p-8 mx-auto max-w-4xl bg-gray-50 min-h-screen dark:bg-gray-800 dark:text-white">
      <h1 className="text-4xl font-bold text-blue-600">Welcome to GitMetrics</h1>
      <p className="mt-4 text-lg">
        Track your Git activity with ease and gain insights into your coding habits.
      </p>
      <a href="/signup" className="mt-6 inline-block bg-blue-600 font-medium text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
        Get Started
      </a>
    </section>
  );
}
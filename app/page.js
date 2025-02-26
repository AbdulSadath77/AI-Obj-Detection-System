import ObjectDetection from "@/components/object-detection";

export default function Home() {
  return (
    <main className="flex flex-col min-h-[90vh] items-center p-4">
      <header>
        <h1 className="gradient-title font-extrabold text-3xl md:text-6xl lg:text-8xl tracking-tighter md:px-6 text-center">
          AI-Theft Detection System
        </h1>
      </header>
      
      <div className="flex-grow">
        <ObjectDetection />
      </div>

      <div className="flex space-x-4 mt-4">
        <button
          id="pauseButton"
          type="button"
          className="bg-white text-black font-semibold uppercase tracking-wide px-8 py-4 rounded-xl w-36 active:scale-[0.98] duration-50"
        >
          Pause
        </button>

        <button
          id="resumeButton"
          type="button"
          className="bg-white text-black font-semibold uppercase tracking-wide px-8 py-4 rounded-xl w-36 active:scale-[0.98] duration-50"
        >
          Resume
        </button>
      </div>

      <footer className="mt-8 p-4 text-center text-gray-500">
        <p>
          Developed by&nbsp;
          <a
            href="https://www.linkedin.com/in/abdulsadath/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="hover:underline text-white">Abdul Sadath</span>
          </a>
        </p>
      </footer>
    </main>
  );
}

import Link from "next/link";

export default function About() {
  return (
    <main className="flex flex-col min-h-[90vh] items-center p-4 max-w-4xl mx-auto">
      <header>
        <h1 className="gradient-title font-extrabold text-3xl md:text-5xl tracking-tighter md:px-6 text-center mb-8">
          About AI-TDS
        </h1>
      </header>

      <div className="flex-grow w-full space-y-6 text-gray-200">
        <section className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-white">Our Mission</h2>
          <p className="mb-4">
            The AI-TDS (Theft Detection System) is designed to provide an
            accessible, efficient, and reliable security solution using
            cutting-edge artificial intelligence technology. Our mission is to
            enhance security measures for homes, businesses, and public spaces
            by leveraging the power of real-time object detection.
          </p>
          <p>
            We believe that advanced security technology should be accessible to
            everyone, which is why we've built this system using open-source
            technologies and web-based interfaces that can run on most modern
            devices.
          </p>
        </section>

        <section className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-white">How It Works</h2>
          <p className="mb-4">
            Our system uses TensorFlow.js and the COCO-SSD (Common Objects in
            Context - Single Shot MultiBox Detector) model to analyze video
            feeds in real-time. The system is specifically trained to detect
            people and can trigger alerts when unauthorized individuals are
            detected in monitored areas.
          </p>
          <p className="mb-4">Key features of our system include:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Real-time object detection with high accuracy</li>
            <li>
              Browser-based implementation (no server processing required)
            </li>
            <li>Customizable alert system with audio notifications</li>
            <li>Privacy-focused design that processes all data locally</li>
            <li>Ability to pause and resume monitoring as needed</li>
          </ul>
          <p>
            The system draws bounding boxes around detected objects, with
            special highlighting for people, and triggers an audio alarm when a
            person is detected in the frame.
          </p>
        </section>

        <section className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Technology Stack
          </h2>
          <p className="mb-4">
            Our application is built using the following technologies:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-semibold">Next.js:</span> React framework
              for building the web application
            </li>
            <li>
              <span className="font-semibold">TensorFlow.js:</span> Machine
              learning library for JavaScript
            </li>
            <li>
              <span className="font-semibold">COCO-SSD Model:</span> Pre-trained
              model for object detection
            </li>
            <li>
              <span className="font-semibold">React Webcam:</span> For accessing
              and displaying camera feeds
            </li>
            <li>
              <span className="font-semibold">Tailwind CSS:</span> For styling
              and responsive design
            </li>
          </ul>
        </section>

        <section className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-white">Developer</h2>
          <p>
            This system was developed by{" "}
            <a
              href="https://www.linkedin.com/in/abdulsadath/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Abdul Sadath
            </a>
            , a passionate developer focused on creating accessible AI solutions
            for everyday problems.
          </p>
        </section>
      </div>

      <div className="mt-8 mb-4">
        <Link
          href="/"
          className="bg-white text-black font-semibold uppercase tracking-wide px-8 py-4 rounded-xl active:scale-[0.98] duration-50 inline-block"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}

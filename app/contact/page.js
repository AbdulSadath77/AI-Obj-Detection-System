"use client";

import { useState } from "react";
import Link from "next/link";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult("Sending....");

    const formDataToSend = new FormData();

    // Append form fields
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    // Append access key
    formDataToSend.append("access_key", "fbf05e4e-9da1-4a80-9af7-8bfa02ba5919");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        setResult("Your message has been sent successfully!");
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        console.log("Error", data);
        setResult(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setResult("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);

      // Reset result message after 5 seconds
      setTimeout(() => {
        setResult("");
      }, 5000);
    }
  };

  return (
    <main className="flex flex-col min-h-[90vh] items-center p-4 max-w-4xl mx-auto">
      <header>
        <h1 className="gradient-title font-extrabold text-3xl md:text-5xl tracking-tighter md:px-6 text-center mb-8">
          Contact Us
        </h1>
      </header>

      <div className="flex-grow w-full space-y-8 text-gray-200">
        <section className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-white">Get in Touch</h2>
          <p className="mb-4">
            We'd love to hear from you! Whether you have questions about the
            AI-Theft Detection System, need technical support, or want to
            provide feedback, please don't hesitate to reach out.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold text-white">Email</h3>
                  <p className="text-gray-300">sadathsd69@gmail.com</p>
                </div>
              </div>

              {/* <div className="flex items-start space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold text-white">Phone</h3>
                  <p className="text-gray-300">+1 (555) 123-4567</p>
                </div>
              </div> */}

              <div className="flex items-start space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold text-white">Location</h3>
                  <p className="text-gray-300">
                    Nizamabad, Telangana, India - 503001
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold text-white">Support Hours</h3>
                  <p className="text-gray-300">
                    Monday - Friday: 9am - 5pm IST
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-5 rounded-lg">
              {result && (
                <div
                  className={`text-center py-3 mb-4 rounded-md ${
                    result.includes("success")
                      ? "bg-green-800 text-white"
                      : result === "Sending...."
                      ? "bg-blue-800 text-white"
                      : "bg-red-800 text-white"
                  }`}
                >
                  <p>{result}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full font-semibold py-2 px-4 rounded-md transition duration-300 ${
                    isSubmitting
                      ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>

                {/* Hidden honeypot field to prevent spam */}
                <input
                  type="checkbox"
                  name="botcheck"
                  className="hidden"
                  style={{ display: "none" }}
                />
              </form>
            </div>
          </div>
        </section>

        <section className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white">
                How accurate is the detection system?
              </h3>
              <p className="text-gray-300">
                The AI-Theft Detection System uses the COCO-SSD model which has
                been trained on a diverse dataset. It typically achieves high
                accuracy for person detection in well-lit environments, though
                performance may vary based on lighting conditions, camera
                quality, and other environmental factors.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">
                Does the system work offline?
              </h3>
              <p className="text-gray-300">
                Yes, once the model is loaded, the AI-Theft Detection System
                works entirely in your browser without requiring an internet
                connection. All processing happens locally on your device.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">
                Is my privacy protected?
              </h3>
              <p className="text-gray-300">
                Absolutely. Since all processing happens locally in your
                browser, no video data is sent to any external servers. Your
                camera feed never leaves your device.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">
                Can I customize the alert sound?
              </h3>
              <p className="text-gray-300">
                The current version uses a default alert sound, but we're
                working on adding customization options in future updates.
                Contact us if you have specific requirements.
              </p>
            </div>
          </div>
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

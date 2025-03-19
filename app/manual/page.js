import Link from "next/link";
import Image from "next/image";

export default function Manual() {
  return (
    <main className="flex flex-col min-h-[90vh] items-center p-4 max-w-4xl mx-auto">
      <header>
        <h1 className="gradient-title font-extrabold text-3xl md:text-5xl tracking-tighter md:px-6 text-center mb-8">
          AI-TDS User Manual
        </h1>
      </header>

      <div className="flex-grow w-full space-y-6 text-gray-200">
        <section className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Getting Started
          </h2>
          <p className="mb-4">
            Welcome to the AI-TDS (Theft Detection System)! This manual will
            guide you through setting up and using the system effectively. The
            system uses your device's camera and artificial intelligence to
            detect people and alert you when someone is detected.
          </p>

          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              System Requirements
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                A modern web browser (Chrome, Firefox, Safari, or Edge
                recommended)
              </li>
              <li>A device with a working webcam</li>
              <li>JavaScript enabled in your browser</li>
              <li>Recommended: At least 4GB of RAM for smooth performance</li>
              <li>Stable internet connection (only for initial loading)</li>
            </ul>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">
              Browser Permissions
            </h3>
            <p className="mb-2">
              When you first use the system, your browser will ask for
              permission to access your camera. You must allow this for the
              system to function properly.
            </p>
            <div className="flex flex-col items-center mb-2">
              <div className="bg-gray-700 p-3 rounded-lg text-center mb-2 w-full md:w-3/4">
                <p className="text-sm italic">
                  Example permission dialog: "example.com wants to use your
                  camera. Allow/Block"
                </p>
              </div>
            </div>
            <p>
              If you accidentally deny permission, you can reset it by clicking
              on the camera icon in your browser's address bar, or by clearing
              site settings in your browser preferences.
            </p>
          </div>
        </section>

        <section className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Using the System
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Step 1: Launch the Application
              </h3>
              <p className="mb-2">
                Navigate to the home page of the AI-TDS. You'll see a loading
                message while the AI model is being initialized. This may take a
                few seconds depending on your internet connection and device
                performance.
              </p>
              <div className="bg-gray-800 p-3 rounded-lg mb-2">
                <p className="text-sm text-center">
                  During loading: "Loading AI Model..."
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Step 2: Position Your Camera
              </h3>
              <p className="mb-4">
                Once the system is loaded, you'll see the live feed from your
                camera. Position your device so that the camera covers the area
                you want to monitor. For best results:
              </p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Ensure the area is well-lit</li>
                <li>Minimize reflective surfaces in the frame</li>
                <li>
                  Position the camera at a height that captures the entire
                  monitoring area
                </li>
                <li>
                  Avoid pointing the camera directly at bright light sources
                </li>
              </ul>

              <div className="bg-gray-800 p-4 rounded-lg mb-4">
                <h4 className="text-md font-semibold text-white mb-2">
                  Camera Selection
                </h4>
                <p className="mb-2">
                  If your device has multiple cameras, you'll see a dropdown
                  menu above the video feed that allows you to switch between
                  them:
                </p>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Click on the dropdown menu to see available cameras</li>
                  <li>Select the camera you wish to use</li>
                  <li>
                    The video feed will automatically switch to the selected
                    camera
                  </li>
                </ol>
                <p className="mt-2 text-sm text-gray-400">
                  Note: If your device has only one camera, the selection menu
                  will not be displayed.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Step 3: Detection in Action
              </h3>
              <p className="mb-4">
                The system will automatically start detecting objects in the
                camera's view. When a person is detected:
              </p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>A red bounding box will appear around the person</li>
                <li>An audio alarm will sound to alert you</li>
                <li>
                  Other detected objects will be highlighted with cyan bounding
                  boxes
                </li>
              </ul>
              <div className="bg-gray-800 p-3 rounded-lg mb-2">
                <p className="text-sm text-center">
                  Example: Red box around a person with label "person"
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Step 4: Managing Alerts
              </h3>
              <p className="mb-4">
                You can control the alarm system using the buttons at the bottom
                of the screen:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-800 p-3 rounded-lg text-center">
                  <p className="font-semibold mb-1">Pause Button</p>
                  <p className="text-sm">Temporarily stops the alarm sound</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg text-center">
                  <p className="font-semibold mb-1">Resume Button</p>
                  <p className="text-sm">Re-enables the alarm sound</p>
                </div>
              </div>
              <p>
                Note: Even when the alarm is paused, the system continues to
                detect and highlight objects. Only the audio notification is
                disabled.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-white">Advanced Usage</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Optimizing Detection Performance
              </h3>
              <p className="mb-2">
                The detection system works best under certain conditions. To
                improve detection accuracy:
              </p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Ensure good lighting in the monitored area</li>
                <li>Reduce visual clutter in the background</li>
                <li>
                  Position the camera to capture full-body views when possible
                </li>
                <li>
                  For monitoring larger areas, consider using a wide-angle
                  camera
                </li>
                <li>
                  Close other resource-intensive applications for better
                  performance
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Privacy Considerations
              </h3>
              <p className="mb-4">
                The AI-Theft Detection System is designed with privacy in mind:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>All processing happens locally on your device</li>
                <li>No video data is sent to external servers</li>
                <li>
                  No recordings are stored unless you explicitly set up external
                  recording software
                </li>
                <li>
                  The system only detects objects it has been trained to
                  recognize (people, animals, common objects)
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Troubleshooting
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Camera Not Working
              </h3>
              <p className="mb-2">If the camera feed doesn't appear:</p>
              <ol className="list-decimal pl-6 space-y-1">
                <li>
                  Check that you've granted camera permissions in your browser
                </li>
                <li>
                  Ensure no other applications are currently using your camera
                </li>
                <li>Try refreshing the page</li>
                <li>Restart your browser if the issue persists</li>
                <li>
                  If you have multiple cameras, try selecting a different camera
                  from the dropdown menu
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Slow Performance
              </h3>
              <p className="mb-2">If the detection is running slowly:</p>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Close other browser tabs and applications</li>
                <li>
                  Ensure your device meets the minimum system requirements
                </li>
                <li>
                  Try using a different browser (Chrome often provides the best
                  performance)
                </li>
                <li>Reduce the resolution of your camera if possible</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                False Alarms
              </h3>
              <p className="mb-2">If you're getting too many false alarms:</p>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Improve lighting in the monitored area</li>
                <li>Remove objects that might resemble human shapes</li>
                <li>
                  Reposition the camera to get clearer views of the monitoring
                  area
                </li>
                <li>
                  Be aware that the system may occasionally mistake other
                  objects for people
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                No Sound Alerts
              </h3>
              <p className="mb-2">
                If you don't hear the alarm when a person is detected:
              </p>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Check that your device's volume is turned up</li>
                <li>Ensure you haven't clicked the "Pause" button</li>
                <li>Verify that your browser has permission to play audio</li>
                <li>
                  Try clicking anywhere on the page (some browsers require user
                  interaction before playing audio)
                </li>
                <li>
                  Try selecting a different audio output device from the
                  dropdown menu
                </li>
              </ol>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg mt-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Audio Output Selection
              </h3>
              <p className="mb-3">
                The system allows you to choose which audio device to use for
                alarm sounds:
              </p>
              <ol className="list-decimal pl-6 space-y-1 mb-3">
                <li>
                  Look for the "Audio Output" dropdown menu above the camera
                  feed
                </li>
                <li>
                  Select your preferred speakers or headphones from the list
                </li>
                <li>
                  The system will immediately use the selected device for alarms
                </li>
              </ol>
              <div className="bg-gray-700 p-3 rounded-lg text-gray-300 text-sm">
                <p className="font-semibold mb-1">Note:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Audio output selection requires microphone permission (for
                    technical reasons)
                  </li>
                  <li>This feature may not be available in all browsers</li>
                  <li>
                    If you don't see the dropdown, your browser doesn't support
                    this feature
                  </li>
                </ul>
              </div>
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

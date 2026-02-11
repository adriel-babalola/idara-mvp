import AudioRecorder from './components/AudioRecorder';
import LectureList from './components/LectureList';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm p-4 mb-8 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
            <span>Idara</span>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">MVP</span>
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 space-y-12">
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Capture Your Lectures
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Record, transcribe, and study smarter. Works completely offline.
            </p>
          </div>

          <AudioRecorder />
        </section>

        <section className="border-t border-gray-200 pt-12">
          <LectureList />
        </section>
      </main>
    </div>
  )
}

export default App

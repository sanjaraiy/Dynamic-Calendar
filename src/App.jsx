import Calendar from '@/components/Calendar'

function App() {

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-4xl font-bold mb-8">Dynamic Event Calendar</h1>
        <Calendar />
      </main>
    </>
  );
}

export default App;

import { Calendar } from '../Calendar/Calendar';
import { DashboardPanel } from '../Dashboard/DashboardPanel';
import { ControlPanel } from '../Controls/ControlPanel';
import { Footer } from './Footer';
import { Legends } from './Legends';
import { Header } from './Header';

export const Layout = () => {
  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      <Header />

      <main className="px-4 py-8 mx-auto lg:mx-8 sm:px-6 lg:px-8">
        <ControlPanel />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-4">
            <Calendar />
          </div>
        </div>

        <Legends />
      </main>

      <DashboardPanel />

      <Footer />
    </div>
  );
};

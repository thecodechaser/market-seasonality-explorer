import React, { useEffect } from 'react';
import { Calendar } from '../Calendar/Calendar';
import { DashboardPanel } from '../Dashboard/DashboardPanel';
import { FilterPanel } from '../Controls/FilterPanel';
import { Footer } from './Footer';
import { Legends } from './Legends';
import { Header } from './Header';
import { useSelector, useDispatch } from 'react-redux';
import { updateDashboardData } from '../../store/marketDataSlice';

export const Layout = () => {
  const dispatch = useDispatch();
  const { dashboardData } = useSelector((state) => state.marketData);

  // Close dashboard if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dashboardData.isVisible) {
        const dashboardElement = document.querySelector(
          '[data-dashboard-panel]'
        );
        if (
          dashboardElement &&
          !dashboardElement.contains(event.target as Node)
        ) {
          dispatch(updateDashboardData({ isVisible: false }));
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dashboardData.isVisible]);

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      <Header />

      <main className="px-4 py-8 mx-auto lg:mx-8 sm:px-6 lg:px-8">
        <FilterPanel />

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

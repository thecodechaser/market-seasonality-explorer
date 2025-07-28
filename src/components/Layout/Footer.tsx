export const Footer = () => {
  return (
    <footer className="mt-16 border-t lg:px-8 bg-gray-900/50 backdrop-blur-sm border-gray-700/50">
      <div className="px-4 py-6 mx-auto sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-2 text-center lg:flex-row lg:text-left">
          <p className="text-xs text-gray-400 md:text-sm">
            Market Seasonality Explorer - Real-time financial market analysis
          </p>

          <p className="order-3 text-xs text-gray-400 md:text-sm lg:order-none">
            © {new Date().getFullYear()} All rights reserved.{' '}
            <a
              href="https://thecodechaser.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              thecodechaser.com
            </a>
          </p>

          <p className="text-xs text-gray-400 md:text-sm">
            Data updates every minute • {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </footer>
  );
};

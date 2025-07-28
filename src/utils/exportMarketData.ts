import jsPDF from 'jspdf';
import { CalendarCell as CalendarCellType } from '../types';

export const exportMarketData = ({
  data,
  format,
}: {
  data: CalendarCellType[];
  format: 'pdf' | 'csv' | 'image';
}) => {
  const validEntries = data.filter((d) => d.data);

  const timeframe = validEntries[0].timeframe;
  const symbol = validEntries[0].data?.symbol || 'UNKNOWN';
  const filename = `market-${symbol}-${timeframe}-${
    new Date().toISOString().split('T')[0]
  }`;

  if (validEntries.length === 0) {
    alert('No market data available to export.');
    return;
  }

  if (format === 'csv') {
    const csv = [
      [
        'Date',
        'Open',
        'High',
        'Low',
        'Close',
        'Volume',
        'Volatility',
        'Liquidity',
        'Performance',
        'Timeframe',
      ],
      ...validEntries.map(({ data }) => [
        data!.date,
        data!.open,
        data!.high,
        data!.low,
        data!.close,
        data!.volume,
        data!.volatility,
        data!.liquidity,
        data!.performance,
        timeframe,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    return;
  }

  if (format === 'pdf') {
    const doc = new jsPDF();
    const lineHeight = 10;
    const pageHeight = doc.internal.pageSize.height;
    let y = 20;

    const addHeader = () => {
      doc.setFontSize(16);
      doc.text(`Market Data Export - ${symbol}`, 20, y);
      y += lineHeight;
      doc.setFontSize(12);
      doc.text(`Timeframe: ${timeframe?.toUpperCase()}`, 20, y);
      y += lineHeight;
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, y);
      y += lineHeight * 2;
    };

    const addRow = (data: any) => {
      const text = `${data.date}: Open ${data.open}, High ${data.high}, Low ${data.low}, Close ${data.close}, Vol ${data.volume}`;
      if (y + lineHeight > pageHeight - 10) {
        doc.addPage();
        y = 20;
        addHeader();
      }
      doc.text(text, 20, y);
      y += lineHeight;
    };

    addHeader();
    validEntries.forEach(({ data }) => data && addRow(data));
    doc.save(`${filename}.pdf`);
    return;
  }

  if (format === 'image') {
    const canvas = document.createElement('canvas');
    const rowHeight = 24;
    const padding = 20;
    const headerHeight = 50;
    const canvasHeight = headerHeight + rowHeight * (validEntries.length + 1);
    const canvasWidth = 1400;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '16px monospace';

      const headers = [
        'Date',
        'Open',
        'High',
        'Low',
        'Close',
        'Volume',
        'Volatility',
        'Liquidity',
        'Performance',
      ];
      headers.forEach((h, i) =>
        ctx.fillText(h, padding + i * 130, headerHeight)
      );

      validEntries.forEach(({ data }, idx) => {
        const y = headerHeight + (idx + 1) * rowHeight;
        const values = [
          data!.date,
          data!.open.toFixed(2),
          data!.high.toFixed(2),
          data!.low.toFixed(2),
          data!.close.toFixed(2),
          data!.volume.toLocaleString(),
          data!.volatility.toFixed(2),
          data!.liquidity.toFixed(0),
          data!.performance.toFixed(2),
        ];
        values.forEach((val, i) => {
          ctx.fillText(val.toString(), padding + i * 130, y);
        });
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${filename}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      });
    }
  }
};

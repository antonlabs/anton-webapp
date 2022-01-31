export const darkTheme = {
  chart: {
    layout: {
      backgroundColor: '#2f2f2f',
      lineColor: '#1B1B1B',
      textColor: '#D9D9D9',
    },
    watermark: {
      color: 'rgba(0, 0, 0, 0)',
    },
    crosshair: {
      color: '#758696',
    },
    grid: {
      vertLines: {
        color: '#2B2B43',
      },
      horzLines: {
        color: '#363C4E',
      },
    },
  },
  series: {
    topColor: '#c69e38',
    bottomColor: 'rgba(198, 158, 56, 0.4)',
    lineColor: 'rgba(198, 158, 56, 0.8)',
  },
};

export const lightTheme = {
  chart: {
    layout: {
      backgroundColor: '#FFFFFF',
      lineColor: '#2B2B43',
      textColor: '#191919',
    },
    watermark: {
      color: 'rgba(0, 0, 0, 0)',
    },
    grid: {
      vertLines: {
        visible: false,
      },
      horzLines: {
        color: '#f0f3fa',
      },
    },
  },
  series: {
    topColor: 'rgba(33, 150, 243, 0.56)',
    bottomColor: 'rgba(33, 150, 243, 0.04)',
    lineColor: 'rgba(33, 150, 243, 1)',
  },
};

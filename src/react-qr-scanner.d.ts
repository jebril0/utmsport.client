declare module 'react-qr-scanner' {
  import * as React from 'react';
  interface QrScannerProps {
    delay?: number;
    onError?: (error: any) => void;
    onScan?: (data: any) => void;
    style?: React.CSSProperties;
    facingMode?: 'user' | 'environment';
    className?: string;
  }
  export default class QrScanner extends React.Component<QrScannerProps> {}
}
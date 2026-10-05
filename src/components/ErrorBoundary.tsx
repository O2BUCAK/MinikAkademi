import React, { ErrorInfo, ReactNode } from 'react';
import { RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFF9E6] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="bg-white max-w-md w-full p-8 rounded-3xl border-4 border-orange-300 shadow-xl flex flex-col items-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-4xl mb-4 animate-bounce">
              🎨
            </div>
            <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight mb-2">
              Ufak Bir Aksilik Oldu!
            </h2>
            <p className="text-xs font-bold text-gray-500 mb-6 leading-relaxed">
              Oyunumuzda geçici bir sorun oluştu. Sayfayı yenileyerek eğlenceye kaldığın yerden devam edebilirsin!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={this.handleReset}
                className="flex-1 py-3 px-4 rounded-2xl bg-orange-100 hover:bg-orange-200 text-orange-800 font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Home size={16} />
                <span>Tekrar Dene</span>
              </button>
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md"
              >
                <RefreshCw size={16} />
                <span>Sayfayı Yenile</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

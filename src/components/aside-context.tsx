import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface AsideContextType {
  content: ReactNode | null;
  setContent: (content: ReactNode | null) => void;
}

const AsideContext = createContext<AsideContextType | undefined>(undefined);

export function AsideProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ReactNode | null>(null);

  return (
    <AsideContext.Provider value={{ content, setContent }}>
      {children}
    </AsideContext.Provider>
  );
}

export function useAside() {
  const context = useContext(AsideContext);
  if (context === undefined) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return context;
}

export function AsideContent({ children }: { children: ReactNode }) {
  const { setContent } = useAside();

  React.useEffect(() => {
    setContent(children);
    return () => setContent(null);
  }, [children, setContent]);

  return null;
}

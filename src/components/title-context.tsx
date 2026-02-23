import {createContext, type ReactNode, useEffect, useState} from "react";
import {useTitle} from "@/lib/utils.ts";

interface TitleContextType {
  content: ReactNode | null;
  setContent: (content: ReactNode | null) => void;
  title: string;
  setTitle: (title: string) => void;
}

const TitleContext = createContext<TitleContextType>({content: null, setContent: () => {}, title: '', setTitle: () => {}});

function TitleProvider({children}: { children: ReactNode }) {
  const [content, setContent] = useState<ReactNode | null>(null);
  const [title, setTitle] = useState('');

  return (
    <TitleContext.Provider value={{content, setContent, title, setTitle}}>
      {children}
    </TitleContext.Provider>
  )
}

function TitleContent({children, title}: { children?: ReactNode, title: string }) {
  const {setContent, setTitle} = useTitle();
  useEffect(() => {
    setContent(children);
    setTitle(title);
    return () => {
      setContent(null);
      setTitle('');
    };
  }, [children, setContent, setTitle, title]);

  return null;
}

export {TitleProvider, TitleContext, TitleContent};
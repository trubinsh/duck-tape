import {createContext, type ReactNode, useEffect, useState} from "react";
import {useTitle} from "@/lib/utils.ts";

interface TitleContextType {
  content: ReactNode | null;
  setContent: (content: ReactNode | null) => void;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
}

const TitleContext = createContext<TitleContextType>({
  content: null,
  setContent: () => {},
  title: '',
  setTitle: () => {},
  description: '',
  setDescription: () => {}
});

function TitleProvider({children}: { children: ReactNode }) {
  const [content, setContent] = useState<ReactNode | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  return (
    <TitleContext.Provider value={{content, setContent, title, setTitle, description, setDescription}}>
      {children}
    </TitleContext.Provider>
  )
}

function TitleContent({children, title, description}: { children?: ReactNode, title: string, description?: string }) {
  const {setContent, setTitle, setDescription} = useTitle();
  useEffect(() => {
    setContent(children);
    setTitle(title);
    setDescription(description || '');
    return () => {
      setContent(null);
      setTitle('');
      setDescription('');
    };
  }, [children, setContent, setTitle, setDescription, title, description]);

  useEffect(() => {
    document.title = title ? `${title} | DuckTape` : 'DuckTape';
  }, [title]);

  useEffect(() => {
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description || 'DuckTape - All-in-one developer tools');
  }, [description]);

  return null;
}

export {TitleProvider, TitleContext, TitleContent};
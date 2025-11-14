// This is your home page file: src/app/page.tsx

// Testing import of the SelectionMenu component
import SelectionMenu from '@/components/SelectionMenu';

export default function Home() {
  return (
    <main>
      <h1>Welcome to CafePOS INITIAL TEST</h1>
      
      {/* This line displays your component on the page */}
      <SelectionMenu />
    </main>
  );
}
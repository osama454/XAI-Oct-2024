import React, { useEffect, useState } from 'react';

function Home() {
  return <div>Welcome to the Home Page!</div>;
}

function About() {
  return <div>Welcome to the About Page!</div>;
}

export default function App() {
  const [component, setComponent] = useState(null);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    updateComponent(path);
  };

  const updateComponent = (path) => {
    switch (path) {
      case '/about':
        setComponent(<About />);
        break;
      case '/home':
      default:
        setComponent(<Home />);
        break;
    }
  };

  useEffect(() => {
    updateComponent(window.location.pathname);

    // Handle browser back/forward button navigation
    const handlePopState = () => {
      console.log('update');
      updateComponent(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div>
      <button onClick={() => navigate('/home')}>Home</button>
      <button onClick={() => navigate('/about')}>About</button>
      {component}
    </div>
  );
}

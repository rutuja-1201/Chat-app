import ChatWidget from './components/ChatWidget';
import './App.css';

function App() {
  return (
    <div className="container">
      <div className="header">
        <h1>Spur Store - Customer Support</h1>
        <p>Ask me anything about shipping, returns, or support hours!</p>
      </div>
      <ChatWidget />
    </div>
  );
}

export default App;

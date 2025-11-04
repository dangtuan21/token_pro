import { TokenManager } from "./TokenManager";
import "./index.css";
import "./styles.css";

// Test CI/CD workflow - Auto deployment on push to main
export function App() {
  return (
    <div className="app-container">
      <TokenManager />
    </div>
  );
}

export default App;

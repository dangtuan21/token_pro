// Test component to verify frontend-only deployment
export const TestComponent = () => {
  return (
    <div className="test-component">
      <h1>🚀 Smart Deployment Test - UPDATED!</h1>
      <p>This change should only trigger frontend deployment (~30 seconds)</p>
      <p>✅ No backend ECS rebuild needed!</p>
      <p>Last updated: {new Date().toISOString()}</p>
      <div className="deployment-info">
        <h3>Expected Behavior:</h3>
        <ul>
          <li>✅ Triggers: deploy-frontend.yml</li>
          <li>❌ Skips: deploy-backend.yml</li>
          <li>⚡ Duration: ~30 seconds (instead of 5-7 minutes)</li>
        </ul>
      </div>
    </div>
  );
};
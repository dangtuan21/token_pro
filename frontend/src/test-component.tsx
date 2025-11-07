// Test component to verify frontend-only deployment
export const TestComponent = () => {
  return (
    <div className="test-component">
      <h1>Smart Deployment Test</h1>
      <p>This change should only trigger frontend deployment (~30 seconds)</p>
      <p>Last updated: {new Date().toISOString()}</p>
    </div>
  );
};
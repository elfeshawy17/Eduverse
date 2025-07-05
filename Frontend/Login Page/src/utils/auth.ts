export const handleRedirectedToken = () => {
  // Get the token from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (token) {
    // Decode the token
    const decodedToken = decodeURIComponent(token);
    
    // Store the token in localStorage
    localStorage.setItem('token', decodedToken);
    
    // Remove the token from URL to prevent it from being visible
    const newUrl = window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
    
    return true;
  }
  
  return false;
}; 
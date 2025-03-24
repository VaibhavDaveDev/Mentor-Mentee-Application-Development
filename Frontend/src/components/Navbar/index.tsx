import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status and load user info whenever the location changes
  // This ensures the navbar updates when logging in/out
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("accessToken");
      const userInfoStr = localStorage.getItem("userInfo");
      
      setIsAuthenticated(!!token);
      if (userInfoStr) {
        try {
          setUserInfo(JSON.parse(userInfoStr));
        } catch (e) {
          console.error("Error parsing user info", e);
          setUserInfo(null);
        }
      } else {
        setUserInfo(null);
      }
    };
    
    checkAuth();
    
    // Add event listener for storage changes (for when another tab logs out)
    window.addEventListener("storage", checkAuth);
    
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    // Show confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to logout?");
    if (!isConfirmed) {
      return;
    }

    // Clear authentication data
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
    
    // Update state
    setIsAuthenticated(false);
    setUserInfo(null);
    
    // Close the menu if it's open
    setIsMenuOpen(false);
    
    // Show success message
    toast.success("Logged out successfully");
    
    // Navigate to home page
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                Mentor-Mentee
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Dashboard
                </Link>
                
                <div className="relative ml-3">
                  <div>
                    <button 
                      type="button" 
                      className="flex text-sm rounded-full focus:outline-none"
                      onClick={toggleMenu}
                    >
                      <span className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                        {userInfo?.name || 'Account'} ▼
                      </span>
                    </button>
                  </div>
                  
                  {isMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                      {userInfo && (
                        <>
                          <p className="block px-4 py-2 text-sm text-gray-700 border-b">
                            <span className="font-bold">{userInfo.email}</span>
                            <br />
                            <span className="text-xs text-gray-500 capitalize">Role: {userInfo.role}</span>
                          </p>
                        </>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Login
                </Link>
                <Link to="/auth/register" className="px-3 py-2 rounded-md text-sm font-medium text-blue-600 border border-blue-600 hover:bg-blue-50">
                  Register
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon */}
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Dashboard
                </Link>
                
                {userInfo && (
                  <div className="px-3 py-2 text-base font-medium text-gray-700">
                    <p className="font-semibold">{userInfo.name}</p>
                    <p className="text-xs text-gray-500">{userInfo.email}</p>
                    <p className="text-xs text-gray-500 capitalize">Role: {userInfo.role}</p>
                  </div>
                )}
                
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

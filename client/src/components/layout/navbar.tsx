import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, LogOut, Bell } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import AuthModal from "@/components/dialogs/auth-modal";

interface NavbarProps {
  transparent?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ transparent = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [authType, setAuthType] = useState<"user" | "admin">("user");
  const { isAuthenticated, user, logout } = useAuth();
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleOpenLoginModal = (type: "user" | "admin") => {
    setAuthType(type);
    setIsLoginModalOpen(true);
  };

  const handleOpenSignupModal = (type: "user" | "admin") => {
    setAuthType(type);
    setIsSignupModalOpen(true);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const navbarClass = transparent
    ? "absolute top-0 left-0 right-0 z-50 text-white"
    : "bg-white shadow-sm sticky top-0 z-50";

  const linkClass = transparent
    ? "text-white/80 hover:text-white font-medium"
    : "text-gray-700 hover:text-primary font-medium";

  // Dashboard navigation links based on user role
  const getDashboardLink = () => {
    if (!isAuthenticated) return "/";
    return user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard";
  };

  return (
    <header className={navbarClass}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-primary text-2xl font-bold">
                Clean<span className="text-secondary">City</span>
              </a>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link href="/">
              <a className={linkClass}>Home</a>
            </Link>
            <Link href="/#about">
              <a className={linkClass}>About</a>
            </Link>
            <Link href="/#how-it-works">
              <a className={linkClass}>How It Works</a>
            </Link>
            <Link href="/#rewards">
              <a className={linkClass}>Rewards</a>
            </Link>
            <Link href="/#contact">
              <a className={linkClass}>Contact</a>
            </Link>
          </nav>

          {/* Auth buttons or user menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* Notification bell */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 bg-accent text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                        3
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <div className="py-2 px-4 font-medium text-sm">Notifications</div>
                    <DropdownMenuSeparator />
                    <div className="px-4 py-2 text-sm">
                      <div className="mb-3">
                        <p className="font-medium">Your report has been processed</p>
                        <p className="text-muted-foreground text-xs mt-1">2 hours ago</p>
                      </div>
                      <div className="mb-3">
                        <p className="font-medium">Your report has been completed</p>
                        <p className="text-muted-foreground text-xs mt-1">1 day ago</p>
                      </div>
                      <div>
                        <p className="font-medium">You earned 50 reward points</p>
                        <p className="text-muted-foreground text-xs mt-1">1 day ago</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="justify-center text-primary font-medium">
                      View all notifications
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 px-2"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="text-gray-700 font-medium">
                        {user?.fullName?.split(" ")[0]}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href={getDashboardLink()}>
                      <DropdownMenuItem>Dashboard</DropdownMenuItem>
                    </Link>
                    <Link
                      href={
                        user?.role === "admin"
                          ? "/admin/profile"
                          : "/user/profile"
                      }
                    >
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                  onClick={() => handleOpenLoginModal("user")}
                >
                  Login
                </Button>
                <Button
                  variant="default"
                  className="bg-primary text-white hover:bg-primary-dark"
                  onClick={() => handleOpenSignupModal("user")}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className={transparent ? "text-white" : "text-gray-700"}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link href="/">
              <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                Home
              </a>
            </Link>
            <Link href="/#about">
              <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                About
              </a>
            </Link>
            <Link href="/#how-it-works">
              <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                How It Works
              </a>
            </Link>
            <Link href="/#rewards">
              <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                Rewards
              </a>
            </Link>
            <Link href="/#contact">
              <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                Contact
              </a>
            </Link>

            {isAuthenticated ? (
              <>
                <Link href={getDashboardLink()}>
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-gray-100">
                    Dashboard
                  </a>
                </Link>
                <Link
                  href={
                    user?.role === "admin"
                      ? "/admin/profile"
                      : "/user/profile"
                  }
                >
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                    Profile
                  </a>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex space-x-2 mt-4">
                <Button
                  variant="outline"
                  className="w-1/2 border-primary text-primary hover:bg-primary hover:text-white"
                  onClick={() => handleOpenLoginModal("user")}
                >
                  Login
                </Button>
                <Button
                  className="w-1/2 bg-primary text-white hover:bg-primary-dark"
                  onClick={() => handleOpenSignupModal("user")}
                >
                  Sign Up
                </Button>
              </div>
            )}

            {!isAuthenticated && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => handleOpenLoginModal("admin")}
                >
                  Admin Login
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auth Modals */}
      <AuthModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        type="login"
        userType={authType}
        onSwitchType={(type) => {
          setIsLoginModalOpen(false);
          setIsSignupModalOpen(true);
          setAuthType(type);
        }}
      />

      <AuthModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        type="signup"
        userType={authType}
        onSwitchType={(type) => {
          setIsSignupModalOpen(false);
          setIsLoginModalOpen(true);
          setAuthType(type);
        }}
      />
    </header>
  );
};

export default Navbar;

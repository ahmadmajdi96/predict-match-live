import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Trophy, LayoutDashboard, Shield, User, LogOut, Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import { translations as t } from "@/lib/translations";
import { useAuth } from "@/hooks/useAuth";
import { NotificationBell } from "./NotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navLinks = [
  { href: "/", label: t.home, icon: null },
  { href: "/matches", label: t.matches, icon: null },
  { href: "/standings", label: t.standings, icon: Medal },
  { href: "/leaderboard", label: t.leaderboard, icon: Trophy },
  { href: "/dashboard", label: t.dashboard, icon: LayoutDashboard },
];

export function NavbarAr() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user && <NotificationBell />}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <User className="w-4 h-4 ml-2" />
                  {t.dashboard}
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <Shield className="w-4 h-4 ml-2" />
                    {t.admin}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 ml-2" />
                  {t.signOut}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
                {t.signIn}
              </Button>
              <Button variant="hero" size="sm" onClick={() => navigate('/auth')}>
                {t.getStarted}
              </Button>
            </>
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {isAdmin && (
            <Link
              to="/admin"
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                location.pathname === "/admin"
                  ? "text-accent bg-accent/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {t.admin}
              </span>
            </Link>
          )}
          {navLinks.slice().reverse().map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <span className="flex items-center gap-2">
                  {link.label}
                  {link.icon && <link.icon className="w-4 h-4" />}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex flex-col items-end">
            <span className="font-display font-bold text-lg leading-none">فوت بريديكت</span>
            <span className="text-xs text-primary font-semibold tracking-wider">برو</span>
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
              <span className="text-xl font-bold text-primary-foreground">⚽</span>
            </div>
            <div className="absolute -inset-1 rounded-xl bg-primary/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden glass-strong border-t border-border/50 animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link, index) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-all text-right",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="flex items-center justify-end gap-2">
                    {link.label}
                    {link.icon && <link.icon className="w-4 h-4" />}
                  </span>
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium text-accent hover:bg-accent/10 text-right"
              >
                <span className="flex items-center justify-end gap-2">
                  {t.admin}
                  <Shield className="w-4 h-4" />
                </span>
              </Link>
            )}
            <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
              {user ? (
                <Button variant="outline" size="sm" className="flex-1" onClick={handleSignOut}>
                  {t.signOut}
                </Button>
              ) : (
                <>
                  <Button variant="hero" size="sm" className="flex-1" onClick={() => { setIsOpen(false); navigate('/auth'); }}>
                    {t.getStarted}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => { setIsOpen(false); navigate('/auth'); }}>
                    {t.signIn}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
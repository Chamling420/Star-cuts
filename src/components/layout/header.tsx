'use client'

import { useState, useEffect, useSyncExternalStore } from 'react'
import { useTheme } from 'next-themes'
import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import {
  Home,
  Info,
  Sparkles,
  ShoppingBag,
  Image,
  Phone,
  Moon,
  Sun,
  User,
  LogOut,
  Menu,
  ShoppingCart,
  Shield,
  Crown,
  CalendarDays,
} from 'lucide-react'
import { useAppStore } from '@/store/use-app-store'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { StarLogo } from '@/components/ui/star-logo'

const navLinks = [
  { page: 'home' as const, label: 'Home', icon: Home },
  { page: 'about' as const, label: 'About', icon: Info },
  { page: 'services' as const, label: 'Services', icon: Sparkles },
  { page: 'products' as const, label: 'Products', icon: ShoppingBag },
  { page: 'gallery' as const, label: 'Gallery', icon: Image },
  { page: 'contact' as const, label: 'Contact', icon: Phone },
]

export function Header() {
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const {
    currentPage,
    setCurrentPage,
    cart,
    openLogin,
    openRegister,
    mobileMenuOpen,
    setMobileMenuOpen,
  } = useAppStore()

  const [scrolled, setScrolled] = useState(false)

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const userRole = (session?.user as any)?.role as string | undefined
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN'
  const isSuperAdmin = userRole === 'SUPER_ADMIN'

  const userInitials = session?.user?.name
    ? session.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U'

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'glass-card shadow-lg'
          : 'bg-background/80 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => setCurrentPage('home')}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <StarLogo size={36} />
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight text-gradient">
              Star Cuts
            </span>
            <span className="text-[10px] font-medium leading-tight text-muted-foreground">
              Beauty Salon
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = currentPage === link.page
            return (
              <button
                key={link.page}
                onClick={() => setCurrentPage(link.page)}
                className={`relative flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-9 w-9"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage('products')}
            className="relative h-9 w-9"
            aria-label="Shopping cart"
          >
            <ShoppingCart className="h-4 w-4" />
            {cartItemCount > 0 && (
              <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px] gradient-rose text-primary-foreground border-0">
                {cartItemCount}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session.user.image || undefined}
                      alt={session.user.name || 'User'}
                    />
                    <AvatarFallback className="gradient-rose text-xs text-primary-foreground">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                    {userRole && (
                      <Badge
                        variant="secondary"
                        className="mt-1 w-fit text-[10px]"
                      >
                        {isSuperAdmin && <Crown className="mr-1 h-3 w-3" />}
                        {isAdmin && !isSuperAdmin && (
                          <Shield className="mr-1 h-3 w-3" />
                        )}
                        {userRole}
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setCurrentPage('booking')}
                  className="cursor-pointer"
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  My Bookings
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem
                    onClick={() => setCurrentPage('admin')}
                    className="cursor-pointer"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Panel
                  </DropdownMenuItem>
                )}
                {isSuperAdmin && (
                  <DropdownMenuItem
                    onClick={() => setCurrentPage('superadmin')}
                    className="cursor-pointer"
                  >
                    <Crown className="mr-2 h-4 w-4" />
                    Super Admin
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button
                variant="ghost"
                size="sm"
                onClick={openLogin}
                className="text-sm"
              >
                <User className="mr-1.5 h-4 w-4" />
                Login
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="right" className="w-80">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <StarLogo size={28} />
              <span className="text-gradient">Star Cuts</span>
            </SheetTitle>
          </SheetHeader>
          <nav className="mt-6 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page
              return (
                <SheetClose asChild key={link.page}>
                  <button
                    onClick={() => setCurrentPage(link.page)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                    {isActive && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                </SheetClose>
              )
            })}
          </nav>

          {/* Mobile Auth Section */}
          <div className="mt-auto border-t pt-4">
            {session?.user ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 px-4 py-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={session.user.image || undefined}
                      alt={session.user.name || 'User'}
                    />
                    <AvatarFallback className="gradient-rose text-xs text-primary-foreground">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <SheetClose asChild>
                  <button
                    onClick={() => setCurrentPage('booking')}
                    className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <CalendarDays className="h-5 w-5" />
                    My Bookings
                  </button>
                </SheetClose>
                {isAdmin && (
                  <SheetClose asChild>
                    <button
                      onClick={() => setCurrentPage('admin')}
                      className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      <Shield className="h-5 w-5" />
                      Admin Panel
                    </button>
                  </SheetClose>
                )}
                {isSuperAdmin && (
                  <SheetClose asChild>
                    <button
                      onClick={() => setCurrentPage('superadmin')}
                      className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      <Crown className="h-5 w-5" />
                      Super Admin
                    </button>
                  </SheetClose>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    signOut({ callbackUrl: '/' })
                  }}
                  className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-5 w-5" />
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 px-4">
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    openLogin()
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </motion.header>
  )
}

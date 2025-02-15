import { 
  Shield, Settings, Package, ShoppingCart, Home, Info, Mail, Store, 
  User, FileText, HelpCircle, Truck, Book, History, BadgeCheck,
  BarChart, Archive, LineChart, Users, Layout, ShoppingBag, CheckSquare,
  FileBox, ScrollText, BookOpen, ClipboardList, ShoppingBasket, CheckCircle,
  MessageCircle, Bookmark, Heart, Award, Coffee, Building, BookText,
  GraduationCap, FileWarning, Files
} from "lucide-react";

interface MenuItem {
  name: string;
  path: string;
  icon?: any;
  roles?: string[];
  children?: MenuItem[];
}

export const mainNavItems: MenuItem[] = [
  { name: "Home", path: "/", icon: Home },
  { 
    name: "About Us", 
    path: "/about", 
    icon: Info,
    children: [
      { name: "Our Team", path: "/about/team", icon: Users },
      { name: "Company History", path: "/about/history", icon: Building },
      { name: "Mission & Values", path: "/about/mission", icon: Heart }
    ]
  },
  { 
    name: "Products", 
    path: "/products", 
    icon: Package,
    children: [
      { name: "All Products", path: "/products", icon: ShoppingBag },
      { name: "Categories", path: "/categories", icon: Archive },
      { name: "Featured", path: "/featured", icon: BadgeCheck },
      { name: "New Arrivals", path: "/new-arrivals", icon: Package }
    ]
  },
  {
    name: "Resources",
    path: "/resources",
    icon: Files,
    children: [
      { name: "Whitepapers", path: "/resources/whitepapers", icon: FileText },
      { name: "Case Studies", path: "/resources/case-studies", icon: BookText },
      { name: "Tutorials", path: "/resources/tutorials", icon: GraduationCap }
    ]
  },
  { name: "Blog", path: "/blog", icon: ScrollText },
  { name: "Contact", path: "/contact", icon: Mail }
];

export const userNavItems: MenuItem[] = [
  { name: "Profile Settings", path: "/profile-settings", icon: Settings },
  { name: "Shopping Cart", path: "/cart", icon: ShoppingCart },
  { name: "Checkout", path: "/checkout", icon: CheckSquare },
  { name: "Order Confirmation", path: "/order-confirmation", icon: CheckCircle },
  { name: "Personal Collection", path: "/personal-collection", icon: FileBox },
  { name: "Purchase History", path: "/purchase-history", icon: History },
  { name: "Orders", path: "/purchase-history", icon: Package },
  { name: "Auth Documentation", path: "/auth-documentation", icon: FileText },
];

export const sellerNavItems: MenuItem[] = [
  { name: "Seller Dashboard", path: "/seller-dashboard", icon: Store, roles: ["seller"] },
  { name: "Sales Analytics", path: "/seller/analytics", icon: BarChart, roles: ["seller"] },
  { name: "Seller Guidelines", path: "/seller-guidelines", icon: Book, roles: ["seller"] }
];

export const adminNavItems: MenuItem[] = [
  { name: "Admin Dashboard", path: "/admin-dashboard", icon: Shield, roles: ["admin"] },
  { name: "Analytics Dashboard", path: "/admin-dashboard/analytics", icon: LineChart, roles: ["admin"] },
  { name: "User Management", path: "/admin-dashboard/users", icon: Users, roles: ["admin"] },
  { name: "Content Management", path: "/admin-dashboard/content", icon: Layout, roles: ["admin"] },
  { name: "Category Management", path: "/category-management", icon: Package, roles: ["admin"] }
];

export const buyerNavItems: MenuItem[] = [
  { name: "Buyer Dashboard", path: "/buyer-dashboard", icon: ShoppingBasket },
  { name: "Orders", path: "/purchase-history", icon: ClipboardList }
];

export const footerNavItems: MenuItem[] = [
  {
    name: "Company",
    path: "/about",
    children: [
      { name: "About Us", path: "/about", icon: Info },
      { name: "Team", path: "/about/team", icon: Users },
      { name: "Testimonials", path: "/testimonials", icon: MessageCircle }
    ]
  },
  {
    name: "Resources",
    path: "/resources",
    children: [
      { name: "Blog", path: "/blog", icon: ScrollText },
      { name: "FAQ", path: "/faq", icon: HelpCircle },
      { name: "Support", path: "/support", icon: Coffee }
    ]
  },
  {
    name: "Legal",
    path: "/legal",
    children: [
      { name: "Privacy Policy", path: "/privacy-policy", icon: FileText },
      { name: "Terms of Service", path: "/terms-of-service", icon: FileText },
      { name: "Shipping & Returns", path: "/shipping-returns", icon: Truck }
    ]
  }
];

export const specialPages: MenuItem[] = [
  { name: "404 Error", path: "/404", icon: FileWarning },
  { name: "Thank You", path: "/thank-you", icon: Heart },
  { name: "Sitemap", path: "/sitemap", icon: Files }
];

export const getAllNavItems = () => [
  ...mainNavItems,
  ...userNavItems,
  ...sellerNavItems,
  ...adminNavItems,
  ...buyerNavItems,
  ...footerNavItems,
  ...specialPages
];

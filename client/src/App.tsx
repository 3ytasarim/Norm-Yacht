import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/languageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import News from "@/pages/News";
import NewsDetail from "@/pages/NewsDetail";
import Contact from "@/pages/Contact";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import { useLocation } from "wouter";

function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");
  if (isAdmin) return <>{children}</>;
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />

        <Route path="/about" component={About} />
        <Route path="/hakkimizda" component={About} />
        <Route path="/o-nas" component={About} />

        <Route path="/services" component={Services} />
        <Route path="/hizmetler" component={Services} />
        <Route path="/uslugi" component={Services} />

        <Route path="/services/:slug" component={ServiceDetail} />
        <Route path="/hizmetler/:slug" component={ServiceDetail} />
        <Route path="/uslugi/:slug" component={ServiceDetail} />

        <Route path="/projects" component={Projects} />
        <Route path="/projeler" component={Projects} />
        <Route path="/proekty" component={Projects} />

        <Route path="/projects/:slug" component={ProjectDetail} />
        <Route path="/projeler/:slug" component={ProjectDetail} />
        <Route path="/proekty/:slug" component={ProjectDetail} />

        <Route path="/news" component={News} />
        <Route path="/haberler" component={News} />
        <Route path="/novosti" component={News} />

        <Route path="/news/:slug" component={NewsDetail} />
        <Route path="/haberler/:slug" component={NewsDetail} />
        <Route path="/novosti/:slug" component={NewsDetail} />

        <Route path="/contact" component={Contact} />
        <Route path="/iletisim" component={Contact} />
        <Route path="/kontakty" component={Contact} />

        <Route path="/admin" component={AdminLogin} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Toaster />
          <Router />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

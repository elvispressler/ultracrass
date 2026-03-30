import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import { pickTheme, applyTheme } from "@/lib/themes";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route>
        <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--fg-muted)', letterSpacing: '0.15em' }}>404</span>
        </div>
      </Route>
    </Switch>
  );
}

export default function App() {
  useEffect(() => {
    applyTheme(pickTheme());
  }, []);

  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}

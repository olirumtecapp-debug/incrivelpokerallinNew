import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="halftone-yellow ink-border-thick hard-shadow-lg mx-auto mb-6 inline-block px-8 py-4 -rotate-2">
          <h1 className="font-display text-7xl text-ink-fixed">404!</h1>
        </div>
        <h2 className="font-display mt-4 text-2xl">Página fora do baralho</h2>
        <p className="mt-2 text-muted-foreground">Essa mão não existe. Volta pra mesa!</p>
        <div className="mt-6">
          <Link
            to="/"
            className="ink-border-thick hard-shadow inline-flex items-center justify-center bg-pow-red px-6 py-3 font-display text-xl text-white transition-transform hover:-translate-y-1 hover:-translate-x-1"
          >
            IR PRA MESA
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="halftone-red ink-border-thick hard-shadow-lg mx-auto mb-6 inline-block px-8 py-4 -rotate-2">
          <h1 className="font-display text-5xl text-white">OOPS!</h1>
        </div>
        <p className="mt-2 text-muted-foreground">Deu ruim aqui. Tenta de novo?</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="ink-border-thick hard-shadow bg-pow-yellow px-5 py-2 font-display text-xl text-ink-fixed transition-transform hover:-translate-y-1 hover:-translate-x-1"
          >
            TENTAR DE NOVO
          </button>
          <a
            href="/"
            className="ink-border-thick hard-shadow bg-white px-5 py-2 font-display text-xl text-ink-fixed transition-transform hover:-translate-y-1 hover:-translate-x-1"
          >
            IR PRA HOME
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "screen-orientation", content: "landscape" },
      { name: "x5-orientation", content: "landscape" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { title: "Incrível Poker All In — Poker HQ Pop Art" },
      { name: "description", content: "Jogue Texas Hold'em com visual de história em quadrinhos. Modo Campanha, Casual, Zen e Multiplayer." },
      { name: "author", content: "Incrível Poker" },
      { property: "og:title", content: "Incrível Poker All In — Poker HQ Pop Art" },
      { property: "og:description", content: "Jogue Texas Hold'em com visual de história em quadrinhos. Modo Campanha, Casual, Zen e Multiplayer." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#f2c94c" },
      { name: "twitter:title", content: "Incrível Poker All In — Poker HQ Pop Art" },
      { name: "twitter:description", content: "Jogue Texas Hold'em com visual de história em quadrinhos. Modo Campanha, Casual, Zen e Multiplayer." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c5efbf92-db22-4434-af05-b6a96e322a6e/id-preview-d5b7b7ce--11006422-cf6a-4c0d-bcb3-20b2fbb0f967.lovable.app-1784745311366.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c5efbf92-db22-4434-af05-b6a96e322a6e/id-preview-d5b7b7ce--11006422-cf6a-4c0d-bcb3-20b2fbb0f967.lovable.app-1784745311366.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bangers&family=Nunito:wght@400;600;700;900&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const noFlashScript = `(function(){try{var m=localStorage.getItem('ip_mode');if(!m){m=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(m==='dark'){document.documentElement.classList.add('dark');}var t=localStorage.getItem('ip_theme');if(t==='neon'){document.documentElement.classList.add('theme-neon');}else if(t==='minimal'){document.documentElement.classList.add('theme-minimal');}}catch(e){}})();`;

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
        <HeadContent />
      </head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}

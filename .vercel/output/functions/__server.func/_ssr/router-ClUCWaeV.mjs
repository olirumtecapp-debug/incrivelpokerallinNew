import { i as __toESM } from "../_runtime.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as useRouter, c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route$10 } from "./play.multiplayer._code-CHIpatX4.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-ClUCWaeV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* 👑 PAINEL DO MESTRE MURILO (Alt + Shift + M)
* Injetado automaticamente para testes, trapaças de desenvolvedor e depuração em todos os jogos.
*/
function MuriloMasterAdmin() {
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const [feedback, setFeedback] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (e.altKey && e.shiftKey && (e.key === "M" || e.key === "m")) {
				e.preventDefault();
				setIsOpen((prev) => !prev);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);
	if (!isOpen) return null;
	const showMsg = (msg) => {
		setFeedback(msg);
		setTimeout(() => setFeedback(""), 3e3);
	};
	const handleAddCoins = () => {
		try {
			[
				"player_coins",
				"coins",
				"chips",
				"balance",
				"mico_prefs",
				"bj_profile",
				"user_profile"
			].forEach((k) => {
				const val = localStorage.getItem(k);
				if (val) try {
					const parsed = JSON.parse(val);
					if (typeof parsed === "object") {
						if ("balance" in parsed) parsed.balance = (Number(parsed.balance) || 0) + 5e4;
						if ("coins" in parsed) parsed.coins = (Number(parsed.coins) || 0) + 5e4;
						if ("chips" in parsed) parsed.chips = (Number(parsed.chips) || 0) + 5e4;
						localStorage.setItem(k, JSON.stringify(parsed));
					} else if (typeof parsed === "number") localStorage.setItem(k, JSON.stringify(parsed + 5e4));
				} catch {
					localStorage.setItem(k, "50000");
				}
				else localStorage.setItem(k, "50000");
			});
			showMsg("💰 +50.000 Fichas/Moedas injetadas com sucesso!");
		} catch {
			showMsg("Erro ao adicionar moedas.");
		}
	};
	const handleUnlockAll = () => {
		try {
			localStorage.setItem("all_unlocked", "true");
			localStorage.setItem("vip_status", "true");
			showMsg("👑 Todos os temas, itens e modos desbloqueados!");
		} catch {
			showMsg("Erro ao desbloquear.");
		}
	};
	const handleInstantWin = () => {
		showMsg("🏆 Sinal de Vitória enviado ao jogo!");
		window.dispatchEvent(new CustomEvent("ADMIN_INSTANT_WIN", { detail: { winner: "player" } }));
	};
	const handleRevealCards = () => {
		showMsg("🃏 Modo Raio-X ativado (Cartas reveladas)!");
		window.dispatchEvent(new CustomEvent("ADMIN_REVEAL_CARDS", { detail: { xray: true } }));
		document.querySelectorAll("[data-card-hidden], .card-back, .carta-oculta").forEach((el) => {
			el.style.opacity = "0.35";
			el.style.filter = "brightness(1.5)";
		});
	};
	const handleResetData = () => {
		if (window.confirm("Deseja resetar o progresso local deste jogo para testes?")) {
			localStorage.clear();
			sessionStorage.clear();
			showMsg("🔄 Dados resetados!");
			setTimeout(() => window.location.reload(), 800);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "fixed",
			bottom: "20px",
			right: "20px",
			zIndex: 999999,
			background: "#0d1117",
			border: "3px solid #facc15",
			borderRadius: "16px",
			padding: "16px",
			color: "#ffffff",
			fontFamily: "system-ui, -apple-system, sans-serif",
			boxShadow: "0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(250,204,21,0.4)",
			minWidth: "280px",
			maxWidth: "340px"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: "12px",
					borderBottom: "1px solid #30363d",
					paddingBottom: "8px"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						alignItems: "center",
						gap: "8px"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: { fontSize: "20px" },
						children: "👑"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							fontWeight: "900",
							fontSize: "13px",
							color: "#facc15",
							letterSpacing: "0.05em"
						},
						children: "PAINEL DO MESTRE MURILO"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							fontSize: "10px",
							color: "#8b949e"
						},
						children: "Modo Administrador (Alt + Shift + M)"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setIsOpen(false),
					style: {
						background: "transparent",
						border: "none",
						color: "#8b949e",
						cursor: "pointer",
						fontSize: "16px",
						fontWeight: "bold"
					},
					children: "✕"
				})]
			}),
			feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					background: "#1e3a8a",
					color: "#93c5fd",
					padding: "6px 10px",
					borderRadius: "8px",
					fontSize: "11px",
					fontWeight: "bold",
					marginBottom: "10px",
					textAlign: "center"
				},
				children: feedback
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: "8px"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleAddCoins,
						style: {
							background: "#eab308",
							color: "#000",
							border: "2px solid #000",
							borderRadius: "8px",
							padding: "8px 12px",
							fontWeight: "bold",
							fontSize: "12px",
							cursor: "pointer",
							textAlign: "left"
						},
						children: "💰 +50.000 Moedas / Fichas Infinitas"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleRevealCards,
						style: {
							background: "#3b82f6",
							color: "#fff",
							border: "2px solid #000",
							borderRadius: "8px",
							padding: "8px 12px",
							fontWeight: "bold",
							fontSize: "12px",
							cursor: "pointer",
							textAlign: "left"
						},
						children: "🃏 Modo Raio-X (Revelar Cartas)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleUnlockAll,
						style: {
							background: "#8b5cf6",
							color: "#fff",
							border: "2px solid #000",
							borderRadius: "8px",
							padding: "8px 12px",
							fontWeight: "bold",
							fontSize: "12px",
							cursor: "pointer",
							textAlign: "left"
						},
						children: "⚡ Desbloquear Tudo (Temas & Itens)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleInstantWin,
						style: {
							background: "#10b981",
							color: "#000",
							border: "2px solid #000",
							borderRadius: "8px",
							padding: "8px 12px",
							fontWeight: "bold",
							fontSize: "12px",
							cursor: "pointer",
							textAlign: "left"
						},
						children: "🏆 Forçar Vitória (Testar Win Screen)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleResetData,
						style: {
							background: "#ef4444",
							color: "#fff",
							border: "2px solid #000",
							borderRadius: "8px",
							padding: "8px 12px",
							fontWeight: "bold",
							fontSize: "11px",
							cursor: "pointer",
							textAlign: "left"
						},
						children: "🔄 Resetar Dados do Jogo"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					marginTop: "12px",
					textAlign: "center",
					fontSize: "9px",
					color: "#8b949e",
					borderTop: "1px solid #21262d",
					paddingTop: "6px"
				},
				children: [
					"Pressione ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						style: { color: "#facc15" },
						children: "Alt + Shift + M"
					}),
					" para fechar/abrir"
				]
			})
		]
	});
}
var styles_default = "/assets/styles-LFdcDXud.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	window.__lovableReportRuntimeError?.({
		message,
		stack: error instanceof Error ? error.stack : void 0,
		filename: window.location.pathname
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "halftone-yellow ink-border-thick hard-shadow-lg mx-auto mb-6 inline-block px-8 py-4 -rotate-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-7xl text-ink-fixed",
						children: "404!"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display mt-4 text-2xl",
					children: "Página fora do baralho"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-muted-foreground",
					children: "Essa mão não existe. Volta pra mesa!"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "ink-border-thick hard-shadow inline-flex items-center justify-center bg-pow-red px-6 py-3 font-display text-xl text-white transition-transform hover:-translate-y-1 hover:-translate-x-1",
						children: "IR PRA MESA"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "halftone-red ink-border-thick hard-shadow-lg mx-auto mb-6 inline-block px-8 py-4 -rotate-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-5xl text-white",
						children: "OOPS!"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-muted-foreground",
					children: "Deu ruim aqui. Tenta de novo?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "ink-border-thick hard-shadow bg-pow-yellow px-5 py-2 font-display text-xl text-ink-fixed transition-transform hover:-translate-y-1 hover:-translate-x-1",
						children: "TENTAR DE NOVO"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "ink-border-thick hard-shadow bg-white px-5 py-2 font-display text-xl text-ink-fixed transition-transform hover:-translate-y-1 hover:-translate-x-1",
						children: "IR PRA HOME"
					})]
				})
			]
		})
	});
}
var Route$9 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{
				name: "screen-orientation",
				content: "portrait"
			},
			{
				name: "x5-orientation",
				content: "portrait"
			},
			{
				name: "mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			},
			{ title: "Incrível Poker All In — Poker HQ Pop Art" },
			{
				name: "description",
				content: "Jogue Texas Hold'em com visual de história em quadrinhos. Modo Campanha, Casual, Zen e Multiplayer."
			},
			{
				name: "author",
				content: "Incrível Poker"
			},
			{
				property: "og:title",
				content: "Incrível Poker All In — Poker HQ Pop Art"
			},
			{
				property: "og:description",
				content: "Jogue Texas Hold'em com visual de história em quadrinhos. Modo Campanha, Casual, Zen e Multiplayer."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "theme-color",
				content: "#f2c94c"
			},
			{
				name: "twitter:title",
				content: "Incrível Poker All In — Poker HQ Pop Art"
			},
			{
				name: "twitter:description",
				content: "Jogue Texas Hold'em com visual de história em quadrinhos. Modo Campanha, Casual, Zen e Multiplayer."
			},
			{
				property: "og:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c5efbf92-db22-4434-af05-b6a96e322a6e/id-preview-d5b7b7ce--11006422-cf6a-4c0d-bcb3-20b2fbb0f967.lovable.app-1784745311366.png"
			},
			{
				name: "twitter:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c5efbf92-db22-4434-af05-b6a96e322a6e/id-preview-d5b7b7ce--11006422-cf6a-4c0d-bcb3-20b2fbb0f967.lovable.app-1784745311366.png"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				type: "image/png",
				href: "/favicon.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Bangers&family=Nunito:wght@400;600;700;900&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
var noFlashScript = `(function(){try{var m=localStorage.getItem('ip_mode');if(!m){m=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(m==='dark'){document.documentElement.classList.add('dark');}var t=localStorage.getItem('ip_theme');if(t==='neon'){document.documentElement.classList.add('theme-neon');}else if(t==='minimal'){document.documentElement.classList.add('theme-minimal');}}catch(e){}})();`;
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "pt-BR",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: noFlashScript } }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				src: "https://projetoij.lovable.app/api/public/pij.js",
				"data-project": "bananabn",
				defer: true
			})
		] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$9.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuriloMasterAdmin, {})]
	});
}
var $$splitComponentImporter$7 = () => import("./routes-C7rR39g1.mjs");
var Route$8 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Incrível Poker All In — Poker HQ Pop Art" },
		{
			name: "description",
			content: "Jogue Texas Hold'em com visual de história em quadrinhos. Modo Campanha, Casual, Zen e Multiplayer."
		},
		{
			property: "og:title",
			content: "Incrível Poker All In — Poker HQ Pop Art"
		},
		{
			property: "og:description",
			content: "Jogue Texas Hold'em com visual de história em quadrinhos. Modo Campanha, Casual, Zen e Multiplayer."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./auth-DehIPRru.mjs");
var Route$7 = createFileRoute("/auth")({
	head: () => ({ meta: [
		{ title: "Entrar — Incrível Poker All In" },
		{
			name: "description",
			content: "Entre ou crie sua conta pra jogar Multiplayer online."
		},
		{
			property: "og:title",
			content: "Entrar · Incrível Poker"
		},
		{
			property: "og:description",
			content: "Login pra Multiplayer online."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./settings-DKAD1sWz.mjs");
var Route$6 = createFileRoute("/settings")({
	head: () => ({ meta: [
		{ title: "Ajustes — Incrível Poker All In" },
		{
			name: "description",
			content: "Personalize tema da mesa, som e modalidades preferidas."
		},
		{
			property: "og:title",
			content: "Ajustes · Incrível Poker"
		},
		{
			property: "og:description",
			content: "Escolha o tema da mesa e outras preferências."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var BASE_URL = "";
var Route$5 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	const xml = [
		`<?xml version="1.0" encoding="UTF-8"?>`,
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
		...[
			{
				path: "/",
				changefreq: "weekly",
				priority: "1.0"
			},
			{
				path: "/tutorial",
				changefreq: "monthly",
				priority: "0.7"
			},
			{
				path: "/settings",
				changefreq: "monthly",
				priority: "0.5"
			},
			{
				path: "/play/casual",
				changefreq: "weekly",
				priority: "0.8"
			},
			{
				path: "/play/zen",
				changefreq: "weekly",
				priority: "0.7"
			},
			{
				path: "/play/campaign",
				changefreq: "weekly",
				priority: "0.8"
			},
			{
				path: "/play/multiplayer",
				changefreq: "weekly",
				priority: "0.6"
			}
		].map((e) => [
			`  <url>`,
			`    <loc>${BASE_URL}${e.path}</loc>`,
			e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
			e.priority ? `    <priority>${e.priority}</priority>` : null,
			`  </url>`
		].filter(Boolean).join("\n")),
		`</urlset>`
	].join("\n");
	return new Response(xml, { headers: {
		"Content-Type": "application/xml",
		"Cache-Control": "public, max-age=3600"
	} });
} } } });
var $$splitComponentImporter$4 = () => import("./tutorial-D2PfRl5i.mjs");
var Route$4 = createFileRoute("/tutorial")({
	head: () => ({ meta: [
		{ title: "Como Jogar — Incrível Poker All In" },
		{
			name: "description",
			content: "Aprenda a hierarquia das mãos e as regras do Hold'em, Omaha e Short Deck."
		},
		{
			property: "og:title",
			content: "Tutorial · Incrível Poker"
		},
		{
			property: "og:description",
			content: "Aprenda as regras de todas as modalidades em estilo HQ."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./play.campaign-DzrXgm9H.mjs");
var Route$3 = createFileRoute("/play/campaign")({
	head: () => ({ meta: [
		{ title: "Campanha — Copa do Mundo de Poker HQ" },
		{
			name: "description",
			content: "Enfrente chefes caricatos em uma jornada narrativa de poker."
		},
		{
			property: "og:title",
			content: "Campanha · Incrível Poker"
		},
		{
			property: "og:description",
			content: "Copa do Mundo de Poker HQ."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./play.casual-Dwsw7b8y.mjs");
var Route$2 = createFileRoute("/play/casual")({
	head: () => ({ meta: [
		{ title: "Casual — Incrível Poker All In" },
		{
			name: "description",
			content: "Partida casual: Hold'em, Omaha ou Short Deck contra a IA em estilo HQ."
		},
		{
			property: "og:title",
			content: "Casual · Incrível Poker"
		},
		{
			property: "og:description",
			content: "Escolha modalidade, adversário e jogue."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./play.multiplayer-7gSkekZG.mjs");
var Route$1 = createFileRoute("/play/multiplayer")({
	head: () => ({ meta: [
		{ title: "Multiplayer — Incrível Poker All In" },
		{
			name: "description",
			content: "Crie uma sala privada e convide amigos pra jogar poker online, sem cadastro."
		},
		{
			property: "og:title",
			content: "Multiplayer · Incrível Poker"
		},
		{
			property: "og:description",
			content: "Sala privada, código pra compartilhar. Sem login."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./play.zen-BXQ_-ChO.mjs");
var Route = createFileRoute("/play/zen")({
	head: () => ({ meta: [
		{ title: "Zen Poker — Incrível Poker All In" },
		{
			name: "description",
			content: "Modo relax: blinds baixas, sem pressão, foco em treino. Hold'em, Omaha ou Short Deck."
		},
		{
			property: "og:title",
			content: "Zen Poker · Incrível Poker"
		},
		{
			property: "og:description",
			content: "Treine poker sem pressão."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$8.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$9
});
var AuthRoute = Route$7.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$9
});
var SettingsRoute = Route$6.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$9
});
var SitemapDotxmlRoute = Route$5.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$9
});
var TutorialRoute = Route$4.update({
	id: "/tutorial",
	path: "/tutorial",
	getParentRoute: () => Route$9
});
var PlayCampaignRoute = Route$3.update({
	id: "/play/campaign",
	path: "/play/campaign",
	getParentRoute: () => Route$9
});
var PlayCasualRoute = Route$2.update({
	id: "/play/casual",
	path: "/play/casual",
	getParentRoute: () => Route$9
});
var PlayMultiplayerRoute = Route$1.update({
	id: "/play/multiplayer",
	path: "/play/multiplayer",
	getParentRoute: () => Route$9
});
var PlayZenRoute = Route.update({
	id: "/play/zen",
	path: "/play/zen",
	getParentRoute: () => Route$9
});
var PlayMultiplayerRouteChildren = { PlayMultiplayerCodeRoute: Route$10.update({
	id: "/$code",
	path: "/$code",
	getParentRoute: () => PlayMultiplayerRoute
}) };
var rootRouteChildren = {
	IndexRoute,
	AuthRoute,
	SettingsRoute,
	SitemapDotxmlRoute,
	TutorialRoute,
	PlayCampaignRoute,
	PlayCasualRoute,
	PlayMultiplayerRoute: PlayMultiplayerRoute._addFileChildren(PlayMultiplayerRouteChildren),
	PlayZenRoute
};
var routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };

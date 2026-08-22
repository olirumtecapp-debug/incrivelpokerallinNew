import { i as __toESM } from "../_runtime.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as ComicButton } from "./ComicButton-C6kzs4iI.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AvatarBadge } from "./AvatarPicker-CbZ3CfpK.mjs";
import { n as PokerTable, r as usePokerStore, t as PERSONALITIES } from "./PokerTable-D9YB4BLX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/play.campaign-DzrXgm9H.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STAGES = [
	{
		id: 1,
		country: "Vilarejo dos Bluffs",
		flag: "🏘️",
		bossId: "aprendiz",
		intro: "Sua primeira parada. O Zé Cartinhas mal sabe embaralhar!"
	},
	{
		id: 2,
		country: "Reino do Sorriso",
		flag: "🌈",
		bossId: "sorridente",
		intro: "Dona Sorriso te recebe com um chá... e um par de damas."
	},
	{
		id: 3,
		country: "Metrópole dos Naipes",
		flag: "🏙️",
		bossId: "tatico",
		intro: "Doutor Naipe calcula tudo. Prepare-se pra matemática."
	},
	{
		id: 4,
		country: "Fortaleza do Blefe",
		flag: "🏰",
		bossId: "mestre",
		intro: "O chefão. Vilão do Blefe. Só coragem te salva agora."
	}
];
var STORAGE_KEY = "ip_campaign_progress";
function CampaignPage() {
	const [progress, setProgress] = (0, import_react.useState)(1);
	const [activeStage, setActiveStage] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) setProgress(parseInt(saved, 10) || 1);
	}, []);
	if (activeStage) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampaignMatch, {
		stage: activeStage,
		boss: PERSONALITIES.find((p) => p.id === activeStage.bossId),
		onExit: () => setActiveStage(null),
		onWin: () => {
			const newP = Math.max(progress, activeStage.id + 1);
			setProgress(newP);
			localStorage.setItem(STORAGE_KEY, String(newP));
			setActiveStage(null);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "ink-border-thick bg-pow-red p-4 flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "font-display text-xl text-white shrink-0",
				children: "← MENU"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl md:text-3xl text-white truncate",
				children: "🏆 COPA DO MUNDO DE POKER HQ"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "max-w-4xl mx-auto p-4 md:p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "halftone-red ink-border-thick hard-shadow-sm inline-block px-4 py-1 -rotate-2 mb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl text-white",
						children: "MAPA DA JORNADA"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: STAGES.map((s) => {
						const boss = PERSONALITIES.find((p) => p.id === s.bossId);
						const locked = s.id > progress;
						const completed = s.id < progress;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							disabled: locked,
							onClick: () => setActiveStage(s),
							className: `w-full ink-border-thick hard-shadow rounded-lg p-4 text-left transition-transform disabled:opacity-40 disabled:cursor-not-allowed ${completed ? "bg-pow-yellow text-ink-fixed" : "bg-card"} enabled:hover:-translate-y-1 enabled:hover:-translate-x-1`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-5xl shrink-0",
										children: s.flag
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-display text-xl",
												children: [
													"FASE ",
													s.id,
													" · ",
													s.country
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-sm",
												children: [
													"Chefe: ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-bold text-pow-red",
														children: boss.name
													}),
													" (",
													boss.title,
													")"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground mt-1",
												children: s.intro
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "shrink-0",
										children: [
											locked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-3xl",
												children: "🔒"
											}),
											completed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-3xl",
												children: "✅"
											}),
											!locked && !completed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-display text-pow-red",
												children: "JOGAR →"
											})
										]
									})
								]
							})
						}, s.id);
					})
				}),
				progress > STAGES.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 ink-border-thick hard-shadow bg-pow-yellow text-ink-fixed p-4 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-3xl",
						children: "🏆 CAMPEÃO MUNDIAL!"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm mt-1",
						children: "Você conquistou a Copa do Mundo de Poker HQ."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 flex justify-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComicButton, {
						variant: "secondary",
						size: "sm",
						onClick: () => {
							localStorage.removeItem(STORAGE_KEY);
							setProgress(1);
						},
						children: "Reiniciar progresso"
					})
				})
			]
		})]
	});
}
function CampaignMatch({ stage, boss, onExit, onWin }) {
	const [showIntro, setShowIntro] = (0, import_react.useState)(true);
	if (showIntro) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background flex items-center justify-center p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-lg w-full ink-border-thick hard-shadow-lg bg-card rounded-lg p-6 -rotate-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-6xl text-center mb-3",
					children: stage.flag
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-display text-2xl text-center mb-1",
					children: ["FASE ", stage.id]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-xl text-center text-pow-red mb-4",
					children: stage.country
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ink-border bg-white text-ink-fixed p-3 rounded font-body italic text-center",
					children: [
						"\"",
						stage.intro,
						"\""
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-center justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarBadge, {
						avatarId: boss.avatarId,
						size: 56,
						className: "ink-border-thick"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-lg",
						children: boss.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-bold text-pow-red",
						children: boss.title
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex gap-2 justify-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComicButton, {
						variant: "danger",
						onClick: onExit,
						children: "VOLTAR"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComicButton, {
						variant: "primary",
						onClick: () => setShowIntro(false),
						children: "DUELAR!"
					})]
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PokerTable, {
			difficulty: boss.difficulty,
			modeLabel: `CAMPANHA · FASE ${stage.id} · ${stage.country}`,
			smallBlind: 10 + stage.id * 5,
			bigBlind: 20 + stage.id * 10,
			startStack: 1e3
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampaignWinWatcher, { onWin })]
	});
}
function CampaignWinWatcher({ onWin }) {
	const state = usePokerStore((s) => s.state);
	(0, import_react.useEffect)(() => {
		if (!state) return;
		const alive = state.players.filter((p) => p.stack > 0);
		if (alive.length === 1 && alive[0].id === "human" && state.awaitingAdvance) {
			const t = setTimeout(onWin, 2200);
			return () => clearTimeout(t);
		}
	}, [state, onWin]);
	return null;
}
//#endregion
export { CampaignPage as component };

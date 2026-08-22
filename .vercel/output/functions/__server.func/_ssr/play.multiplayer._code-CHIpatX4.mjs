import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/play.multiplayer._code-CHIpatX4.js
var $$splitComponentImporter = () => import("./play.multiplayer._code-4ymL5bFG.mjs");
var Route = createFileRoute("/play/multiplayer/$code")({
	head: ({ params }) => ({ meta: [
		{ title: `Sala ${params.code} — Incrível Poker` },
		{
			name: "description",
			content: "Sala privada de poker online, sem cadastro."
		},
		{
			property: "og:title",
			content: `Sala ${params.code}`
		},
		{
			property: "og:description",
			content: "Entre na sala com o código."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

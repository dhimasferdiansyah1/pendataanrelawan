import { T as createAstro, g as addAttribute, h as renderHead, s as renderSlot, u as renderTemplate } from "./server_B0MT1nrk.mjs";
import { t as createComponent } from "./compiler_DnNyo6ID.mjs";
//#region src/layouts/Layout.astro
createAstro("https://astro.build");
var $$Layout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Layout;
	const { title = "Sistem Pendataan Relawan - Dapur SPPG Pahlawan", description = "Sistem resmi pendataan relawan Dapur SPPG Pahlawan. Daftarkan diri Anda sebagai bagian dari gerakan sosial masyarakat." } = Astro.props;
	return renderTemplate`<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro.generator, "content")}><!-- SEO Meta Tags --><title>${title}</title><meta name="description"${addAttribute(description, "content")}><meta name="theme-color" content="#0f172a"><!-- Google Fonts: Plus Jakarta Sans --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">${renderHead($$result)}</head><body class="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased selection:bg-slate-900 selection:text-white">${renderSlot($$result, $$slots["default"])}</body></html>`;
}, "E:/website/pendataanrelawan/src/layouts/Layout.astro", void 0);
//#endregion
export { $$Layout as t };

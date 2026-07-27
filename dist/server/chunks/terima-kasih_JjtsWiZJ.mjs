import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
import { T as createAstro, i as renderComponent, m as maybeRenderHead, u as renderTemplate } from "./server_B0MT1nrk.mjs";
import { t as createComponent } from "./compiler_DnNyo6ID.mjs";
import { t as $$Layout } from "./Layout_B31tFFr4.mjs";
//#region src/pages/terima-kasih.astro
var terima_kasih_exports = /* @__PURE__ */ __exportAll({
	default: () => $$TerimaKasih,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://astro.build");
var $$TerimaKasih = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$TerimaKasih;
	const nama = Astro.url.searchParams.get("nama") || "Relawan";
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Terima Kasih | Dapur SPPG Pahlawan" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main class="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-slate-50"><div class="w-full max-w-md mx-auto text-center space-y-6"><!-- Logo --><img src="/bgn.png" alt="Logo Dapur SPPG Pahlawan" class="h-14 w-auto object-contain mx-auto"><!-- Success Icon --><div class="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto border-2 border-emerald-200"><svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg></div><!-- Message --><div class="space-y-2"><h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Terima Kasih!</h1><p class="text-slate-600 text-sm leading-relaxed">Atas nama <span class="font-bold text-slate-900">${nama}</span>, pendaftaran Anda telah berhasil disubmit.</p><p class="text-xs text-slate-400">Kami akan segera menghubungi Anda. Semangat bertugas, Relawan SPPG Pahlawan!</p></div><!-- Back Button --><a href="/" class="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors underline underline-offset-4">← Kembali ke halaman pendaftaran</a></div></main>` })}`;
}, "E:/website/pendataanrelawan/src/pages/terima-kasih.astro", void 0);
var $$file = "E:/website/pendataanrelawan/src/pages/terima-kasih.astro";
var $$url = "/terima-kasih";
//#endregion
//#region \0virtual:astro:page:src/pages/terima-kasih@_@astro
var page = () => terima_kasih_exports;
//#endregion
export { page };

import { t as __exportAll } from "./rolldown-runtime_BBjsoOtd.mjs";
//#region src/pages/api/login.ts
var login_exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ request, cookies }) => {
	try {
		const { password } = await request.json();
		if (password === (process.env.ADMIN_PASSWORD || "sppgpahlawan2026")) {
			cookies.set("admin_session", "authenticated", {
				path: "/",
				httpOnly: true,
				maxAge: 3600 * 24 * 7,
				sameSite: "lax"
			});
			return new Response(JSON.stringify({
				success: true,
				message: "Login berhasil"
			}), {
				status: 200,
				headers: { "Content-Type": "application/json" }
			});
		} else return new Response(JSON.stringify({
			success: false,
			message: "Password salah"
		}), {
			status: 401,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		return new Response(JSON.stringify({
			success: false,
			message: error.message || "Gagal login"
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
var DELETE = async ({ cookies }) => {
	cookies.delete("admin_session", { path: "/" });
	return new Response(JSON.stringify({
		success: true,
		message: "Logout berhasil"
	}), {
		status: 200,
		headers: { "Content-Type": "application/json" }
	});
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/login@_@ts
var page = () => login_exports;
//#endregion
export { page };

/* NOUVEL ÉLAN — client de synchronisation (non chargé par index.html).
 * Ne contient aucun mot de passe ni clé de service.
 * Les requêtes nominatives exigent un jeton Supabase Auth d'enseignant.
 */
(function (global) {
  "use strict";
  const base = "https://jipvubvkkmkblxqvzreg.supabase.co/functions/v1";
  const schools = new Set(["sc", "sp", "osee"]);
  const classes = new Set(["6e1", "6e2", "5e1", "5e2", "4e1", "4e2", "3e1", "3e2"]);
  function check(school, cls) {
    if (!schools.has(school) || !classes.has(cls)) throw new Error("Établissement ou classe invalide");
  }
  async function call(path, { method = "GET", token, body, signal } = {}) {
    const headers = { Accept: "application/json" };
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (token) headers.Authorization = "Bearer " + token;
    const response = await fetch(base + path, {
      method, headers, body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store", credentials: "omit", signal
    });
    let payload;
    try { payload = await response.json(); } catch { throw new Error("Réponse du serveur invalide"); }
    if (!response.ok) throw new Error(payload.error || "Erreur de synchronisation");
    return payload;
  }
  const encode = encodeURIComponent;
  const query = (school, cls) => "?school=" + encode(school) + "&class=" + encode(cls);
  const api = Object.freeze({
    async sessionStatus(school, cls, signal) {
      check(school, cls);
      return call("/ne-session-status" + query(school, cls), { signal });
    },
    async teacherSession(school, cls, action, teacherJwt) {
      check(school, cls);
      if (!["open", "close", "next", "reset"].includes(action)) throw new Error("Action invalide");
      if (!teacherJwt) throw new Error("Connexion adulte sécurisée requise");
      return call("/ne-teacher-sessions", {
        method: "POST", token: teacherJwt,
        body: { school, class_name: cls, action }
      });
    },
    async teacherReports(school, cls, teacherJwt) {
      check(school, cls);
      if (!teacherJwt) throw new Error("Connexion adulte sécurisée requise");
      return call("/ne-teacher-reports" + query(school, cls), { token: teacherJwt });
    }
  });
  Object.defineProperty(global, "NouvelElanSync", { value: api, writable: false, configurable: false });
})(window);

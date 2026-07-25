const fs = require("node:fs/promises");
const path = require("node:path");
const { chromium } = require("playwright");

const base = "http://127.0.0.1:4321";
const pasta = path.join(process.cwd(), "qa");

async function inspecionarPagina(browser, rota, viewport, nome) {
  const page = await browser.newPage({ viewport });
  const erros = [];
  page.on("console", (mensagem) => {
    if (mensagem.type() === "error") erros.push(mensagem.text());
  });
  page.on("pageerror", (erro) => erros.push(erro.message));

  const resposta = await page.goto(`${base}${rota}`, {
    waitUntil: "domcontentloaded"
  });
  await page.screenshot({
    path: path.join(pasta, `${nome}.png`),
    fullPage: true
  });

  const metricas = await page.evaluate(() => ({
    titulo: document.title,
    h1: document.querySelector("h1")?.textContent?.trim(),
    larguraDocumento: document.documentElement.scrollWidth,
    larguraViewport: window.innerWidth,
    alturaDocumento: document.documentElement.scrollHeight,
    linksSemTexto: [...document.querySelectorAll("a")].filter(
      (link) => !link.textContent?.trim() && !link.getAttribute("aria-label")
    ).length
  }));

  await page.close();
  return {
    rota,
    status: resposta?.status(),
    ...metricas,
    overflowHorizontal:
      metricas.larguraDocumento > metricas.larguraViewport + 2,
    erros
  };
}

(async () => {
  await fs.mkdir(pasta, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath:
      process.env.BROWSER_PATH ||
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  });

  const resultados = [];
  resultados.push(
    await inspecionarPagina(
      browser,
      "/",
      { width: 1440, height: 1000 },
      "inicio-desktop"
    )
  );
  resultados.push(
    await inspecionarPagina(
      browser,
      "/",
      { width: 390, height: 844 },
      "inicio-celular"
    )
  );
  resultados.push(
    await inspecionarPagina(
      browser,
      "/produtos/tapo-l530e/",
      { width: 1440, height: 1000 },
      "produto-desktop"
    )
  );
  resultados.push(
    await inspecionarPagina(
      browser,
      "/artigos/tapo-l530e-funciona-com-alexa-e-google-home/",
      { width: 390, height: 844 },
      "artigo-celular"
    )
  );

  const rotas = [
    "/",
    "/artigos/",
    "/artigos/intelbras-ews-305-funciona-com-alexa/",
    "/artigos/intelbras-ews-410-e-bivolt/",
    "/artigos/tapo-l530e-funciona-com-alexa-e-google-home/",
    "/como-verificamos/",
    "/produtos/",
    "/produtos/tapo-l530e/",
    "/produtos/intelbras-ews-410/",
    "/produtos/intelbras-ews-305/",
    "/sobre/"
  ];

  const requisicoes = await Promise.all(
    rotas.map(async (rota) => {
      const resposta = await fetch(`${base}${rota}`);
      return { rota, status: resposta.status };
    })
  );

  await browser.close();

  console.log(
    JSON.stringify(
      {
        telas: resultados,
        linksInternos: requisicoes,
        aprovado:
          resultados.every(
            (item) =>
              item.status === 200 &&
              !item.overflowHorizontal &&
              item.linksSemTexto === 0 &&
              item.erros.length === 0
          ) && requisicoes.every((item) => item.status === 200)
      },
      null,
      2
    )
  );
})().catch((erro) => {
  console.error(erro);
  process.exit(1);
});

# OAKTOPUS — Notas do Projeto

> Se você está lendo isso em uma sessão nova: leia este arquivo para retomar o contexto do projeto.

## Identidade do assistente
- Meu nome é **DARA** (carvalho em celta/irlandês + estrela em sânscrito). O usuário pode me chamar assim.

## O que é
Loja online **OAKTOPUS** (bonés personalizados + roupas/equipamentos de pesca).
- Site em inglês, preços em USD, loja física de: Anna, Texas.
- Fundado em 10/10/2024. Conceito: carvalho (oak) + polvo (topus).
- Lema: "STAY TRUE – STAY WILD."
- Instagram/Facebook: @Oaktopus.store (o usuário ainda não tem YouTube nem WhatsApp).

## Local do projeto
- Código: `J:\OAKTOPUS WEBSITE\site 3\square-store\`
- Repositório GitHub: `https://github.com/Oaktopus/square-store` (branch `main`)
- Hospedagem: **Render** (grátis) — site live em `https://square-store.onrender.com`
- Domínio: `oaktopus.store` / `www.oaktopus.store` (Namecheap, DNS apontado para o Render: A record 216.24.57.1 + CNAME www → square-store.onrender.com)
- E-mail da loja: `hello@oaktopus.store` (Namecheap Private Email, webmail em privateemail.com)

## Deploy
1. Alterar arquivos em `square-store/`
2. `git add -A && git commit -m "..." && git push origin main`
3. Render auto-redeploy (~1-2 min). Testar em `https://www.oaktopus.store`

Credenciais do Git (local): Oaktopus / Glaquerf@hotmail.com
Token GitHub: salvo no Gerenciador de Credenciais do Windows (helper: manager).

## Catálogo (11 produtos em public/data/products.json, preços em centavos)
| id | Produto | Preço | Categoria |
|---|---|---|---|
| hat-trucker | Trucker Cap | 2999 | Custom Hats |
| hat-snapback | Snapback | 3199 | Custom Hats |
| hat-dad | Dad Hat | 2999 | Custom Hats |
| hat-fivepanel | Five Panel | 3399 | Custom Hats |
| hat-christian | Christian Hat (pronto) | 2390 | Christian Apparel |
| shirt-fishing-sublimation | Fishing Shirt — Sublimação | 3290 | Fishing Shirts |
| shirt-dtf | Oaktopus Tee — DTF | 1990 | T-Shirts |
| shirt-christian-dtf | Christian Faith Tee — DTF | 1990 | Christian Apparel |
| tumbler-40oz | Tumbler 40oz | 2990 | Tumblers |
| tumbler-20oz | Tumbler 20oz | 2490 | Tumblers |
| hoodie-faith | Faith & Wild Hoodie | 5999 | Christian Apparel |

## Hat Builder (public/hat-builder.html + js/hat-builder.js)
- Wizard 3 passos: Style & Color → Patch → Text & Review
- 4 modelos base: Trucker, Snapback, Dad Hat, Five Panel
- 8 cores (hexes extraídos da foto da prateleira): Navy #394F76, Black #242026, Red #C03F41, Pink/Salmon #D27B76, Khaki #BEB1AB, Olive #84A476, Grey #91979C, Brown #715F61
- Foto de referência das cores: `public/img/shelf-1.jpg` e `shelf-2.jpg` (prateleira com todos os bonés)
- Patches (preço FIXO pelo patch, modelo não muda o preço):
  - Embroidered: $29.90
  - Laser Engraved: $23.90
  - UV Printed Leatherette: $26.90
- Texto personalizado: +$8.00
- Preços sincronizados em 4 arquivos: public/js/cart.js, public/js/checkout.js, public/js/hat-builder.js, server.js
- Regra de segurança: opção só muda preço se `options.patch` existir; caso contrário usa `product.price`

## Carrinho
- localStorage chave `cart`, formato `{id: {qty, options}}`
- `public/js/cart.js` injeta drawer/toast em todas as páginas

## Checkout (Square)
- SDK Square v39: usa `Client`, `Environment`, `PaymentsApi.createPayment` (NÃO `SquareClient`/`SquareEnvironment`)
- Backend `server.js` recalcula o total (nunca confia no navegador), preços em centavos USD
- **PENDENTE**: o usuário ainda NÃO criou a conta Square Developer. `.env` com placeholders. Checkout em modo sandbox.
- Quando configurar: SQUARE_ACCESS_TOKEN, SQUARE_APPLICATION_ID, SQUARE_LOCATION_ID, SQUARE_ENVIRONMENT=sandbox; depois trocar o script sandbox → production em checkout.html

## Páginas
- `/` Home (hero + categorias + Watch the Collection + Follow the Wild)
- `/shop.html` catálogo com filtros
- `/hat-builder.html` builder
- `/about.html` história real (oak+topus, 10/10/24, Anna TX, blanks com etiqueta própria)
- `/contact.html` contato real (email hello@oaktopus.store, telefone (818) 538-6001, IG/FB @Oaktopus.store)
- `/shipping.html` Shipping & Policies (frete, devoluções, pedidos custom)
- Rodapé com ícones de Instagram/Facebook em todas as páginas

## SEO (feito em 31/07/2026)
- Meta description + Open Graph + canonical em todas as páginas
- Favicon: `public/img/favicon.svg` (O de octopus + folha de carvalho)
- `public/sitemap.xml` (6 URLs) e `public/robots.txt`
- Dados estruturados (JSON-LD Store + WebSite) no index.html
- **Google Search Console**: domínio `oaktopus.store` verificado via DNS TXT (`google-site-verification=Lt8gukKc3q1EEBrUi7HHoThUKgyAYoKd-1P52xm24_g`), sitemap enviado, indexação da Home solicitada (30/07–31/07)
- **Google Business Profile**: criado (OAKTOPUS, telefone (818) 538-6001, site, categoria bonés). Aguardando revisão do Google (dias a ~2 semanas)

## Contato / Telefone
- **Número comercial (Google Voice): (818) 538-6001** — usuário vai se mudar para a California, por isso código 818 (LA)
- Número pessoal do usuário: (469) 235-2403 (usado só p/ verificação, NÃO colocar no site)
- WhatsApp Business: usuário vai registrar o 818 no app (pessoal dele fica no WhatsApp normal)
- Caller ID "OAKTOPUS": só via WhatsApp Business (grátis) ou serviços pagos (OpenPhone ~$20/mês) — Google Voice não permite customizar nome do caller ID

## Redes sociais
- Footer: ícones IG + FB em todas as páginas (imagens próprias da marca: `img/icon-instagram.png` e `img/icon-facebook.png`, círculo 38px)
- **Facebook**: link correto é `https://www.facebook.com/profile.php?id=61592572917689` (o @Oaktopus.store não abre) — já atualizado no site
- Home: seção "Watch the Collection" (4 cards de vídeo com thumbnails em public/img/videos/, links atualmente para o perfil do Instagram)
- **PENDENTE**: o usuário vai mandar os links específicos dos posts/reels do Instagram para trocar em cada card
- YouTube/WhatsApp: WhatsApp Business em configuração com o 818; YouTube ainda não existe

## Vídeos
- Origem: `J:\OAKTOPUS VIDEOS\shorts\...` (muitos clipes por modelo: crawfish, striped bass, mortal kombat, etc.)
- Thumbnails geradas com ffmpeg em `public/img/videos/thumb-*.jpg` (de: slowdown, crawfish, crab, MAMAE)
- Não subir vídeos pesados no site (banda do Render grátis) — usar links do Instagram

## PENDENTES (próximos passos)
1. **[EM ANDAMENTO] Fotos reais**: o usuário está tirando fotos dos produtos (bonés por modelo/cor, shirts, tumblers). Ele colocará em `J:\OAKTOPUS WEBSITE\site 3\FOTOS\`. Depois: copiar para `public/img/`, comprimir com ffmpeg, atualizar hat-builder.js (modelos/cores) e products.json (imagens), publicar.
2. **Square**: criar conta developer.squareup.com, depois adicionar `SQUARE_APPLICATION_ID`, `SQUARE_LOCATION_ID` e trocar `SQUARE_ACCESS_TOKEN` nas **env vars do Worker Cloudflare** (não mais no server/.env).
3. **Links do Instagram**: o usuário vai mandar os links específicos dos posts para os cards de vídeo.
4. **Google Business Profile**: aguardando revisão/publicação (dias a ~2 semanas).
5. **WhatsApp Business**: registrar o 818 no app; depois colocar link `wa.me/18185386001` no site.
6. **YouTube**: quando criar, adicionar nas redes.
7. **Render**: usuário vai deletar o serviço `square-store` no dashboard.render.com (nada aponta mais pra lá; site 100% Cloudflare).

## Log de conversa — 31/07/2026 (sessão longa)
- **Revisão ao vivo do site** (Playwright): Home, Shop (11 produtos + filtros), Hat Builder (fluxo completo Trucker→Navy→Embroidered→$29.90→Add to Cart) e mobile (390px) OK.
- **SEO implementado**: meta description/OG/canonical em todas as páginas, favicon.svg, sitemap.xml, robots.txt, JSON-LD Store+WebSite.
- **Google Search Console**: domínio `oaktopus.store` verificado via TXT; sitemap enviado; indexação da Home solicitada. **Status: OK.**
- **Google Business Profile**: criado com descrição (sem telefone/URL — regra do Google), username "Oaktopus". Google Workspace foi oferecido e **recusado** (não é necessário). **Status: aguardando revisão.**
- **Google Voice**: número comercial **(818) 538-6001** escolhido (usuário vai se mudar para a **California**, por isso 818 = LA). Número pessoal (469) 235-2403 NÃO deve ir para o site.
- **WhatsApp Business**: usuário vai instalar o app separado do WhatsApp pessoal e registrar o 818. Quer caller ID "OAKTOPUS" — explicado que só WhatsApp Business (grátis) ou serviço pago (OpenPhone). **Status: pendente de registro.**
- **Ícones sociais**: trocados emojis 📷👍 por fotos da marca (PNG comprimidos de 1MB→~78KB, circulares 38px/64px). Teve inversão FB/IG corrigida.
- **Facebook**: link corrigido para `https://www.facebook.com/profile.php?id=61592572917689`.
- **Rodapé**: "Crafted in Texas." em todas as páginas (substituiu "Crafted in the USA").
- **Página Shipping & Policies** criada e linkada no rodapé (frete, devoluções, pedidos custom).
- **Subtítulo Home**: "See how we do it — tap to watch on Instagram."
- **Bug corrigido**: tag `<footer>` faltando no index.html.
- **Namecheap**: login automático bloqueado por reCAPTCHA; usuário adicionou o TXT manualmente (feito).
- Próximos: fotos reais, Square, links dos Reels, WhatsApp Business.

## Log de conversa — 01/08/2026 (migração Cloudflare)
- **Migração concluída: Render → Cloudflare.** GitHub = conta `Oaktopus` (email Glaquerf@hotmail.com).
- **Cloudflare Worker `square-store`** com static assets + API entrypoint: `src/index.js` + `wrangler.jsonc` (assets = `public`, binding ASSETS). Deploy automático no `git push` pro main.
- **APIs no Worker**: `/api/products` (11 produtos), `/api/config`, `/api/checkout` (Square via REST fetch, sem SDK Node). Endpoints 200.
- **Dominio**: nameservers agora são **nadia.ns.cloudflare.com + cosmin.ns.cloudflare.com** (a troca na Namecheap quase deu errado — usuário salvou placeholders `xxx`/`yyy` que não existem; corrigido). Registros DNS preservados na Cloudflare: MX mx1/mx2.privateemail.com, TXT SPF + google-site-verification, CNAME mail/autodiscover/autoconfig, SRV _autodiscover._tcp, TXT DKIM `default._domainkey`. **Atenção: domínio ficou com redirect apex → www** (oaktopus.store → 301 → www.oaktopus.store).
- **Env vars no Worker (Settings → Variables and secrets)**: `SQUARE_ENVIRONMENT=sandbox` + `SQUARE_ACCESS_TOKEN` (secret). `SQUARE_APPLICATION_ID`/`SQUARE_LOCATION_ID` **ainda não existem** (Square não criada) → site mostra "Square is not configured yet. Payments will be available soon." (checkout.js agora detecta placeholder).
- **server.js/functions/ removidos** (substituídos por src/index.js + wrangler.jsonc). Render pode ser desligado.
- Login GitHub descoberto na sessão: `Oaktopus` / Glaquerf@hotmail.com.

## Instalações no PC (se precisar recarregar PATH em sessão nova)
- Node.js LTS 24, ffmpeg (Gyan), Git, GitHub CLI (gh) — instalados via winget
- Em sessão nova do PowerShell: `$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")`

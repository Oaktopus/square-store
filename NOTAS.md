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
- `/contact.html` contato real (email hello@oaktopus.store, IG/FB @Oaktopus.store, WhatsApp coming soon)
- Rodapé com ícones de Instagram/Facebook em todas as páginas

## Redes sociais
- Footer: ícones IG + FB em todas as páginas
- Home: seção "Watch the Collection" (4 cards de vídeo com thumbnails em public/img/videos/, links atualmente para o perfil do Instagram)
- **PENDENTE**: o usuário vai mandar os links específicos dos posts/reels do Instagram para trocar em cada card
- YouTube/WhatsApp: ainda não existem (cards "coming soon")

## Vídeos
- Origem: `J:\OAKTOPUS VIDEOS\shorts\...` (muitos clipes por modelo: crawfish, striped bass, mortal kombat, etc.)
- Thumbnails geradas com ffmpeg em `public/img/videos/thumb-*.jpg` (de: slowdown, crawfish, crab, MAMAE)
- Não subir vídeos pesados no site (banda do Render grátis) — usar links do Instagram

## PENDENTES (próximos passos)
1. **[EM ANDAMENTO] Fotos reais**: o usuário está tirando fotos dos produtos (bonés por modelo/cor, shirts, tumblers). Ele colocará em `J:\OAKTOPUS WEBSITE\site 3\FOTOS\`. Depois: copiar para `public/img/`, comprimir com ffmpeg, atualizar hat-builder.js (modelos/cores) e products.json (imagens), publicar.
2. **Square**: criar conta developer.squareup.com, configurar credenciais, trocar sandbox→produção.
3. **Links do Instagram**: o usuário vai mandar os links específicos dos posts para os cards de vídeo.
4. **YouTube/WhatsApp**: quando criar, adicionar nas redes.

## Instalações no PC (se precisar recarregar PATH em sessão nova)
- Node.js LTS 24, ffmpeg (Gyan), Git, GitHub CLI (gh) — instalados via winget
- Em sessão nova do PowerShell: `$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")`

# Thiago | Legend

Cartão pessoal de Thiago, separado dos sites de loja e catálogo. Endereço previsto: https://thiago.uselegend.com.

Site estático em HTML, CSS e JavaScript, sem dependências de produção e sem banco de dados. A Vercel pode servir a raiz do repositório com framework `Other`, sem instalação e sem comando de build.

## Experiência

- Visual claro (papel creme, texto escuro, detalhes dourados), em estilo editorial: serifa fina com script.
- Abertura de cerca de 7 segundos: a evolução das logos da Legend (bruxo original, segundo bruxo e símbolo atual), a escrita LEGEND com "Feito para lendas" e o retrato do Thiago. As logos antigas ficam em `assets/logos/logo-1.png` e `assets/logos/logo-2.png`; se faltarem, a abertura pula essas etapas.
- Capa com retrato, nome e botões já na primeira tela.
- Quem é o Thiago, a trajetória (da ideia em 2022 às camisas de frase, as dificuldades, as primeiras bolsas bordadas, a fábrica própria, o Ronaldinho e os próximos voos), por que ter uma Legend, clubes clientes, links e fechamento.
- Fotos em `assets/fotos`, peças em recorte em `assets/pecas`, escudos em `assets/clientes` e vídeos em `assets/ronaldinho`. Fontes hospedadas em `assets/fonts`.

## Conteúdo

Telefone confirmado no repositório `legend-links`: +55 (62) 98344-5081. Os ativos originais foram copiados de `legend-links/public/brand`.

A foto pessoal de Thiago está em `assets/thiago.jpg`, copiada do arquivo enviado ao repositório e exibida no avatar sem filtros. A assinatura “Desenvolvido por HM Digital” aparece no rodapé, com link para o Instagram da agência. Nome completo, cargo específico, biografia pessoal e localização podem ser complementados quando confirmados. Não há endereço, Pix ou dados pessoais inventados.

Para trocar o avatar, adicione uma foto em `assets/` e atualize a imagem de `.avatar` no HTML e seu `object-fit` no CSS. Edite os textos e links em `index.html`, o contato em `thiago-legend.vcf` e o endereço de compartilhamento em `app.js`.

## Publicação

Conectar este repositório a um projeto Vercel e atribuir somente `thiago.uselegend.com`. Preservar os projetos e registros do domínio principal. Confirmar os registros DNS que a Vercel indicar para o subdomínio antes da entrega.

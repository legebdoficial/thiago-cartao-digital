# Thiago | Legend

Cartão pessoal de Thiago, separado dos sites de loja e catálogo. Endereço previsto: https://thiago.uselegend.com.

Site estático em HTML, CSS e JavaScript, sem dependências de produção e sem banco de dados. A Vercel pode servir a raiz do repositório com framework `Other`, sem instalação e sem comando de build.

## Experiência

- Abertura cinematográfica de cerca de 4,4 segundos: linha de luz dourada, símbolo Legend, retrato do Thiago revelado pelo centro e o nome entrando letra por letra; termina no mesmo retrato da capa. Botão para pular e opção de rever no rodapé.
- Capa em tela cheia com o retrato, WhatsApp em destaque e atalhos (ligar, salvar contato, Instagram, enviar).
- Números da Legend, "Sobre mim", momento Ronaldinho Edition com vídeo (em loop sem som, e completo com som ao tocar), galeria de fotos, links em cartões com foto, personalização e fechamento.
- Fotos otimizadas em `assets/fotos` (WebP) e vídeos em `assets/ronaldinho`, copiados da loja.
- Abertura uma vez por sessão. Com preferência de movimento reduzido, o cartão abre diretamente.
- Contato do Thiago por WhatsApp e telefone, vCard para agenda, compartilhamento nativo com alternativa de copiar link.
- Apresentação, catálogo, loja oficial, Instagram e personalização.
- Layout para celular com navegação por teclado, diálogo acessível e conteúdo disponível sem JavaScript.

## Conteúdo

Telefone confirmado no repositório `legend-links`: +55 (62) 98344-5081. Os ativos originais foram copiados de `legend-links/public/brand`.

A foto pessoal de Thiago está em `assets/thiago.jpg`, copiada do arquivo enviado ao repositório e exibida no avatar sem filtros. A assinatura “Desenvolvido por HM Digital” aparece no rodapé, com link para o Instagram da agência. Nome completo, cargo específico, biografia pessoal e localização podem ser complementados quando confirmados. Não há endereço, Pix ou dados pessoais inventados.

Para trocar o avatar, adicione uma foto em `assets/` e atualize a imagem de `.avatar` no HTML e seu `object-fit` no CSS. Edite os textos e links em `index.html`, o contato em `thiago-legend.vcf` e o endereço de compartilhamento em `app.js`.

## Publicação

Conectar este repositório a um projeto Vercel e atribuir somente `thiago.uselegend.com`. Preservar os projetos e registros do domínio principal. Confirmar os registros DNS que a Vercel indicar para o subdomínio antes da entrega.

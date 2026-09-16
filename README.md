# arkivo.site

Landing page do Arkivo: capa com a estação de azimute interativa.

Site estático puro (HTML/CSS/JS). Sem build step.

## Pré-visualizar localmente

```bash
python -m http.server 4173
```

Abra `http://localhost:4173`.

## Publicar no GitHub Pages

1. Em **Settings → Pages**, escolha branch `main` e pasta `/ (root)`.
2. Se o domínio for `arkivo.site`, crie um arquivo `CNAME` na raiz contendo só:

```text
arkivo.site
```

3. No DNS do domínio, aponte para o GitHub Pages conforme a documentação atual da GitHub.

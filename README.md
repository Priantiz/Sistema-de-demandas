# Sistema-de-demandas

O projeto consiste em um Sistema de Gerenciamento de Demandas desenvolvido com back-end em Python (Flask) e front-end em HTML, CSS e JavaScript. A aplicação tem como objetivo permitir o cadastro, visualização e acompanhamento de demandas, contendo informações como título, descrição, localização, status, categoria e solicitante.

Nesta etapa final do BootCamp, o sistema foi evoluído para funcionar de forma colaborativa, utilizando GitHub, branches, commits, Pull Requests e Code Review entre os integrantes da equipe. Além disso, a aplicação foi integrada a um banco de dados em nuvem (Supabase/PostgreSQL), garantindo que as demandas cadastradas sejam armazenadas de forma persistente e possam ser consultadas posteriormente.

O projeto também mantém as práticas das etapas anteriores, como testes automatizados, pipeline de CI/CD com GitHub Actions e deploy funcional da aplicação.

## Tecnologias utilizadas

- **Back-end:** Python, Flask
- **Front-end:** HTML, CSS, JavaScript
- **Banco de dados:** Supabase (PostgreSQL)
- **Testes:** Pytest
- **CI/CD:** GitHub Actions
- **Deploy:** https://sistema-de-demandas-flask.onrender.com/

## Funcionalidades

- Cadastro de novas demandas (título, descrição, localização, status, categoria e solicitante)
- Listagem de demandas com número de protocolo, status e localização
- Filtro de demandas por status (Pendente, Em andamento, Resolvido)
- Alteração de status de uma demanda
- Remoção de demandas
- Categorias e solicitantes carregados dinamicamente do banco de dados

## Como executar localmente

### Pré-requisitos
- Python 3.10+ instalado
- Conta no Supabase com o projeto configurado (tabelas `demandas`, `categorias` e `usuarios`)

### Passo a passo

1. Clone o repositório:
```bash
git clone https://github.com/Priantiz/Sistema-de-demandas.git
cd Sistema-de-demandas
```

2. Instale as dependências:
```bash
pip install flask requests
```

3. Configure a conexão com o Supabase:
   - Em `app.py`, defina `SUPABASE_URL` e `SUPABASE_KEY` (anon key)
   - Em `static/script.js`, defina `SUPABASE_URL` e `SUPABASE_KEY` (anon key)

4. Execute a aplicação:
```bash
python app.py
```

5. Acesse no navegador:
```
http://127.0.0.1:5000
```

## Banco de dados

Estrutura detalhada em [BANCO.md](BANCO.md).

Tabelas:
- `categorias` — categorias das demandas (Iluminação Pública, Buracos nas Vias, Limpeza Urbana, Segurança, Saneamento, Outros)
- `usuarios` — solicitantes cadastrados no sistema
- `demandas` — registros de ocorrências, relacionados a `categorias` e `usuarios`

## Testes

Para executar os testes automatizados:
```bash
pytest
```

## Links

- **Repositório:** https://github.com/Priantiz/Sistema-de-demandas
- **Aplicação publicada (Deploy):** _[adicionar link após publicação]_

## Equipe

| Nome | GitHub |
|---|---|
| Davi Castro | [@dcastroz](https://github.com/dcastroz) |
| Lucas Prianti | [@Priantiz](https://github.com/Priantiz) |
| Eduardo Moreira Chaves | [@duds1402](https://github.com/duds1402) |
| Pedro Bernardo Esteves | [@pedrobemelo](https://github.com/pedrobemelo) |
| Mateus Claudino | [@Tetocas](https://github.com/Tetocas) |

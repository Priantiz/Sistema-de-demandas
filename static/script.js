// ---------------------------------------------------------------
// Configuração do Supabase (apenas para leitura de categorias e
// usuários, usados nos selects do formulário).
// As demandas (criar/listar/remover) passam pelo back-end Flask
// em /demandas, que já está configurado com a SUPABASE_KEY.
// ---------------------------------------------------------------
const SUPABASE_URL = "https://yoamnqxfocjpbqewamta.supabase.co/rest/v1";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvYW1ucXhmb2NqcGJxZXdhbXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NDUxOTcsImV4cCI6MjA5NzAyMTE5N30.cdjwbxcNrEgk2mEgmf4a1zqfRkipy8uVKKrqoe6KQO0";

const supabaseHeaders = {
  "Content-Type": "application/json",
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`
};

// ---------------------------------------------------------------
// Elementos da página
// ---------------------------------------------------------------
const painelForm = document.getElementById("painel-form");
const btnAbrirForm = document.getElementById("btn-abrir-form");
const btnFecharForm = document.getElementById("btn-fechar-form");
const formDemanda = document.getElementById("form-demanda");
const formErro = document.getElementById("form-erro");
const listaDemandas = document.getElementById("lista-demandas");
const filtroStatus = document.getElementById("filtro-status");
const btnAtualizar = document.getElementById("btn-atualizar");
const selectCategoria = document.getElementById("categoria_id");
const selectUsuario = document.getElementById("usuario_id");

// ---------------------------------------------------------------
// Abrir / fechar formulário
// ---------------------------------------------------------------
btnAbrirForm.addEventListener("click", () => {
  painelForm.classList.remove("is-hidden");
  document.getElementById("titulo").focus();
});

btnFecharForm.addEventListener("click", () => {
  painelForm.classList.add("is-hidden");
  formErro.textContent = "";
});

// ---------------------------------------------------------------
// Carregar categorias e usuários para os selects
// ---------------------------------------------------------------
async function carregarSelects() {
  try {
    const [resCategorias, resUsuarios] = await Promise.all([
      fetch(`${SUPABASE_URL}/categorias?select=id,nome&order=nome.asc`, { headers: supabaseHeaders }),
      fetch(`${SUPABASE_URL}/usuarios?select=id,nome&order=nome.asc`, { headers: supabaseHeaders })
    ]);

    if (resCategorias.ok) {
      const categorias = await resCategorias.json();
      categorias.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.nome;
        selectCategoria.appendChild(opt);
      });
    }

    if (resUsuarios.ok) {
      const usuarios = await resUsuarios.json();
      usuarios.forEach(u => {
        const opt = document.createElement("option");
        opt.value = u.id;
        opt.textContent = u.nome;
        selectUsuario.appendChild(opt);
      });
    }
  } catch (erro) {
    console.error("Erro ao carregar categorias/usuários:", erro);
  }
}

// ---------------------------------------------------------------
// Registrar nova demanda
// ---------------------------------------------------------------
formDemanda.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  formErro.textContent = "";

  const titulo = document.getElementById("titulo").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const localizacao = document.getElementById("localizacao").value.trim();
  const status = document.getElementById("status").value;
  const categoria_id = selectCategoria.value || null;
  const usuario_id = selectUsuario.value || null;

  if (!titulo || !descricao) {
    formErro.textContent = "Título e descrição são obrigatórios.";
    return;
  }

  const btnSubmit = document.getElementById("btn-cadastrar");
  btnSubmit.disabled = true;
  btnSubmit.textContent = "Registrando...";

  try {
    const resposta = await fetch("/demandas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo,
        descricao,
        localizacao,
        status,
        categoria_id,
        usuario_id
      })
    });

    if (resposta.ok) {
      formDemanda.reset();
      painelForm.classList.add("is-hidden");
      await carregarDemandas();
    } else {
      const erro = await resposta.json();
      formErro.textContent = erro.erro || "Não foi possível registrar a demanda.";
    }
  } catch (erro) {
    formErro.textContent = "Erro de conexão com o servidor.";
    console.error(erro);
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.textContent = "Registrar demanda";
  }
});

// ---------------------------------------------------------------
// Listar demandas
// ---------------------------------------------------------------
function classeBadge(status) {
  switch ((status || "").toLowerCase()) {
    case "resolvido":
      return "badge--resolvido";
    case "em andamento":
      return "badge--andamento";
    default:
      return "badge--pendente";
  }
}

function escapeHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto ?? "";
  return div.innerHTML;
}

async function carregarDemandas() {
  listaDemandas.innerHTML = `<p class="estado-vazio">Carregando demandas...</p>`;

  try {
    const resposta = await fetch("/demandas");
    if (!resposta.ok) throw new Error("Falha ao buscar demandas");

    let demandas = await resposta.json();

    const filtro = filtroStatus.value;
    if (filtro) {
      demandas = demandas.filter(d => d.status === filtro);
    }

    if (!demandas.length) {
      listaDemandas.innerHTML = `<p class="estado-vazio">Nenhuma demanda encontrada. Clique em "Nova demanda" para registrar a primeira.</p>`;
      return;
    }

    listaDemandas.innerHTML = demandas.map(renderTicket).join("");
  } catch (erro) {
    listaDemandas.innerHTML = `<p class="estado-vazio">Não foi possível carregar as demandas. Verifique a conexão com o servidor.</p>`;
    console.error(erro);
  }
}

function renderTicket(d) {
  const protocolo = String(d.id).padStart(5, "0");
  const badge = classeBadge(d.status);

  return `
    <article class="ticket">
      <div class="ticket__protocol">
        #${protocolo}
        <span>Protocolo</span>
      </div>
      <div class="ticket__body">
        <h3>${escapeHtml(d.titulo)}</h3>
        <p>${escapeHtml(d.descricao)}</p>
        <div class="ticket__meta">
          <span class="badge ${badge}">${escapeHtml(d.status)}</span>
          ${d.localizacao ? `<span class="local">📍 ${escapeHtml(d.localizacao)}</span>` : ""}
        </div>
      </div>
      <div class="ticket__actions">
        <button class="btn btn--ghost" onclick="alterarStatus(${d.id}, '${d.status}')">Alterar status</button>
        <button class="btn btn--danger" onclick="removerDemanda(${d.id})">Remover</button>
      </div>
    </article>
  `;
}

// ---------------------------------------------------------------
// Alterar status (PATCH direto no Supabase)
// ---------------------------------------------------------------
async function alterarStatus(id, statusAtual) {
  const opcoes = ["Pendente", "Em andamento", "Resolvido"];
  const indiceAtual = opcoes.indexOf(statusAtual);
  const proximo = opcoes[(indiceAtual + 1) % opcoes.length];

  if (!confirm(`Alterar status para "${proximo}"?`)) return;

  try {
    const resposta = await fetch(`${SUPABASE_URL}/demandas?id=eq.${id}`, {
      method: "PATCH",
      headers: { ...supabaseHeaders, "Prefer": "return=representation" },
      body: JSON.stringify({ status: proximo })
    });

    if (resposta.ok) {
      await carregarDemandas();
    } else {
      alert("Não foi possível alterar o status.");
    }
  } catch (erro) {
    alert("Erro de conexão ao alterar status.");
    console.error(erro);
  }
}

// ---------------------------------------------------------------
// Remover demanda
// ---------------------------------------------------------------
async function removerDemanda(id) {
  if (!confirm("Tem certeza que deseja remover esta demanda?")) return;

  try {
    const resposta = await fetch(`/demandas/${id}`, { method: "DELETE" });

    if (resposta.ok) {
      await carregarDemandas();
    } else {
      alert("Não foi possível remover a demanda.");
    }
  } catch (erro) {
    alert("Erro de conexão ao remover demanda.");
    console.error(erro);
  }
}

// ---------------------------------------------------------------
// Filtro e atualização
// ---------------------------------------------------------------
filtroStatus.addEventListener("change", carregarDemandas);
btnAtualizar.addEventListener("click", carregarDemandas);

// ---------------------------------------------------------------
// Inicialização
// ---------------------------------------------------------------
carregarSelects();
carregarDemandas();

// ── Cadastrar demanda ──────────────────────────────────
document.getElementById("btn-cadastrar").addEventListener("click", async () => {
  const titulo      = document.getElementById("titulo").value.trim();
  const responsavel = document.getElementById("responsavel").value.trim();
  const descricao   = document.getElementById("descricao").value.trim();
  const status      = document.getElementById("status").value;
  const prioridade  = document.getElementById("prioridade").value;

  if (!titulo || !responsavel) {
    alert("Preencha o título e o responsável.");
    return;
  }

  const res = await fetch("/demandas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, responsavel, descricao, status, prioridade })
  });

  if (res.ok) {
    document.getElementById("titulo").value = "";
    document.getElementById("responsavel").value = "";
    document.getElementById("descricao").value = "";
    carregarDemandas();
  } else {
    const erro = await res.json();
    alert(erro.erro);
  }
});

// ── Listar demandas ────────────────────────────────────
async function carregarDemandas() {
  const res = await fetch("/demandas");
  const demandas = await res.json();
  const corpo = document.getElementById("corpo-tabela");

  if (demandas.length === 0) {
    corpo.innerHTML = '<tr><td colspan="7" class="vazio">Nenhuma demanda cadastrada.</td></tr>';
    return;
  }

  corpo.innerHTML = demandas.map(d => `
    <tr>
      <td>${d.id}</td>
      <td>
        <strong>${d.titulo}</strong>
        ${d.descricao ? `<br><span style="color:#888;font-size:12px">${d.descricao}</span>` : ""}
      </td>
      <td>${d.responsavel}</td>
      <td><span class="badge ${badgeStatus(d.status)}">${d.status}</span></td>
      <td><span class="badge ${badgePrioridade(d.prioridade)}">${d.prioridade}</span></td>
      <td>${d.data_criacao}</td>
      <td>
        <button class="btn-remover" onclick="remover(${d.id})" title="Remover">✕</button>
      </td>
    </tr>
  `).join("");
}

// ── Remover demanda ────────────────────────────────────
async function remover(id) {
  await fetch(`/demandas/${id}`, { method: "DELETE" });
  carregarDemandas();
}

// ── Helpers de badge ───────────────────────────────────
function badgeStatus(s) {
  if (s === "Aberta") return "badge-aberta";
  if (s === "Em andamento") return "badge-andamento";
  return "badge-concluida";
}

function badgePrioridade(p) {
  if (p === "Alta") return "badge-alta";
  if (p === "Média") return "badge-media";
  return "badge-baixa";
}

// Carrega ao abrir a página
carregarDemandas();

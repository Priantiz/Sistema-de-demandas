const SUPABASE_URL = "https://yoamnqxfocjpbqewamta.supabase.co/rest/v1";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvYW1ucXhmb2NqcGJxZXdhbXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NDUxOTcsImV4cCI6MjA5NzAyMTE5N30.cdjwbxcNrEgk2mEgmf4a1zqfRkipy8uVKKrqoe6KQO0";

const headers = {
  "Content-Type": "application/json",
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`
};

document.getElementById("btn-cadastrar").addEventListener("click", async () => {
  const titulo = document.getElementById("titulo").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const localizacao = document.getElementById("localizacao").value.trim();
  const status = document.getElementById("status").value;
  const usuario_id = document.getElementById("usuario_id").value;
  const categoria_id = document.getElementById("categoria_id").value;

  if (!titulo || !descricao) {
    alert("Preencha o título e a descrição.");
    return;
  }

  const res = await fetch(`${SUPABASE_URL}/demandas`, {
    method: "POST",
    headers: { ...headers, "Prefer": "return=representation" },
    body: JSON.stringify({
      titulo,
      descricao,
      localizacao,
      status,
      usuario_id,
      categoria_id
    })
  });

  if (res.ok) {
    alert("Demanda cadastrada com sucesso!");
    carregarDemandas();
  } else {
    const erro = await res.json();
    alert("Erro ao cadastrar: " + erro.message);
  }
});

async function carregarDemandas() {
  const res = await fetch(`${SUPABASE_URL}/demandas?order=id.desc`, {
    headers
  });

  const demandas = await res.json();
  const corpo = document.getElementById("corpo-tabela");

  if (!demandas.length) {
    corpo.innerHTML = `<tr><td colspan="6">Nenhuma demanda cadastrada.</td></tr>`;
    return;
  }

  corpo.innerHTML = demandas.map(d => `
    <tr>
      <td>${d.id}</td>
      <td>${d.titulo}</td>
      <td>${d.descricao}</td>
      <td>${d.localizacao || "-"}</td>
      <td>${d.status}</td>
      <td>
        <button onclick="remover(${d.id})">Remover</button>
      </td>
    </tr>
  `).join("");
}

async function remover(id) {
  await fetch(`${SUPABASE_URL}/demandas?id=eq.${id}`, {
    method: "DELETE",
    headers
  });

  carregarDemandas();
}

carregarDemandas();
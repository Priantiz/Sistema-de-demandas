from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

SUPABASE_URL = "https://yoamnqxfocjpbqewamta.supabase.co/rest/v1"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvYW1ucXhmb2NqcGJxZXdhbXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NDUxOTcsImV4cCI6MjA5NzAyMTE5N30.cdjwbxcNrEgk2mEgmf4a1zqfRkipy8uVKKrqoe6KQO0"

HEADERS = {
    "Content-Type": "application/json",
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}"
}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/demandas", methods=["POST"])
def cadastrar_demanda():
    dados = request.get_json()

    if not dados.get("titulo") or not dados.get("descricao"):
        return jsonify({"erro": "Título e descrição são obrigatórios."}), 400

    nova_demanda = {
        "titulo": dados.get("titulo"),
        "descricao": dados.get("descricao"),
        "localizacao": dados.get("localizacao"),
        "status": dados.get("status", "Pendente"),
        "usuario_id": dados.get("usuario_id"),
        "categoria_id": dados.get("categoria_id")
    }

    resposta = requests.post(
        f"{SUPABASE_URL}/demandas",
        headers={**HEADERS, "Prefer": "return=representation"},
        json=nova_demanda
    )

    return jsonify(resposta.json()), resposta.status_code

@app.route("/demandas", methods=["GET"])
def listar_demandas():
    resposta = requests.get(
        f"{SUPABASE_URL}/demandas?order=id.desc",
        headers=HEADERS
    )

    return jsonify(resposta.json()), resposta.status_code

@app.route("/demandas/<int:demanda_id>", methods=["DELETE"])
def remover_demanda(demanda_id):
    resposta = requests.delete(
        f"{SUPABASE_URL}/demandas?id=eq.{demanda_id}",
        headers=HEADERS
    )

    if resposta.status_code in [200, 204]:
        return jsonify({"mensagem": "Demanda removida com sucesso."}), 200

    return jsonify({"erro": "Erro ao remover demanda."}), resposta.status_code

if __name__ == "__main__":
    app.run(debug=True)

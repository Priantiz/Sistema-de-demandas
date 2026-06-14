from flask import Flask, request, jsonify, render_template
from datetime import datetime

app = Flask(__name__)

demandas = []
contador = {"id": 1}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/demandas", methods=["POST"])
def cadastrar_demanda():
    dados = request.get_json()

    if not dados.get("titulo") or not dados.get("responsavel"):
        return jsonify({"erro": "Título e responsável são obrigatórios."}), 400

    demanda = {
        "id": contador["id"],
        "titulo": dados["titulo"],
        "descricao": dados.get("descricao", ""),
        "status": dados.get("status", "Aberta"),
        "prioridade": dados.get("prioridade", "Média"),
        "responsavel": dados["responsavel"],
        "data_criacao": datetime.now().strftime("%d/%m/%Y")
    }

    demandas.append(demanda)
    contador["id"] += 1

    return jsonify(demanda), 201


@app.route("/demandas", methods=["GET"])
def listar_demandas():
    return jsonify(demandas), 200


@app.route("/demandas/<int:demanda_id>", methods=["DELETE"])
def remover_demanda(demanda_id):
    global demandas
    demandas = [d for d in demandas if d["id"] != demanda_id]
    return jsonify({"mensagem": "Demanda removida."}), 200

if __name__ == "__main__":
    app.run(debug=True)

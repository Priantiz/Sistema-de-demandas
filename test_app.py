from app import app

def test_pagina_inicial():
    cliente = app.test_client()
    resposta = cliente.get("/")
    assert resposta.status_code == 200

def test_listar_demandas():
    cliente = app.test_client()
    resposta = cliente.get("/demandas")
    assert resposta.status_code in [200, 401, 403]
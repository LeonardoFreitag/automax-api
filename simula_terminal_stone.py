#!/usr/bin/env python3
# ============================================================================
# Simulador do terminal SmartPOS Stone (bancada) - faz o papel do app
# Android na fila stonePayment da API AutoMax, sem precisar de Android.
#
# Uso (no Mac ou em qualquer maquina com Python 3, sem dependencias):
#   python3 simula_terminal_stone.py \
#     --url https://automax.htcode.net \
#     --email usuario@dominio.com --senha SUASENHA \
#     --terminal TESTE-01 [--acao approve|decline] [--once]
#
# O que ele faz, em loop (igual ao app real):
#   1. login (POST /users/sessions) e refresh automatico em 401
#   2. GET /stonePayment/pending?terminalId=... a cada 2s
#   3. para cada pedido: PATCH sent_to_terminal, espera 3s (da tempo de
#      ver o "AGUARDANDO O CLIENTE NA MAQUINETA" no modal do PDV) e
#      PATCH approved (ou declined, com --acao decline)
#
# Teste de ponta a ponta da bancada: PDV cria o pedido -> este script
# "paga" -> modal do PDV aprova -> conferir PDV_RECEB_PAGTOS no IBExpert.
# ============================================================================
import argparse, json, sys, time, urllib.request, urllib.error

def req(method, url, body=None, token=None):
    data = json.dumps(body).encode() if body is not None else None
    r = urllib.request.Request(url, data=data, method=method)
    r.add_header("Content-Type", "application/json")
    if token:
        r.add_header("Authorization", "Bearer " + token)
    try:
        with urllib.request.urlopen(r, timeout=15) as resp:
            txt = resp.read().decode()
            return resp.status, (json.loads(txt) if txt else None)
    except urllib.error.HTTPError as e:
        txt = e.read().decode()
        try: return e.code, json.loads(txt)
        except Exception: return e.code, {"raw": txt}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", required=True)
    ap.add_argument("--email", required=True)
    ap.add_argument("--senha", required=True)
    ap.add_argument("--terminal", required=True)
    ap.add_argument("--acao", choices=["approve", "decline"], default="approve")
    ap.add_argument("--once", action="store_true",
                    help="processa um pedido e sai")
    a = ap.parse_args()
    base = a.url.rstrip("/")

    def login():
        st, r = req("POST", base + "/users/sessions",
                    {"email": a.email, "password": a.senha})
        if st != 200 or not r or "token" not in r:
            sys.exit("Falha no login (HTTP %s): %s" % (st, r))
        print("login OK - customerId:", r.get("user", {}).get("customerId"))
        return r["token"]

    token = login()
    print("polling em %s/stonePayment/pending?terminalId=%s (Ctrl+C sai)"
          % (base, a.terminal))
    while True:
        st, pedidos = req("GET", base + "/stonePayment/pending?terminalId="
                          + a.terminal, token=token)
        if st == 401:
            token = login(); continue
        if st != 200:
            print("pending HTTP", st, pedidos); time.sleep(2); continue
        for p in (pedidos or []):
            pid = p["id"]
            print("\npedido %s  R$ %.2f  %s" % (pid,
                  p.get("amountCents", 0) / 100.0, p.get("transactionType")))
            print("  -> sent_to_terminal")
            req("PATCH", base + "/stonePayment/" + pid,
                {"status": "sent_to_terminal"}, token)
            time.sleep(3)  # "cliente passando o cartao"
            if a.acao == "approve":
                corpo = {"status": "approved",
                         "authorizationCode": "123456",
                         "brand": "visa", "atk": "SIMULADO-ATK-001",
                         "itk": "SIMULADO-ITK-001", "panMasked": "1234",
                         "entryMode": "contactless",
                         "cardholderName": "TESTE BANCADA",
                         "installmentCount": 1}
            else:
                corpo = {"status": "declined"}
            st2, r2 = req("PATCH", base + "/stonePayment/" + pid, corpo, token)
            print("  -> %s (HTTP %s)" % (a.acao, st2))
            if a.once:
                return
        time.sleep(2)

if __name__ == "__main__":
    main()

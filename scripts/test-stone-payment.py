#!/usr/bin/env python3
"""
Roteiro de aceite do módulo stonePayment (docs/STONE_PAYMENT.md).

Executa os 7 critérios de pronto do prompt original, mais o isolamento entre
customers e as validações de entrada. Não precisa de Android nem de Delphi:
só de uma API rodando e de um usuário de teste.

    API_URL=http://localhost:3333 \
    EMAIL_A=caixa-a@empresa.com PASS_A=senha \
    EMAIL_B=caixa-b@outra.com  PASS_B=senha \
    python3 scripts/test-stone-payment.py

EMAIL_B/PASS_B são opcionais: sem eles, os testes de isolamento entre customers
são pulados (precisam de um usuário de OUTRO customer). O passo 7 espera 65s
de propósito — é o pedido vencendo.

O script só cria pedidos de pagamento; não altera nenhum outro cadastro.
"""
import json, os, sys, time, urllib.request, urllib.error

API = os.environ.get('API_URL', 'http://127.0.0.1:3333').rstrip('/')
EMAIL_A = os.environ.get('EMAIL_A')
PASS_A = os.environ.get('PASS_A')
EMAIL_B = os.environ.get('EMAIL_B')
PASS_B = os.environ.get('PASS_B')
TERMINAL = os.environ.get('TERMINAL_ID', 'TESTE-T1')
TERMINAL2 = TERMINAL + '-EXP'

if not EMAIL_A or not PASS_A:
    sys.exit('Defina EMAIL_A e PASS_A (usuário de teste da API).')

results = []

def call(method, path, token=None, body=None):
    req = urllib.request.Request(API + path, method=method)
    req.add_header('Content-Type', 'application/json')
    if token:
        req.add_header('Authorization', 'Bearer ' + token)
    data = json.dumps(body).encode() if body is not None else None
    try:
        with urllib.request.urlopen(req, data) as r:
            return r.status, json.loads(r.read() or b'null')
    except urllib.error.HTTPError as e:
        raw = e.read()
        try:
            return e.code, json.loads(raw or b'null')
        except Exception:
            return e.code, raw.decode(errors='replace')

def check(n, desc, cond, detail=''):
    results.append((n, desc, bool(cond), detail))
    print(('  OK  ' if cond else ' FALHA') + f' | {n}. {desc}' + (f' -> {detail}' if detail else ''))

# login
st, a = call('POST', '/users/sessions', body={'email': EMAIL_A, 'password': PASS_A})
if st != 200 or 'token' not in a:
    sys.exit(f'Login de EMAIL_A falhou (http={st}): {a}')
TA = a['token']
CUSTOMER_A = a['user']['customerId']
print(f'login A={st} customerId={CUSTOMER_A}')

TB = CUSTOMER_B = None
if EMAIL_B and PASS_B:
    st2, b = call('POST', '/users/sessions', body={'email': EMAIL_B, 'password': PASS_B})
    if st2 == 200 and 'token' in b:
        TB, CUSTOMER_B = b['token'], b['user']['customerId']
        print(f'login B={st2} customerId={CUSTOMER_B}')
        if CUSTOMER_B == CUSTOMER_A:
            print('AVISO: os dois usuarios sao do MESMO customer; isolamento nao sera testado.')
            TB = None
    else:
        print(f'AVISO: login de EMAIL_B falhou (http={st2}); isolamento nao sera testado.')
else:
    print('EMAIL_B/PASS_B nao informados: testes de isolamento entre customers serao pulados.')
print()

# 1
st, o1 = call('POST', '/stonePayment', TA, {'terminalId': TERMINAL, 'externalRef': 'V1', 'amountCents': 1000, 'transactionType': 'CREDIT'})
check(1, 'POST /stonePayment devolve id e status pending',
      st == 200 and o1.get('status') == 'pending' and o1.get('id'),
      f'http={st} status={o1.get("status")} customerId={o1.get("customerId")} expiresAt={o1.get("expiresAt")}')

# 2
st, fila = call('GET', f'/stonePayment/pending?terminalId={TERMINAL}', TA)
check(2, 'GET /pending?terminalId= mostra o pedido',
      st == 200 and any(x['id'] == o1['id'] for x in fila), f'http={st} itens={len(fila)}')

# 3
st3a, r3a = call('PATCH', f'/stonePayment/{o1["id"]}', TA, {'status': 'sent_to_terminal'})
st3b, r3b = call('PATCH', f'/stonePayment/{o1["id"]}', TA,
                 {'status': 'approved', 'authorizationCode': '123456', 'brand': 'VISA',
                  'panMasked': '**** 1234', 'entryMode': 'CHIP'})
check(3, 'PATCH sent_to_terminal e depois approved',
      st3a == 200 and r3a['status'] == 'sent_to_terminal' and st3b == 200 and r3b['status'] == 'approved',
      f'{r3a.get("status")} -> {r3b.get("status")}')

# 4
st, r4 = call('GET', f'/stonePayment/{o1["id"]}', TA)
check(4, 'GET /:id devolve approved com authorizationCode e brand',
      st == 200 and r4['status'] == 'approved' and r4['authorizationCode'] == '123456' and r4['brand'] == 'VISA',
      f'status={r4.get("status")} auth={r4.get("authorizationCode")} brand={r4.get("brand")} pan={r4.get("panMasked")}')

# 5 idempotencia
st, r5 = call('PATCH', f'/stonePayment/{o1["id"]}', TA,
              {'status': 'declined', 'authorizationCode': '999999', 'brand': 'ELO'})
check(5, 'Repetir PATCH em status final: 200 e nada muda',
      st == 200 and r5['status'] == 'approved' and r5['authorizationCode'] == '123456'
      and r5['updatedAt'] == r4['updatedAt'],
      f'http={st} status={r5.get("status")} auth={r5.get("authorizationCode")} updatedAt inalterado={r5.get("updatedAt")==r4.get("updatedAt")}')

# 6 cancelamento
st, o2 = call('POST', '/stonePayment', TA, {'terminalId': TERMINAL, 'externalRef': 'V2', 'amountCents': 2500, 'transactionType': 'DEBIT'})
stc, r6 = call('POST', f'/stonePayment/{o2["id"]}/cancel', TA)
st, fila2 = call('GET', f'/stonePayment/pending?terminalId={TERMINAL}', TA)
check(6, 'cancel em pending vira canceled e some da fila',
      stc == 200 and r6['status'] == 'canceled' and not any(x['id'] == o2['id'] for x in fila2),
      f'http={stc} status={r6.get("status")} ainda na fila={any(x["id"]==o2["id"] for x in fila2)}')

stc2, r6b = call('POST', f'/stonePayment/{o2["id"]}/cancel', TA)
check('6b', 'cancel em status final devolve 409 com o registro',
      stc2 == 409 and r6b.get('status') == 'canceled', f'http={stc2} status={r6b.get("status")}')

# extra: sent_to_terminal -> cancelRequested
st, o4 = call('POST', '/stonePayment', TA, {'terminalId': TERMINAL, 'externalRef': 'V4', 'amountCents': 700, 'transactionType': 'CREDIT'})
call('PATCH', f'/stonePayment/{o4["id"]}', TA, {'status': 'sent_to_terminal'})
stc3, r6c = call('POST', f'/stonePayment/{o4["id"]}/cancel', TA)
st, fila3 = call('GET', f'/stonePayment/pending?terminalId={TERMINAL}', TA)
check('6c', 'cancel em sent_to_terminal marca cancelRequested e aparece na fila do app',
      stc3 == 200 and r6c['cancelRequested'] is True and r6c['status'] == 'sent_to_terminal'
      and any(x['id'] == o4['id'] for x in fila3),
      f'status={r6c.get("status")} cancelRequested={r6c.get("cancelRequested")}')

# 7 expiracao
st, o3 = call('POST', '/stonePayment', TA, {'terminalId': TERMINAL2, 'externalRef': 'V3', 'amountCents': 500, 'transactionType': 'CREDIT', 'expiresInMinutes': 1})
print('   ... aguardando 65s para o pedido vencer ...')
time.sleep(65)
st, r7 = call('GET', f'/stonePayment/{o3["id"]}', TA)
st, fila4 = call('GET', f'/stonePayment/pending?terminalId={TERMINAL2}', TA)
check(7, 'pedido vencido vira expired na leitura e sai da fila',
      st == 200 and r7['status'] == 'expired' and not any(x['id'] == o3['id'] for x in fila4),
      f'status={r7.get("status")} na fila={any(x["id"]==o3["id"] for x in fila4)}')

# isolamento entre customers (precisa de um usuario de outro customer)
if TB:
    st8a, r8a = call('GET', f'/stonePayment/{o1["id"]}', TB)
    st8b, r8b = call('PATCH', f'/stonePayment/{o1["id"]}', TB, {'status': 'approved', 'authorizationCode': 'HACK'})
    st8c, r8c = call('POST', f'/stonePayment/{o1["id"]}/cancel', TB)
    st8d, fila_b = call('GET', f'/stonePayment/pending?terminalId={TERMINAL}', TB)
    st8e, r8e = call('POST', '/stonePayment', TA,
                     {'customerId': CUSTOMER_B, 'terminalId': TERMINAL,
                      'externalRef': 'V9', 'amountCents': 100, 'transactionType': 'CREDIT'})
    check('8a', 'customer B nao le pedido do A (403)', st8a == 403, f'http={st8a}')
    check('8b', 'customer B nao grava no pedido do A (403)', st8b == 403, f'http={st8b}')
    check('8c', 'customer B nao cancela pedido do A (403)', st8c == 403, f'http={st8c}')
    check('8d', 'fila do terminal do customer B vem vazia', st8d == 200 and len(fila_b) == 0, f'http={st8d} itens={len(fila_b)}')
    check('8e', 'POST com customerId divergente do token: 403', st8e == 403, f'http={st8e} msg={r8e.get("message") if isinstance(r8e,dict) else r8e}')

else:
    print('  ....  | 8. isolamento entre customers PULADO (sem EMAIL_B/PASS_B)')

# validacoes
st9a, _ = call('POST', '/stonePayment', TA, {'terminalId': TERMINAL, 'externalRef': 'X', 'amountCents': 0, 'transactionType': 'CREDIT'})
st9b, _ = call('POST', '/stonePayment', TA, {'terminalId': TERMINAL, 'externalRef': 'X', 'amountCents': 100, 'transactionType': 'PIX'})
st9c, _ = call('POST', '/stonePayment', TA, {'terminalId': TERMINAL, 'externalRef': 'X', 'amountCents': 100, 'transactionType': 'DEBIT', 'installmentCount': 3})
st9d, r9d = call('POST', '/stonePayment', TA, {'terminalId': TERMINAL, 'externalRef': 'X', 'amountCents': 100, 'transactionType': 'CREDIT', 'installmentType': 'MERCHANT', 'installmentCount': 3})
st9e, _ = call('POST', '/stonePayment', TA, {'terminalId': TERMINAL, 'externalRef': 'X', 'amountCents': 100, 'transactionType': 'CREDIT', 'expiresInMinutes': 200})
st9f, _ = call('GET', f'/stonePayment/{o1["id"]}')
check('9a', 'amountCents=0 recusado', st9a == 400, f'http={st9a}')
check('9b', 'transactionType fora do enum recusado', st9b == 400, f'http={st9b}')
check('9c', 'installmentCount sem installmentType recusado', st9c == 400, f'http={st9c}')
check('9d', 'parcelamento MERCHANT 3x aceito', st9d == 200 and r9d.get('installmentCount') == 3, f'http={st9d}')
check('9e', 'expiresInMinutes acima de 182 recusado', st9e == 400, f'http={st9e}')
check('9f', 'sem token: 401', st9f == 401, f'http={st9f}')

# 10. Pix (INSTANT_PAYMENT) — o contrato ja previa; estes casos travam a regressao
PIX_URI = ('payment-app://response?transaction_status=SUCCESS'
           '&transaction_type=INSTANT_PAYMENT&amount=4990&authorization_code='
           '&end_to_end_id=E12345678202608311234567890&brand=')
st, x1 = call('POST', '/stonePayment', TA, {'terminalId': TERMINAL, 'externalRef': 'PIX-1',
                                            'amountCents': 4990, 'transactionType': 'INSTANT_PAYMENT'})
check('10a', 'POST INSTANT_PAYMENT sem installment* -> pending',
      st == 200 and x1.get('status') == 'pending' and x1.get('transactionType') == 'INSTANT_PAYMENT',
      f'http={st} installmentType={x1.get("installmentType")}')

st, filapix = call('GET', f'/stonePayment/pending?terminalId={TERMINAL}', TA)
check('10b', 'fila entrega transactionType INSTANT_PAYMENT ao app',
      st == 200 and any(i['id'] == x1['id'] and i['transactionType'] == 'INSTANT_PAYMENT' for i in filapix))

call('PATCH', f'/stonePayment/{x1["id"]}', TA, {'status': 'sent_to_terminal'})
st, x1r = call('PATCH', f'/stonePayment/{x1["id"]}', TA,
               {'status': 'approved', 'authorizationCode': '', 'brand': '', 'rawResponse': PIX_URI})
check('10c', 'Pix aprovado com authorizationCode/brand vazios e rawResponse cru',
      st == 200 and x1r['status'] == 'approved' and x1r['rawResponse'] == PIX_URI, f'http={st}')

st, x2 = call('POST', '/stonePayment', TA, {'terminalId': TERMINAL, 'externalRef': 'PIX-2',
                                            'amountCents': 100, 'transactionType': 'INSTANT_PAYMENT'})
st, x2r = call('PATCH', f'/stonePayment/{x2["id"]}', TA,
               {'status': 'approved', 'endToEndId': 'E999', 'rawResponse': PIX_URI})
check('10d', 'campo nao previsto no PATCH e aceito e preservado em rawResponse.extraFields',
      st == 200 and isinstance(x2r.get('rawResponse'), dict)
      and x2r['rawResponse'].get('extraFields', {}).get('endToEndId') == 'E999'
      and x2r['rawResponse'].get('rawResponse') == PIX_URI,
      f'http={st}')

st, x3 = call('POST', '/stonePayment', TA, {'terminalId': TERMINAL, 'externalRef': 'PIX-3',
                                            'amountCents': 100, 'transactionType': 'INSTANT_PAYMENT'})
st10e, _ = call('PATCH', f'/stonePayment/{x3["id"]}', TA, {'status': 'pago'})
st10f, _ = call('PATCH', f'/stonePayment/{x3["id"]}', TA, {'status': 'approved', 'panMasked': 'X' * 40})
st10g, _ = call('POST', '/stonePayment', TA, {'terminalId': TERMINAL, 'externalRef': 'PIX-4',
                                              'amountCents': 100, 'transactionType': 'INSTANT_PAYMENT',
                                              'installmentCount': 3})
check('10e', 'tolerancia nao afrouxou: status fora do enum ainda 400', st10e == 400, f'http={st10e}')
check('10f', 'tolerancia nao afrouxou: panMasked > 30 chars ainda 400', st10f == 400, f'http={st10f}')
check('10g', 'installmentCount em Pix recusado', st10g == 400, f'http={st10g}')

# 11. Estorno (operation=cancellation) e credito parcelado — PROMPT ESTORNO/PARCELADO
TERM_C = TERMINAL + '-EST'

# 11.1 pagamento aprovado com atk (simulando o app)
st, pg = call('POST', '/stonePayment', TA, {'terminalId': TERM_C, 'externalRef': 'EST-PAG-1',
                                            'amountCents': 500, 'transactionType': 'CREDIT'})
call('PATCH', f'/stonePayment/{pg["id"]}', TA, {'status': 'sent_to_terminal'})
st, pgr = call('PATCH', f'/stonePayment/{pg["id"]}', TA,
               {'status': 'approved', 'atk': 'ATK-TESTE-1', 'authorizationCode': '111', 'brand': 'MASTER'})
check('11.1', 'pagamento aprovado com atk ATK-TESTE-1',
      st == 200 and pgr['status'] == 'approved' and pgr['atk'] == 'ATK-TESTE-1' and pgr['operation'] == 'payment')

# 11.2 cria o cancellation -> pending, e a fila mostra operation + targetAtk
st, ca = call('POST', '/stonePayment', TA, {'terminalId': TERM_C, 'externalRef': 'EST-1',
                                            'amountCents': 500, 'operation': 'cancellation',
                                            'targetPaymentId': pg['id']})
st2, filac = call('GET', f'/stonePayment/pending?terminalId={TERM_C}', TA)
na_fila = [i for i in filac if i['id'] == ca.get('id')]
check('11.2', 'POST cancellation -> pending; GET pending mostra operation e targetAtk',
      st == 200 and ca.get('status') == 'pending' and ca.get('operation') == 'cancellation'
      and ca.get('targetAtk') == 'ATK-TESTE-1' and ca.get('targetPaymentId') == pg['id']
      and na_fila and na_fila[0]['operation'] == 'cancellation' and na_fila[0]['targetAtk'] == 'ATK-TESTE-1',
      f'http={st} status={ca.get("status")} operation={ca.get("operation")} targetAtk={ca.get("targetAtk")} '
      f'transactionType(copiado)={ca.get("transactionType")}')

# 11.3 estorno em andamento bloqueia um segundo estorno do mesmo pagamento
st3, dup = call('POST', '/stonePayment', TA, {'terminalId': TERM_C, 'externalRef': 'EST-1b',
                                              'amountCents': 500, 'operation': 'cancellation',
                                              'targetPaymentId': pg['id']})
check('11.3', 'segundo estorno do mesmo pagamento com um em andamento -> 422', st3 == 422,
      f'http={st3} msg={dup.get("message") if isinstance(dup, dict) else dup}')

# 11.4 PATCH do cancellation para approved -> GET reflete, alvo ganha refundedByOrderId
call('PATCH', f'/stonePayment/{ca["id"]}', TA, {'status': 'sent_to_terminal'})
st, car = call('PATCH', f'/stonePayment/{ca["id"]}', TA,
               {'status': 'approved', 'atk': 'ATK-TESTE-1',
                'rawResponse': 'automaxpos://cancel?success=true&atk=ATK-TESTE-1&canceledamount=500&responsecode=0000'})
st4, cag = call('GET', f'/stonePayment/{ca["id"]}', TA)
st5, pgg = call('GET', f'/stonePayment/{pg["id"]}', TA)
check('11.4', 'PATCH cancellation approved -> GET reflete; pagamento alvo com refundedByOrderId',
      st == 200 and st4 == 200 and cag['status'] == 'approved' and cag['operation'] == 'cancellation'
      and pgg.get('refundedByOrderId') == ca['id'],
      f'refundedByOrderId={pgg.get("refundedByOrderId")}')

# 11.5 pagamento ja estornado nao aceita novo estorno
st6, dup2 = call('POST', '/stonePayment', TA, {'terminalId': TERM_C, 'externalRef': 'EST-1c',
                                               'amountCents': 500, 'operation': 'cancellation',
                                               'targetPaymentId': pg['id']})
check('11.5', 'estornar pagamento ja estornado -> 422', st6 == 422,
      f'msg={dup2.get("message") if isinstance(dup2, dict) else dup2}')

# 11.6 cancellation apontando para pedido pending (nao aprovado) -> 422
st, pend = call('POST', '/stonePayment', TA, {'terminalId': TERM_C, 'externalRef': 'EST-PAG-2',
                                              'amountCents': 300, 'transactionType': 'DEBIT'})
st7, r7 = call('POST', '/stonePayment', TA, {'terminalId': TERM_C, 'externalRef': 'EST-2',
                                             'amountCents': 300, 'operation': 'cancellation',
                                             'targetPaymentId': pend['id']})
check('11.6', 'cancellation apontando para pedido pending -> 422', st7 == 422,
      f'http={st7} msg={r7.get("message") if isinstance(r7, dict) else r7}')

# 11.7 targetPaymentId inexistente -> 422
st8, r8 = call('POST', '/stonePayment', TA, {'terminalId': TERM_C, 'externalRef': 'EST-3',
                                             'amountCents': 100, 'operation': 'cancellation',
                                             'targetPaymentId': '00000000-0000-0000-0000-000000000000'})
check('11.7', 'targetPaymentId inexistente -> 422', st8 == 422, f'http={st8}')

# 11.8 pagamento aprovado SEM atk -> 422 com mensagem clara
st, semAtk = call('POST', '/stonePayment', TA, {'terminalId': TERM_C, 'externalRef': 'EST-PAG-3',
                                                'amountCents': 200, 'transactionType': 'DEBIT'})
call('PATCH', f'/stonePayment/{semAtk["id"]}', TA, {'status': 'approved', 'authorizationCode': '222'})
st9, r9 = call('POST', '/stonePayment', TA, {'terminalId': TERM_C, 'externalRef': 'EST-4',
                                             'amountCents': 200, 'operation': 'cancellation',
                                             'targetPaymentId': semAtk['id']})
check('11.8', 'pagamento aprovado sem atk -> 422 "sem atk"',
      st9 == 422 and 'atk' in str(r9.get('message', '') if isinstance(r9, dict) else r9),
      f'msg={r9.get("message") if isinstance(r9, dict) else r9}')

# 11.9 amountCents maior que o pagamento -> 422; cancellation sem targetPaymentId -> 400
st, pg4 = call('POST', '/stonePayment', TA, {'terminalId': TERM_C, 'externalRef': 'EST-PAG-4',
                                             'amountCents': 1000, 'transactionType': 'CREDIT'})
call('PATCH', f'/stonePayment/{pg4["id"]}', TA, {'status': 'approved', 'atk': 'ATK-4'})
st10, _ = call('POST', '/stonePayment', TA, {'terminalId': TERM_C, 'externalRef': 'EST-5',
                                             'amountCents': 1001, 'operation': 'cancellation',
                                             'targetPaymentId': pg4['id']})
st11, _ = call('POST', '/stonePayment', TA, {'terminalId': TERM_C, 'externalRef': 'EST-6',
                                             'amountCents': 100, 'operation': 'cancellation'})
check('11.9', 'amountCents > pagamento -> 422; cancellation sem targetPaymentId -> 400',
      st10 == 422 and st11 == 400, f'http={st10}/{st11}')

# 11.10 estorno negado libera nova tentativa
st, ca4 = call('POST', '/stonePayment', TA, {'terminalId': TERM_C, 'externalRef': 'EST-7',
                                             'amountCents': 1000, 'operation': 'cancellation',
                                             'targetPaymentId': pg4['id']})
call('PATCH', f'/stonePayment/{ca4["id"]}', TA, {'status': 'declined', 'rawResponse': 'automaxpos://cancel?success=false&reason=x'})
st12, ca5 = call('POST', '/stonePayment', TA, {'terminalId': TERM_C, 'externalRef': 'EST-8',
                                               'amountCents': 1000, 'operation': 'cancellation',
                                               'targetPaymentId': pg4['id']})
st13, pg4g = call('GET', f'/stonePayment/{pg4["id"]}', TA)
check('11.10', 'estorno declined nao marca o pagamento e libera nova tentativa',
      st12 == 200 and ca5.get('status') == 'pending' and pg4g.get('refundedByOrderId') is None,
      f'http={st12} refundedByOrderId={pg4g.get("refundedByOrderId")}')

# 11.11 isolamento: customer B nao consegue estornar pagamento do A
if TB:
    st14, r14 = call('POST', '/stonePayment', TB, {'terminalId': TERM_C, 'externalRef': 'EST-B',
                                                   'amountCents': 500, 'operation': 'cancellation',
                                                   'targetPaymentId': pg['id']})
    check('11.11', 'customer B estornando pagamento do A -> 422 (alvo "nao encontrado")', st14 == 422, f'http={st14}')

# 11.12 credito parcelado: MERCHANT 2x aceito e GET pending devolve os dois campos
st, parc = call('POST', '/stonePayment', TA, {'terminalId': TERM_C, 'externalRef': 'PARC-1',
                                              'amountCents': 20000, 'transactionType': 'CREDIT',
                                              'installmentType': 'MERCHANT', 'installmentCount': 2})
st15, filap = call('GET', f'/stonePayment/pending?terminalId={TERM_C}', TA)
itemp = [i for i in filap if i['id'] == parc.get('id')]
check('11.12', 'CREDIT + MERCHANT + installmentCount=2 -> pending; GET pending devolve os dois campos',
      st == 200 and parc.get('status') == 'pending' and itemp
      and itemp[0]['installmentType'] == 'MERCHANT' and itemp[0]['installmentCount'] == 2
      and itemp[0]['operation'] == 'payment',
      f'http={st} installmentType={parc.get("installmentType")} installmentCount={parc.get("installmentCount")}')

print('\n==================== RESUMO ====================')
falhas = [r for r in results if not r[2]]
for n, desc, ok, _ in results:
    print(f'{"PASSOU" if ok else "FALHOU"}  {n}. {desc}')
print(f'\n{len(results)-len(falhas)}/{len(results)} verificacoes passaram')
sys.exit(1 if falhas else 0)
